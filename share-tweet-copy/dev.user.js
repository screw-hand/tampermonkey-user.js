// ==UserScript==
// @name         DEV share-tweet-copy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Try to take over the world!
// @author       You
// @match        https://twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @require      https://update.greasyfork.org/scripts/482936/share-tweet-copy.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';
    /**
     *  Include external JS scripts here for easy switching.
     */
    // @require      https://update.greasyfork.org/scripts/482936/share-tweet-copy.user.js
    // @require      file:///Users/wu/Documents/code/tampermonkey-user.js/share-tweet-copy/script.user.js

    GM_setValue("ENV_MODE", "DEV");
})();