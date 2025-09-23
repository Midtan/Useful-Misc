// ==UserScript==
// @name         Date and Channel in Title
// @namespace    http://tampermonkey.net/
// @version      v1.1
// @description  Adds Date and Channel to the tab's title
// @author       Adowrath
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://github.com/Adowrath/Useful-Misc/raw/main/YT-Date-Channel-Title.user.js
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    function findTitle() {
        let videoObject = document.querySelector(`div[itemtype="http://schema.org/VideoObject"]`);

        let datePublished = videoObject.querySelector(`[itemprop="datePublished"]`).content;
        let uploadDate = videoObject.querySelector(`[itemprop="uploadDate"]`).content;
        let channel = videoObject.querySelector(`[itemprop="author"] [itemprop="name"]`).getAttribute("content");
        let title = videoObject.querySelector(`[itemprop="name"]`).content;

        if(datePublished !== uploadDate) throw new Error("Incompatible dates");
        let date = datePublished.split("T")[0];

        return `[${date}] - [${channel}] - ${title}`;
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function fillTitle() {
        while(true) {
            let loc = location.href;

            if(location.pathname !== "/watch") {
                await sleep(5000);
                continue;
            }
            let title;
            try {
                title = findTitle();
            } catch(e) {
                console.error(e);
                alert("Error!");
                return;
            }
            while(true) {
                if(location.href !== loc) break;
                if(document.title !== title) document.title = title;
                await sleep(100);
            }
        }
    }

    window.addEventListener("yt-navigate-finish", fillTitle);
})();
