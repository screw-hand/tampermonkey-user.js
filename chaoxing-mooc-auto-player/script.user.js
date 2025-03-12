// ==UserScript==
// @name         刷课脚本
// @namespace    https://screw-hand.com/
// @version      2025-03-11
// @description  播放完自动下一节
// @author       screw-hand
// @match        https://mooc1.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// ==/UserScript==

(function () {
	'use strict';
	window.addEventListener('load', function () {
		console.log('init script');
		var video = document.querySelector('video');
		console.log('video', video);
		if (!video) {
			return
		}

		console.log('init script succeed!');

		// fn1: 自动点击下一节
		video.addEventListener('ended', function () {
			console.log('video ended');
			var nextButton = window.top.document.querySelector('#prevNextFocusNext')
			if (nextButton) {
				nextButton.click();
				console.log('click event triggered');
			} else {
				console.log('element not found');
			}
		});
	});
})();