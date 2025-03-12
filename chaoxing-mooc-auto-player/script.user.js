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

		video.muted = true;
		video.autoplay = true;
		video.setAttribute('playsinline', 'true'); // iOS 内联播放
		video.preload = 'auto'; // 预加载提示

		// 创建准备状态检测
		let isVideoReady = false;
		let hasUserGesture = false;

		// 视频准备就绪监听
		video.addEventListener('canplaythrough', () => {
			isVideoReady = true;
			console.log('视频已准备好播放');
			tryPlay(); // 立即尝试播放（如果已有用户手势）
		});

		// 创建交互覆盖层
		const overlay = createOverlay();
		document.body.appendChild(overlay);

		// 用户交互处理
		const handleInteraction = () => {
			hasUserGesture = true;
			overlay.remove();
			tryPlay(); // 立即尝试播放（如果视频已就绪）
		};

		// 安全播放函数
		const tryPlay = () => {
			if (!isVideoReady) return;

			video.addEventListener("click", function () {
				video.play();
			});
			video.click();

			video.play()
				.then(() => console.log('播放成功'))
				.catch(error => {
				console.error('最终播放失败:', error);
				showFallbackButton();
			});
		};

		// 工具函数：创建覆盖层
		function createOverlay() {
			const overlay = document.createElement('div');
			overlay.style = '';
			overlay.innerHTML = `
        <div class="loader"></div>
        <h2>点击开始播放</h2>
    `;
			return overlay;
		}

		// 工具函数：显示备用按钮
		function showFallbackButton() {
			const btn = document.createElement('button');
			btn.textContent = '手动播放';
			btn.onclick = () => video.play();
			document.body.appendChild(btn);
		}

		// 事件监听（考虑移动端）
		document.addEventListener('click', handleInteraction, { once: true });
		document.addEventListener('touchstart', handleInteraction, { once: true });

		// 超时检测（10秒未加载完成）
		setTimeout(() => {
			if (!isVideoReady) {
				console.warn('视频加载超时');
				overlay.innerHTML = '视频加载失败，请检查网络';
			}
		}, 10_000);

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