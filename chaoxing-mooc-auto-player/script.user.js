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

(function() {
	'use strict';
	window.addEventListener('load', function() {
		console.log('init script');
		var video = document.querySelector('video');
		console.log('video', video);
		if (!video) {
			return
		}
		console.log('init script successed!');


		video.addEventListener('ended', function() {

			function prevNextFocusNext () {
				console.log('视频播放完成');
				// 在这里可以执行视频播放完成后的操作
				var nextButton = window.top.document.querySelector('#prevNextFocusNext')
				// 触发点击事件
				if (nextButton) {
					nextButton.click();
					console.log('点击事件已触发');
				} else {
					console.log('未找到元素');
				}
			}

			prevNextFocusNext()
		});
	});
})();