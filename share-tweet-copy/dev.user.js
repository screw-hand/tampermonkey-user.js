// ==UserScript==
// @name         DEV share-tweet-copy(mac)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Try to take over the world!
// @author       You
// @match        https://twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @require      file:///Users/wu/Documents/code/tampermonkey-user.js/share-tweet-copy/script.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';
    GM_setValue("ENV_MODE", "DEV");
})();