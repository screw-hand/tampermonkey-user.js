// ==UserScript==
// @name         share-tweet-copy
// @namespace    https://screw-hand.com/
// @version      0.1
// @description  support twitter to copy, easy to share.
// @author       screw-hand
// @match        https://twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @grant        none
// @homepage     https://github.com/screw-hand/tampermonkey-user.js
// @updateURL    https://github.com/screw-hand/tampermonkey-user.js/raw/main/share-tweet-copy.user.js
// @downloadURL  https://github.com/screw-hand/tampermonkey-user.js/raw/main/share-tweet-copy.user.js
// @supportURL   https://github.com/screw-hand/tampermonkey-user.js/issues/new
// ==/UserScript==

(function () {
	'use strict';

	/*
   Change Log

		Version 0.1
		- Initial release.
		- Basic functionality to copy tweet text to clipboard with a simple template.
	*/

	/**
	 * TODO
	 * v0.2
	 * 1. copy emojoyhttps://twitter.com/sanxiaozhizi/status/1734793603900485822
	 * 2. let copy button support "copied" notice
	 * 3. add change log
	 */

	/**
	 * Contains functions to extract various pieces of data from a tweet element.
	 */
	const tweetDataExtractors = {
		username: ({ tweetElement }) => tweetElement.querySelector('[dir]').innerText,
		userid: ({ tweetElement }) => findUserID({ tweetElement }),
		tweetText: ({ tweetElement }) => tweetElement.querySelector('div[data-testid="tweetText"]').innerText,
		link: ({ tweetElement }) => 'https://twitter.com' + tweetElement.querySelector('a[href*="/status/"]').getAttribute('href')
	};

	/**
	 * User-defined template for formatting tweet data.
	 */
	let userTemplate = `{{username}} ({{userid}})

{{tweetText}}

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
		copyButton.textContent = 'Copy';
		copyButton.className = 'copy-tweet-button';
		copyButton.style.marginLeft = '5px';

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

		let formattedText = formatTweet({ tweetElement });
		copyTextToClipboard(formattedText);
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
	 * Formats the tweet data according to the user-defined template.
	 * @param {Object} param - Object containing the tweet element.
	 * @param {Element} param.tweetElement - The tweet element.
	 * @returns {string} Formatted tweet data.
	 */
	function formatTweet({ tweetElement }) {
		let formatted = userTemplate.replace(/\\{{/g, '{').replace(/\\}}/g, '}');
		return formatted.replace(/{{(\w+)}}/g, (match, key) => {
			if (tweetDataExtractors[key]) {
				return tweetDataExtractors[key]({ tweetElement });
			}
			return match;
		});
	}

	/**
	 * Copies text to the clipboard.
	 * @param {string} text - Text to be copied.
	 */
	function copyTextToClipboard(text) {
		navigator.clipboard.writeText(text).then(function () {
			console.log('Tweet copied to clipboard');
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
