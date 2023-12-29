// ==UserScript==
// @name         share-tweet-copy
// @namespace    https://screw-hand.com/
// @version      0.3.6
// @description  support twitter to copy, easy to share.
// @author       screw-hand
// @match        https://twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @grant        GM_addStyle
// @homepage     https://github.com/screw-hand/tampermonkey-user.js
// @supportURL   https://github.com/screw-hand/tampermonkey-user.js/issues/new
// ==/UserScript==

(function () {
  'use strict';

  /**
   * Change Log
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
   * TODO
   * 1. support user custom input the share template
   *
   * FIXME
   * 1. notify about copy failed
   */

  /**
   * Defines the styles for the copy button.
   * This includes support for dark mode and styling for various states like hover and focus.
   */
  const copyBtnStyle = `
  .copy-tweet-button {
    --button-bg: #e5e6eb;
    --button-hover-bg: #d7dbe2;
    --button-text-color: #4e5969;
    --button-hover-text-color: #164de5;
    --button-border-radius: 6px;
    --button-diameter: 24px;
    --button-outline-width: 2px;
    --button-outline-color: #9f9f9f;
    --tooltip-bg: #1d2129;
    --toolptip-border-radius: 4px;
    --tooltip-font-family: JetBrains Mono, Consolas, Menlo, Roboto Mono, monospace;
    --tooltip-font-size: 12px;
    --tootip-text-color: #fff;
    --tooltip-padding-x: 7px;
    --tooltip-padding-y: 7px;
    --tooltip-offset: 8px;
    /* --tooltip-transition-duration: 0.3s; */
  }

  @media (prefers-color-scheme: dark) {
    .copy-tweet-button {
      --button-bg: #353434;
      --button-hover-bg: #464646;
      --button-text-color: #ccc;
      --button-outline-color: #999;
      --button-hover-text-color: #8bb9fe;
      --tooltip-bg: #f4f3f3;
      --tootip-text-color: #111;
    }
  }

  .copy-tweet-button {
    box-sizing: border-box;
    width: var(--button-diameter);
    height: var(--button-diameter);
    margin-left: 8px;
    border-radius: var(--button-border-radius);
    background-color: var(--button-bg);
    color: var(--button-text-color);
    border: none;
    cursor: pointer;
    position: relative;
    outline: var(--button-outline-width) solid transparent;
    transition: all 0.2s ease;
  }

  .tooltip {
    position: absolute;
    opacity: 0;
    left: calc(100% + var(--tooltip-offset));
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
    font: var(--tooltip-font-size) var(--tooltip-font-family);
    color: var(--tootip-text-color);
    background: var(--tooltip-bg);
    padding: var(--tooltip-padding-y) var(--tooltip-padding-x);
    border-radius: var(--toolptip-border-radius);
    pointer-events: none;
    transition: all var(--tooltip-transition-duration) cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .tooltip::before {
    content: attr(data-text-initial);
  }

  .tooltip::after {
    content: "";
    width: var(--tooltip-padding-y);
    height: var(--tooltip-padding-y);
    background: inherit;
    position: absolute;
    top: 50%;
    left: calc(var(--tooltip-padding-y) / 2 * -1);
    transform: translateY(-50%) rotate(45deg);
    z-index: -999;
    pointer-events: none;
  }

  .copy-tweet-button svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .checkmark {
    display: none;
  }

  .copy-tweet-button:hover .tooltip,
  .copy-tweet-button:focus:not(:focus-visible) .tooltip {
    opacity: 1;
    visibility: visible;
  }

  .copy-tweet-button:focus:not(:focus-visible) .tooltip::before {
    content: attr(data-text-end);
  }

  .copy-tweet-button:focus:not(:focus-visible) .clipboard {
    display: none;
  }

  .copy-tweet-button:focus:not(:focus-visible) .checkmark {
    display: block;
  }

  .copy-tweet-button:hover,
  .copy-tweet-button:focus {
    background-color: var(--button-hover-bg);
  }

  .copy-tweet-button:active {
    outline: var(--button-outline-width) solid var(--button-outline-color);
  }

  .copy-tweet-button:hover svg {
    color: var(--button-hover-text-color);
  }
  `;

  /**
   * Adds styles using the DOM method.
   * @param {string} cssText - The CSS style text to be added.
   */
  function addStyleWithDOM(cssText) {
    const styleNode = document.createElement('style')
    styleNode.appendChild(document.createTextNode(cssText));
    (document.querySelector('head') || document.documentElement).appendChild(styleNode)
  }

  /**
   * Adds styles using GM_addStyle and returns whether it was successful.
   * @param {string} cssText - The CSS style text to be added.
   * @returns {boolean} Whether the style was successfully added.
   */
  function addStyleWithGM(cssText) {
    const isGMAddStyleAvailable = typeof GM_addStyle !== 'undefined';
    if (isGMAddStyleAvailable) {
      GM_addStyle(cssText);
    }
    return isGMAddStyleAvailable;
  }

  // Execute style addition and check if it was successful
  const resultsOfEnforcement = addStyleWithGM(copyBtnStyle)

  // If unsuccessful, fallback to adding styles using the DOM method
  if (!resultsOfEnforcement) {
    addStyleWithDOM(copyBtnStyle)
  }

  /**
   * Contains functions to extract various pieces of data from a tweet element.
   */
  const tweetDataExtractors = {
    username: ({ tweetElement }) => tweetElement.querySelector('div[data-testid="User-Name"]').firstChild.innerText,
    userid: ({ tweetElement }) => findUserID({ tweetElement }),
    tweetText: ({ tweetElement }) => findTweetText({ tweetElement }),
    mediaCount: ({ tweetElement }) => findMediaCount({ tweetElement }),
    link: ({ tweetElement }) => 'https://twitter.com' + tweetElement.querySelector('a[href*="/status/"]').getAttribute('href')
  };

  /**
   * User-defined template for formatting tweet data.
   */
  let userTemplate = `{{username}} ({{userid}})

{{tweetText}}

{{mediaCount}}

{{link}}`;

  /**
   * Adds a copy button to a tweet element.
   * @param {Object} param - Object containing the tweet element.
   * @param {Element} param.tweetElement - The tweet element.
   */
  function addCopyButtonToTweet({ tweetElement }) {
    if (tweetElement.querySelector('.copy-tweet-button')) {
      return;
    }

    let copyButton = document.createElement('button');
    copyButton.className = 'copy-tweet-button'; // 添加一个类名以避免重复添加
    copyButton.innerHTML = `
      <span data-text-initial="Copy to clipboard" data-text-end="Copied" data-text-faild="Copy failed, open the console for details!" class="tooltip"></span>
      <span>
        <svg xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 6.35 6.35" y="0" x="0"
          height="14" width="14" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
          xmlns="http://www.w3.org/2000/svg" class="clipboard">
          <g>
            <path fill="currentColor"
              d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z">
            </path>
          </g>
        </svg>
        <svg xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 24 24" y="0" x="0" height="14"
          width="14" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg"
          class="checkmark">
          <g>
            <path data-original="#000000" fill="currentColor"
              d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z">
            </path>
          </g>
        </svg>
      </span>
    `

    let nameElement = tweetElement.querySelector('[data-testid="User-Name"]');
    if (nameElement) {
      nameElement.appendChild(copyButton);
    }

    copyButton.addEventListener('click', e => handleTweetCopyClick({ e, tweetElement }));
  }

  /**
   * Handles the copy button click event.
   * @param {Object} param - Object containing the event and tweet element.
   * @param {Event} param.e - The click event.
   * @param {Element} param.tweetElement - The tweet element.
   */
  function handleTweetCopyClick({ e, tweetElement }) {
    e.stopPropagation();

    try {
      let formattedText = formatTweet({ tweetElement });
      copyTextToClipboard(formattedText);
    } catch (error) {
      handleCopyError({ tweetElement, error })
    }
  }

  function handleCopyError({ tweetElement, error = new Error() }) {
    const tooltip = tweetElement.querySelector('.copy-tweet-button .tooltip');
    if (tooltip.className.indexOf('copy-faild') < 0) {
      tooltip.className += ' copy-failed';
    }
    console.error(error)
  }

  /**
   * Finds the user ID from a tweet element.
   * @param {Object} param - Object containing the tweet element.
   * @param {Element} param.tweetElement - The tweet element.
   * @returns {string} User ID.
   */
  function findUserID({ tweetElement }) {
    let links = tweetElement.querySelectorAll('a[href^="/"][role="link"][tabindex="-1"]');
    let userIDElement = links[links.length - 1];

    return userIDElement ? userIDElement.textContent : '';
  }

  /**
   * Finds the tweetText from a tweet element.
   * @param {Object} param - Object containing the tweet element.
   * @param {Element} param.tweetElement - The tweet element.
   * @returns {string} TweetText
   */
  function findTweetText({ tweetElement }) {
    const tweetTextDOM = tweetElement.querySelector('div[data-testid="tweetText"]');
    if (!tweetTextDOM) {
      return '';
    }
    let clone = tweetTextDOM.cloneNode(true);
    // Support copy the emoji, There are system compatibility issues that cannot be fully resolved.
    // Consider using a third-party emoji library to solve this problem.
    clone.querySelectorAll('img').forEach(img => {
      let altText = img.alt || '';
      let textNode = document.createTextNode(altText);
      img.parentNode.replaceChild(textNode, img);
    });
    return clone.textContent;
  }

  /**
   * Finds the media count from a tweet element.
   * @param {Object} param - Object containing the tweet element.
   * @param {Element} param.tweetElement - The tweet element.
   * @returns {string} media count.
   */
  function findMediaCount({ tweetElement }) {
    let cameraEmoji = '\u{1F4F7}';

    const picCount = tweetElement.querySelectorAll('a[href*="/photo/"][role="link"]')?.length;

    const gifCount = tweetElement.querySelectorAll('div[data-testid="tweetPhoto"]')?.length;

    const videoComponent = tweetElement.querySelectorAll('div[data-test-id="videoComponent"')?.length;

    const mediaCard = tweetElement.querySelectorAll('div[data-testid^="card.wrapper"]')?.length;

    // FIXME: bad design, this a build-in template, but need to number of judgments.
    // ===
    const mediaCount = (picCount + gifCount + videoComponent + mediaCard) || 0;
    let mediaWord = 'media'
    if (!mediaCount) {
      return '';
    }
    if (mediaCount > 1) {
      mediaWord += 's'
    }
    return `${cameraEmoji} ${mediaCount} ${mediaWord}`;
    // ===
  }

  /**
   * Formats the tweet data according to the user-defined template.
   * @param {Object} param - Object containing the tweet element.
   * @param {Element} param.tweetElement - The tweet element.
   * @returns {string} Formatted tweet data.
   */
  function formatTweet({ tweetElement }) {
    // try {
    let formatted = userTemplate.replace(/\\{{/g, '{').replace(/\\}}/g, '}');
    formatted = formatted.replace(/{{(\w+)}}/g, (match, key) => {
      if (tweetDataExtractors[key]) {
        return tweetDataExtractors[key]({ tweetElement });
      }
      return match;
    });
    formatted = formatted.replaceAll(/\n\n\n/gi, '\n')
    return formatted;
    // } catch (error) {
    // handleCopyError({ tweetElement, error})
    // }
  }

  /**
   * Copies text to the clipboard.
   * @param {string} text - Text to be copied.
   */
  function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text).then(function () {
      console.log('Tweet copied to clipboard');
      console.log(text);
    }).catch(function (err) {
      console.error('Could not copy tweet: ', err);
    });
  }

  /**
   * Observes DOM mutations to add a copy button to new tweets.
   */
  let observer = new MutationObserver(function (mutations) {
    let articles = document.querySelectorAll('article[role="article"]');
    articles.forEach(function (tweetElement) {
      if (!tweetElement.querySelector('.copy-tweet-button')) {
        addCopyButtonToTweet({ tweetElement });
      }
    });
  });

  // Start observing
  observer.observe(document.body, { childList: true, subtree: true });
})();
