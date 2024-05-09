// ==UserScript==
// @name         share-tweet-copy
// @namespace    https://screw-hand.com/
// @version      0.4.1
// @description  support twitter to copy, easy to share.
// @author       screw-hand
// @match        https://twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @homepage     https://github.com/screw-hand/tampermonkey-user.js
// @supportURL   https://github.com/screw-hand/tampermonkey-user.js/issues/new
// @downloadURL https://update.greasyfork.org/scripts/482936/share-tweet-copy.user.js
// @updateURL https://update.greasyfork.org/scripts/482936/share-tweet-copy.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * Change Log
   * 
   * Version 0.4.1(2024-04-24)
   *  - dev.user.js (dev mode) support set up USER_TEMPLATE environment variable.
   * 
   * Version 0.4.0 (2024-04-23)
   *  - Tweets are measured by character count, and if the character count exceeds the limit, it is replaced with an ellipsis;
   *  - If the number of line breaks in a tweet exceeds the limit, it is replaced with an ellipsis.
   *  - support environment variable
   *
   * Version 0.3.16 (2024-04-17)
   *  - Fix username's emoji cannot be copied
   *
   * Version 0.3.15 (2024-01-24)
   *  - Fix margin for copy-tweet-button
   *
   * Version 0.3.14 (2024-01-24)
   *  - Fix button style on status page.
   *
   * Version 0.3.13 (2023-01-11)
   *  - Fix add newline between original and translated text in Immersive Translate.
   *
   * Version 0.3.12 (2023-12-29)
   *  - Fix media static error result count, add card link count.
   *
   * Version 0.3.11 (2023-12-29)
   *  - Fix media static error result count.
   *
   * Version 0.3.10 (2023-12-29)
   *  - temp update status page style
   *  - update failedmark icon svg
   *
   * Version 0.3.9 (2023-12-29)
   *  - fix copy result is undefined
   *
   * Version 0.3.8 (2023-12-29)
   *  - notify about copy failed
   *
   * Version 0.3.7 (2023-12-29)
   *  - recover homepage and supportURL config.
   *
   * Version 0.3.6 (2023-12-29)
   *  - Media count support static git, video, and more media card.
   *
   * Version 0.3.5 (2023-12-25)
   *  - Rename script path of github repo.
   *
   * Version 0.3.4 (2023-12-25)
   *  - Update media count default template.
   *
   * Version 0.3.3 (2023-12-25)
   *  - Chore indent use 2 spaces.
   *  - Feat remove multiple blank lines.
   *
   * Version 0.3.2 (2023-12-24)
   *  - Chore indent use 2 spaces.
   *
   * Version 0.3.1 (2023-12-23)
   *  - Fixed issue with copying reposted tweets: now correctly retrieves user name.
   *  - Optimized the teewText format, when copy the context with `@usernmae` not line feed.
   *  - Fxied copy emoji. Pre-condition: The user's system supports displaying that emoji.
   *  - Feature: Statistics the pic total count, for base feature.
   *
   *
   * Version 0.3.0 (2023-12-23)
   *   - Public the script to Greasy Fork.
   *   - Delete updateURL, donwupdateURL.
   *
   * Version 0.2 (2023-12-13)
   *   - Added styles for the copy-tweet button, including support for dark mode.
   *   - Implemented a tooltip to show the result of the copy action.
   *   - Enhanced dark mode support for better user experience in various lighting conditions.
   *
   * Version 0.1 (2023-12-13)
   *   - Initial release.
   *   - Basic functionality to copy tweet text to clipboard with a simple template.
   */

  /**
   * Defines the styles for the copy button.
   * This includes support for dark mode and styling for various states like hover and focus.
   */

  const main  =() => {
    console.log('hello, world!')
  }

  main()
})();
