// ==UserScript==
// @name         inoreader-open-link
// @namespace    http://screw-hand.net/
// @version      0.1
// @description  support inoreader web to open the link.
// @author       screw-hand
// @match        https://www.inoreader.com/*
// @icon         https://www.inoreader.com/favicon.ico?v=8
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	/* global $ */
	const scriptName = 'inoreader-open-link';

	// part1: init and ready
	console.info(`${scriptName}is running!`);
	if (typeof $ === "undefined") {
		console.error(`${scriptName} can't not use jQuery, the script will return！`);
		return;
	}
	console.info("You are running jQuery version: " + $.fn.jquery);

	// part2: cancel the article_dialog
	const originalDialog = window.dialog;
	window.dialog = function () {
		console.log("Modified dialog function called!");
		if (arguments[0] === "article_dialog") {
			return;
		} 
		return originalDialog.apply(this, arguments);
	};

	// part3: open the link
	/**
	* now only for Layout of Card View
	* and only for https://www.inoreader.com/feed/
	* other layout is comming soon ...
	* dashbord page is comming soon ...
	*/
	const article_title_link = '.article_title_link';
	const article_title_picture = '.article_tile_picture';
	document.addEventListener('click', function (e) {
		const is_target_article_title_link = e.target.classList.contains(article_title_link.substr(1));
		const is_target_article_title_picture = e.target.classList.contains(article_title_picture.substr(1));
		if (is_target_article_title_link || is_target_article_title_picture) {
			const article_title_content_wraper = '.article_tile_content_wraper';
			const is_target_closest_wraper = e.target.closest(article_title_content_wraper);
			if (is_target_closest_wraper) {
				const href = e.target.href || e.target.parentElement.href;
				// TODO make the open in new tab is option that user could setting
				window.open(href, '_blank')
			}
		}
	}, true);

})();
