// ==UserScript==
// @name         share-tweet-copy
// @namespace    https://screw-hand.com/
// @version      0.1
// @description  support twitter to copy, easy to share.
// @author       screw-hand
// @match        https://twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @grant        GM_addStyle
// @homepage     https://github.com/screw-hand/tampermonkey-user.js
// @updateURL    https://github.com/screw-hand/tampermonkey-user.js/raw/main/share-tweet-copy.user.js
// @downloadURL  https://github.com/screw-hand/tampermonkey-user.js/raw/main/share-tweet-copy.user.js
// @supportURL   https://github.com/screw-hand/tampermonkey-user.js/issues/new
// ==/UserScript==

(function () {
	'use strict';
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

	// 通过DOM添加样式
	function addStyleWithDOM(cssText) {
		const styleNode = document.createElement('style')
		styleNode.appendChild(document.createTextNode(cssText));
		(document.querySelector('head') || document.documentElement).appendChild(styleNode)
	}

	// 通过GM_addStyle添加样式,并且返回是否成功
	function addStyleWithGM(cssText) {
		const isGMAddStyleAvailable = typeof GM_addStyle !== 'undefined';
		if (isGMAddStyleAvailable) {
			GM_addStyle(cssText);
		}
		return isGMAddStyleAvailable;
	}


	// 执行，并且判断是否成功
	const resultsOfEnforcement = addStyleWithGM(copyBtnStyle)

	// 如果不成功，则使用DOM方式
	if (!resultsOfEnforcement) {
		addStyleWithDOM(copyBtnStyle)
	}

	const tweetDataExtractors = {
		username: ({ tweetElement }) => tweetElement.querySelector('[dir]').innerText,
		userid: ({ tweetElement }) => findUserID({ tweetElement }),
		tweetText: ({ tweetElement }) => tweetElement.querySelector('div[data-testid="tweetText"]').innerText,
		link: ({ tweetElement }) => 'https://twitter.com' + tweetElement.querySelector('a[href*="/status/"]').getAttribute('href')
	};

	// 用户自定义模板
	let userTemplate = `{{username}} ({{userid}})

{{tweetText}}

{{link}}`;

	// 函数：为推文添加复制按钮
	function addCopyButtonToTweet({ tweetElement }) {
		// 确保按钮未被添加过
		if (tweetElement.querySelector('.copy-tweet-button')) {
			return;
		}

		// 创建复制按钮
		let copyButton = document.createElement('button');
		copyButton.className = 'copy-tweet-button'; // 添加一个类名以避免重复添加
		copyButton.innerHTML = `
			<span data-text-end="Copied" data-text-initial="Copy to clipboard" class="tooltip"></span>
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

		// 定位并添加按钮
		let nameElement = tweetElement.querySelector('[data-testid="User-Name"]');
		if (nameElement) {
			nameElement.appendChild(copyButton);
		}

		// 添加按钮事件监听
		copyButton.addEventListener('click', e => handleTweetCopyClick({ e, tweetElement }));
	}

	// 处理点击时间以复制
	function handleTweetCopyClick({ e, tweetElement }) {
		e.stopPropagation();

		let formattedText = formatTweet({ tweetElement });
		copyTextToClipboard(formattedText);
	}


	// 此函数在推文的DOM元素中查找用户ID
	function findUserID({ tweetElement }) {
		// 使用您提供的选择器获取匹配的元素
		let links = tweetElement.querySelectorAll('a[href^="/"][role="link"][tabindex="-1"]');

		// 获取最后一个元素
		let userIDElement = links[links.length - 1];

		// 如果找到了，返回用户ID，否则返回空字符串
		return userIDElement ? userIDElement.textContent : '';
	}

	// 函数：自动分析模板中的变量并替换它们,格式化推文内容
	function formatTweet({ tweetElement }) {
		// // 处理转义的花括号  \\{{ -> {{ || \\}} -> }}
		let formatted = userTemplate.replace(/\\{{/g, '{').replace(/\\}}/g, '}');
		return formatted.replace(/{{(\w+)}}/g, (match, key) => {
			if (tweetDataExtractors[key]) {
				return tweetDataExtractors[key]({ tweetElement });
			}
			return match;
		});
	}

	// 函数：复制文本到剪贴板
	function copyTextToClipboard(text) {
		navigator.clipboard.writeText(text).then(function () {
			console.log('Tweet copied to clipboard');
		}).catch(function (err) {
			console.error('Could not copy tweet: ', err);
		});
	}

	// 监听DOM变化，添加复制按钮到每个推文
	let observer = new MutationObserver(function (mutations) {
		// 每次变动时，查询页面上所有的推文
		let articles = document.querySelectorAll('article[role="article"]');
		articles.forEach(function (tweetElement) {
			// 如果推文尚未被处理，则为其添加复制按钮
			if (!tweetElement.querySelector('.copy-tweet-button')) {
				addCopyButtonToTweet({ tweetElement });
			}
		});
	});

	// 配置和启动观察者监听器
	observer.observe(document.body, { childList: true, subtree: true });
})();
