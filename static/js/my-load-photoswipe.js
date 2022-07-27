/*
Put this file in /static/js/load-photoswipe.js
Documentation and licence at https://github.com/liwenyip/hugo-easy-gallery/
*/

/* Show an alert if this js file has been loaded twice */
if (window.loadphotoswipejs) {
	window.alert("You've loaded load-photoswipe.js twice. See https://github.com/liwenyip/hugo-easy-gallery/issues/6")
} 
var loadphotoswipejs = 1

/*
porting defaultdict from python
ref: https://stackoverflow.com/questions/19127650/defaultdict-equivalent-in-javascript
*/
class DefaultDict {
  constructor(defaultInit) {
    this.original = defaultInit;
    return new Proxy({}, {
      get: function (target, name) {
        if (name in target) {
          return target[name];
        } else {
          if (typeof defaultInit === "function") {
            target[name] = new defaultInit().valueOf();
          } else if (typeof defaultInit === "object") {
            if (typeof defaultInit.original !== "undefined") {
              target[name] = new DefaultDict(defaultInit.original);
            } else {
              target[name] = JSON.parse(JSON.stringify(defaultInit));
            }
          } else {
            target[name] = defaultInit;
          }
          return target[name];
        }
      }
    });
  }
}

/* TODO: Make the share function work */
$( document ).ready(function() {
	/*
	Initialise Photoswipe
	*/
	var items = []; // array of slide objects that will be passed to PhotoSwipe()
  var III = new DefaultDict(Array);

	// for every figure element on the page:
	$('figure').each( function() {
		if ($(this).attr('class') == 'no-photoswipe') return true; // ignore any figures where class="no-photoswipe"
		// get properties from child a/img/figcaption elements,
		var $figure = $(this),
			$a 		= $figure.find('a'),
			$img 	= $figure.find('img'),
			$itemprop 	= $figure.attr('itemprop'),
			$src	= $a.attr('href'),
			$title  = $img.attr('alt'),
			$msrc	= $img.attr('src');
    var filename = String($src).split("/").slice(-2,-1)[0];
    if (String($itemprop)!="associatedMedia") {
      return
    }

		// if data-size on <a> tag is set, read it and create an item
		if ($a.data('size')) {
			var $size 	= $a.data('size').split('x');
			var item = {
				src		: $src,
				w		: $size[0],
				h 		: $size[1],
				title 	: $title,
				msrc	: $msrc
			};
			//console.log("Using pre-defined dimensions for " + $src);
		// if not, set temp default size then load the image to check actual size
		} else {
			var item = {
				src		: $src,
				w		: 800, // temp default size
				h 		: 600, // temp default size
				title 	: $title,
				msrc	: $msrc
			};
			//console.log("Using default dimensions for " + $src);
			// load the image to check its dimensions
			// update the item as soon as w and h are known (check every 30ms)
			var img = new Image(); 
			img.src = $src;
			var wait = setInterval(function() {
				var w = img.naturalWidth,
					h = img.naturalHeight;
				if (w && h) {
					clearInterval(wait);
					item.w = w;
					item.h = h;
					//console.log("Got actual dimensions for " + img.src);
				}
			}, 30);
	   	}
		// Save the index of this image then add it to the array
		//var index = items.length;
		//items.push(item);
		var index = III[filename].length;
    III[filename].push(item);
    
		// Event handler for click on a figure
		$figure.on('click', function(event) {
      //console.log("clikc!!!!");
			event.preventDefault(); // prevent the normal behaviour i.e. load the <a> hyperlink
			// Get the PSWP element and initialise it with the desired options
			var $pswp = $('.pswp')[0];
			var options = {
        index: index, 
				bgOpacity: 0.8,
				showHideOpacity: true,
        loop: false,
			}
      console.log(index);
      console.log(`length: ${III[filename].length}`);
      //new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options).init();

      //new PhotoSwipe($pswp, PhotoSwipeUI_Default, III[filename], options).init();
      pswp = new PhotoSwipe($pswp, PhotoSwipeUI_Default, III[filename], options);
      $nextBtn = $('.pswp__button--arrow--right', pswp.template);
      $prevBtn = $('.pswp__button--arrow--left', pswp.template);
      pswp.listen('beforeChange', function() {
          $nextBtn.toggle(options.loop || this.getCurrentIndex() < III[filename].length - 1);
          $prevBtn.toggle(options.loop || this.getCurrentIndex() > 0);
      });
      pswp.init();
		});	
	});
});
