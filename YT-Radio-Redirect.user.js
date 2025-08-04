// ==UserScript==
// @name         YT Radio Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Rewrites music links to not automatically be a radio playlist
// @author       Mid, Adowrath
// @icon         https://www.youtube.com/favicon.ico
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL  https://github.com/Midtan/Useful-Misc/raw/main/YT-Radio-Redirect.user.js
// ==/UserScript==

'use strict';

const videoToWatch = (url) => {
    let urlObject = new URL(url);
		if (urlObject.searchParams.get("start_radio") === "1" && urlObject.searchParams.has("list")) {
    		urlObject.searchParams.delete("start_radio");
    		urlObject.searchParams.delete("list");
		}
    return urlObject.toString();
};

const fixElement = (elem) => {
    if(elem instanceof HTMLAnchorElement && elem.href !== "") {
        let newHref = videoToWatch(elem.href);
        if(newHref !== elem.href) {
            elem.href = newHref;
        }
    }
};

let cachedLocation = null;
const locationChanged = (newLocation) => {
    cachedLocation = newLocation;
    const fixedLocation = videoToWatch(cachedLocation);
    if(fixedLocation !== cachedLocation) {
        location.replace(fixedLocation);
    }
};
locationChanged(location.href);

window.addEventListener("load", () => {
    const observer = new MutationObserver((mutations, obs) => {
        if(location.href !== cachedLocation) {
            locationChanged(location.href);
        }

        for(const mutation of mutations) {
            switch(mutation.type) {
                case 'childList':
                    for(const elem of mutation.addedNodes) fixElement(elem);
                    break;
                case 'attributes':
                    fixElement(mutation.target);
                    break;
            }
        }
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: [ 'href' ],
        childList: true,
        subtree: true
    });

    for(let element of document.querySelectorAll("a")) {
        fixElement(element);
    }
});
