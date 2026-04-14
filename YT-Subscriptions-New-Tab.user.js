// ==UserScript==
// @name         YT Subscriptions - Open in New Tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Opens all video links on YouTube subscription feed in a new tab
// @author       Mid
// @icon         https://www.youtube.com/favicon.ico
// @match        https://www.youtube.com/feed/subscriptions
// @grant        none
// @downloadURL  https://github.com/Midtan/Useful-Misc/raw/main/YT-Subscriptions-New-Tab.user.js
// ==/UserScript==

'use strict';

document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || !href.startsWith('/watch')) return;

    e.preventDefault();
    e.stopPropagation();
    window.open('https://www.youtube.com' + href, '_blank');
}, true);
