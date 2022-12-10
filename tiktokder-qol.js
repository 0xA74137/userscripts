// ==UserScript==
// @name        tiktokder.com - QoL
// @namespace   Violentmonkey Scripts
// @match       https://tiktokder.com/banned-tiktok-videos
// @match       https://tiktokder.com/recent*
// @grant       none
// @version     1.0
// @author      -
// @description 12/10/2022, 9:43:59 PM
// @require     https://unpkg.com/jquery@3.6.1/dist/jquery.min.js
// ==/UserScript==

$(document).ready(function () {

    function _openVideo(videoId, user) {
        let videoContainer = document.getElementById("videoContainer");
        if (!videoContainer) {
            videoContainer = document.createElement("div");
            videoContainer.id = "videoContainer";
            videoContainer.onclick = function () {
                this.style.display = "none"
                Array.from(this.children[0].children).forEach(e => this.children[0].removeChild(e))
            };
            videoContainer.style.width = "100%";
            videoContainer.style.height = "100%";
            videoContainer.style.position = "fixed";
            videoContainer.style.top = "0px";
            videoContainer.style.left = "0px";
            videoContainer.style.zIndex = "9999";
            videoContainer.style.background = "rgba(0, 0, 0, 0.7)";
            videoContainer.style.justifyContent = "center";
            videoContainer.style.display = "none";

            let videoPlayerWrapper = document.createElement("div");
            videoPlayerWrapper.style.maxHeight = "100%";
            videoContainer.appendChild(videoPlayerWrapper);

            if (user) {
                userLink = document.createElement("a");
                userLink.href = "https://urlebird.com/user/" + user + "/";
                userLink.target = "_blank";
                userLink.text = "UrleBird";
                userLink.style.position = "fixed";
                userLink.style.top = "0px";
                userLink.style.left = "0px";
                userLink.style.backgroundColor = "#f44336";
                userLink.style.color = "white";
                userLink.style.padding = "14px 25px";
                userLink.style.textAlign = "center";
                userLink.style.textDecoration = "none";
                userLink.style.display = "inline-block";
                userLink.style.margin = "10px";
                videoContainer.appendChild(userLink);
            }

            document.body.appendChild(videoContainer);
        }

        let video = document.createElement("video");
        video.src = "https://cdn.tiktokder.com/videos/" + videoId + ".mp4";
        video.autoplay = true;
        video.muted = true;
        video.controls = true;
        video.preload = 'none';
        video.loop = true;
        video.style.maxHeight = '80%';
        video.addEventListener("error", function (event) {
            // can't load video without watermark, try again with watermark
            this.src = "https://cdn.tiktokder.com/watermark/" + videoId + ".mp4";
        });

        videoContainer.children[0].appendChild(video);
        videoContainer.style.display = 'flex';
    }

    function fixPreviews() {
        // video-cards have an onclick event that sets the background-image
        //
        // like this:
        // <div class="video-card"
        //      onclick="this.style.backgroundImage = 'url(https://cdn.tiktokder.com/tiktok/taylorthorington_1596913836.jpg)'"
        //      style="">
        // ...
        // </div>
        //
        // Match the "url(...)" part of that event and set background-image without
        // requiring a click on each

        let cards = Array.from(document.getElementsByClassName("video-card"));
        for (const [idx, card] of Object.entries(cards)) {
            try {
                let url = card.onclick.toString().match("url\\(.*?\\)");
                if (url) {
                    card.style.backgroundImage = url;
                    card.removeAttribute("onclick");
                }
            }
            catch (e) {
                console.error(e);
            }
        }

        // Remove play icon from previews, replace with own video player
        $(".video-card > a").each(function (idx) {

            let parts = $(this).attr('href').split("/")
            let user = parts[2];
            let videoId = parts.reverse()[0];
            $(this).parent().click(function () { _openVideo(videoId, user); });
            $(this).remove();

        });
    }

    function removeWhitespace() {
        $("body > .center").remove()
        $("body > .promolink").remove()
        $("body > .pagination").first().remove()
        $("body > h1").remove()
        $("body > h2").remove()
        $("body > p").remove()
        $("body > br").remove()
        $("body > header").remove()
        $("body > .instructions-list").remove()
        document.querySelector(".videos-grid").style.maxWidth = "100%";
        document.querySelector("body > div").remove();
    }

    function _handleKeypress(event) {
        switch (event.originalEvent.key) {
            case "ArrowRight":
            case "d":
            case "l":
                let nextPage = $(".pagination > div").next().attr('href')
                if (nextPage) {
                    window.location.href = nextPage;
                }
                break;
            case "ArrowLeft":
            case "a":
            case "h":
                let prevPage = $(".pagination > div").prev().attr('href')
                if (prevPage) {
                    window.location.href = prevPage;
                }
                break;

        }
        console.log(event.originalEvent.key);
    }

    function addKeypressHandler() {
        $(document).keydown(_handleKeypress);
    }


    fixPreviews();
    removeWhitespace();
    addKeypressHandler();
})