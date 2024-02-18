$(document).ready(function() {
  if (window.loadphotoswipejs) {
    window.alert("You've loaded load-photoswipe.js twice.");
    return;
  }
  window.loadphotoswipejs = true;
  var galleries = new DefaultDict(Array);

  // 遍历每个带有 data-gallery-id 属性的元素
  $('[data-gallery-id]').each(function() {
    var galleryId = $(this).data('gallery-id');
    console.log("galleryId:", galleryId);
    // 遍历当前图片库中的所有图片
    $(this).find('figure').each(function() {
      var $figure = $(this),
        $a = $figure.find('a'),
        $img = $figure.find('img'),
        src = $a.attr('href'),
        title = $img.attr('alt'),
        msrc = $img.attr('src');
      if ($figure.attr('itemprop') != "associatedMedia") return;
      var item = {
        src: src,
        w: 0, // 宽度，稍后加载图片时更新
        h: 0, // 高度，稍后加载图片时更新
        title: title,
        msrc: msrc
      };
      if ($a.data('size')) {
        var $size = $a.data('size').split('x');
        item.w = $size[0];
        item.h = $size[1];
      } else {
        // Dynamically load image to get its size if not set
        var img = new Image();
        img.onload = function() {
          item.w = this.naturalWidth*1.5;
          item.h = this.naturalHeight*1.5;
        };
        img.src = src;
      }
      galleries[galleryId].push(item);

      $figure.on('click', function(event) {
        event.preventDefault();
        // var index = III[filename].indexOf(item);
        var index = galleries[galleryId].indexOf(item);
        var options = {
          index: index,
          bgOpacity: 0.8,
          showHideOpacity: true,
          loop: false,
        };
        var galleryItems = galleries[galleryId];
        var pswpElement = $('.pswp')[0];
        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, galleryItems, options);
        gallery.init();
      });

    });
  });

  function openPhotoSwipe(galleryId, index) {
    var pswpElement = $('.pswp')[0],
      options = {
        index: index,
        bgOpacity: 0.8,
        showHideOpacity: true,
        loop: false
      },
      galleryItems = galleries[galleryId];
    if (galleryItems) {
      // 初始化 PhotoSwipe
      new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, galleryItems, options).init();
    } else {
      console.error("Gallery items are undefined for galleryId:", galleryId);
    }
    // 初始化 PhotoSwipe
    new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, galleryItems, options).init();
  }
});

class DefaultDict {
  constructor(defaultInit) {
    return new Proxy({}, {
      get: function(target, name) {
        if (!(name in target)) {
          target[name] = typeof defaultInit === 'function' ? new defaultInit().valueOf() : typeof defaultInit === 'object' ? new DefaultDict(defaultInit.original) : defaultInit;
        }
        return target[name];
      }
    });
  }
}
