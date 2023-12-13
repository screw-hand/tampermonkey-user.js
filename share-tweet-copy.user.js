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

	/**
	 * TODO
	 * v0.2
	 * 1. copy emojoyhttps://twitter.com/sanxiaozhizi/status/1734793603900485822
	 * 2. let copy button support "copied" notice
	 * 3. update the code comment
	 * 4. add change log
	 */

	const tweetDataExtractors = {
		username: ({tweetElement}) => tweetElement.querySelector('[dir]').innerText,
		userid: ({tweetElement}) => findUserID({tweetElement}),
		tweetText: ({tweetElement}) => tweetElement.querySelector('div[data-testid="tweetText"]').innerText,
		link: ({tweetElement}) => 'https://twitter.com' + tweetElement.querySelector('a[href*="/status/"]').getAttribute('href')
	};

	// 用户自定义模板
	let userTemplate = `{{username}} ({{userid}})

{{tweetText}}

{{link}}`;

	// 函数：为推文添加复制按钮
	function addCopyButtonToTweet({tweetElement}) {
		// 确保按钮未被添加过
		if (tweetElement.querySelector('.copy-tweet-button')) {
			return;
		}

		// 创建复制按钮
		let copyButton = document.createElement('button');
		copyButton.textContent = 'Copy';
		copyButton.className = 'copy-tweet-button'; // 添加一个类名以避免重复添加
		copyButton.style.marginLeft = '5px';

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

		let formattedText = formatTweet({tweetElement});
		copyTextToClipboard(formattedText);
	}


	// 此函数在推文的DOM元素中查找用户ID
	function findUserID({tweetElement}) {
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
				return tweetDataExtractors[key]({tweetElement});
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
				addCopyButtonToTweet({tweetElement});
			}
		});
	});

	// 配置和启动观察者监听器
	observer.observe(document.body, { childList: true, subtree: true });
})();
