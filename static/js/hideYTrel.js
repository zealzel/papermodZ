"use strict";
if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);

function init() {
    if (window.runOnce) return;

    if (typeof YT === 'undefined') {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    var iframes = [];
    
    for (var iframe of document.querySelectorAll("iframe[src]")) {
        var src = iframe.getAttribute("src");
        if (src.includes("youtube.com/embed/")) {
            if(!src.includes("enablejsapi=1"))
                if(src.includes("?"))
                    iframe.setAttribute("src", src + "&enablejsapi=1");
                else
                    iframe.setAttribute("src", src + "?enablejsapi=1");

            iframes.push(iframe);
        }
    }

    var overlayStyles = {
        display: "none",
        content:"",
        position: "absolute",
        left: 0,
        right: 0,
        cursor: "pointer",
        backgroundColor: "black",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
    };

    var iframeStyles = {
        position: "absolute",
        width: "100%",
        height: "100%",
    }

    window.onYouTubeIframeAPIReady = function() {
        iframes.forEach(function(iframe) {
            var overlay = document.createElement('div');
            for (var style in overlayStyles) {
                overlay.style[style] = overlayStyles[style];
            }
            
            var wrapper = document.createElement('div');
            wrapper.style.display = "inline-block";
            //wrapper.style.position = "relative";
            wrapper.style.position = "absolute";

            //wrapper.style.padding = "0% 0% 56.25% 0%";

            //wrapper.style.position = "absolute";
            wrapper.style.width = "100%"
            wrapper.style.height = "100%"

            iframe.parentNode.insertBefore(wrapper, iframe);

            for (var style in iframeStyles) {
                iframe.style[style] = iframeStyles[style];
            }

            
            wrapper.appendChild(iframe);
            wrapper.appendChild(overlay);
            
            var onPlayerStateChange = function(event) {
                if (event.data == YT.PlayerState.ENDED) {
                    player.seekTo(0);
                    player.pauseVideo();
                    //overlay.style.backgroundImage = "url(data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgNTEwIDUxMCI+PHBhdGggZD0iTTI1NSAxMDJWMEwxMjcuNSAxMjcuNSAyNTUgMjU1VjE1M2M4NC4xNSAwIDE1MyA2OC44NSAxNTMgMTUzcy02OC44NSAxNTMtMTUzIDE1My0xNTMtNjguODUtMTUzLTE1M0g1MWMwIDExMi4yIDkxLjggMjA0IDIwNCAyMDRzMjA0LTkxLjggMjA0LTIwNC05MS44LTIwNC0yMDQtMjA0eiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg==)";
                    //overlay.style.backgroundSize = "64px 64px";
                    //overlay.style.top = 0;
                    //overlay.style.bottom = 0;
                    //overlay.style.display = "inline-block";

                //} else if (event.data == YT.PlayerState.PAUSED) {
                    //overlay.style.backgroundImage = "url(data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEiIHdpZHRoPSIxNzA2LjY2NyIgaGVpZ2h0PSIxNzA2LjY2NyIgdmlld0JveD0iMCAwIDEyODAgMTI4MCI+PHBhdGggZD0iTTE1Ny42MzUgMi45ODRMMTI2MC45NzkgNjQwIDE1Ny42MzUgMTI3Ny4wMTZ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+)";
                    //overlay.style.backgroundSize = "40px 40px";
                    //overlay.style.top = "40px";
                    //overlay.style.bottom = "50px";
                    //overlay.style.display = "inline-block";
                } else if (event.data == YT.PlayerState.PLAYING) {
                    overlay.style.display = "none";
                }
            };
            
            var player  = new YT.Player(iframe, {
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        
            wrapper.addEventListener("click", function() {
                var playerState = player.getPlayerState();
                if (playerState == YT.PlayerState.ENDED) {
                    player.seekTo(0);
                }
                //} else if (playerState == YT.PlayerState.PAUSED) {
                    //player.playVideo();
                //}
            });
        });
    };
    window.runOnce = true;
}
