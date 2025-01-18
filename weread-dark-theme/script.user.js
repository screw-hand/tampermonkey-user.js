// ==UserScript==
// @name         微信读书 深色主题
// @namespace    https://screw-hand.com/
// @version      0.2
// @description  Remove wr_whiteTheme class from body
// @match        https://weread.qq.com/*
// @icon         https://rescdn.qqmail.com/node/wr/wrpage/style/images/independent/appleTouchIcon/apple-touch-icon-152x152.png
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  // 更改 body 类名以切换主题
  document.body.classList.remove('wr_theme_light');
  document.body.classList.add('wr_theme_dark');

  // 动态注入 CSS 样式
  const cssText = `
    .wr_index_page_rank_list_card,
    .wr_index_page_category_list_content_card {
      background-color: #1c1c1d; /* 设置暗色背景 */
      color: #fff;               /* 设置字体颜色为白色 */
    }

    .wr_index_page_rank_list_title,
    .wr_index_page_category_list_title_lang {
      color: var(--WR_BC3, #212832); /* 设置标题颜色 */
    }
  `;
  GM_addStyle(cssText);

  // 使用 MutationObserver 监听 DOM 变化并应用样式调整
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // 元素节点
            if (node.matches('.wr_index_page_rank_list_card, .wr_index_page_category_list_content_card')) {
              console.log(node, 'node');
              node.style.backgroundColor = '#1c1c1d'; // 设置背景颜色
              node.style.color = '#fff';              // 设置字体颜色
            }
          }
        });
      }
    });
  });

  // 观察整个文档的变化
  observer.observe(document.body, { childList: true, subtree: true });

})();
