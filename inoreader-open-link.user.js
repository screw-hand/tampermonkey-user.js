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
  /**
    * now only for Layout of Card View
    * and only for https://www.inoreader.com/feed/
    * other layout is comming soon ...
    * dashbord page is comming soon ...
    */

  /* global $ */

  const scriptName = 'inoreader-open-link';
  const openMode = '_blank';
  const view_style_config = {
    1:'List',
    2:'Expanded',
    3:'Column',
    4:'Card',
    5:'Magazine',
  }

  // part2: Card View
  const originalDialog = window.dialog;
  window.dialog = function () {
    debugger;
    console.log("dialog");
    const flag = arguments[0] === "article_dialog";
    if (flag) {
      console.log('flag');
      return;
    }
    return originalDialog.apply(this, arguments);
  };
  const article_title_link = '.article_title_link';
  const article_title_picture = '.article_tile_picture';
  document.addEventListener('click', function (e) {
    const is_target_article_title_link = e.target.classList.contains(article_title_link.substring(1));
    const is_target_article_title_picture = e.target.classList.contains(article_title_picture.substring(1));
    if (is_target_article_title_link || is_target_article_title_picture) {
      const article_title_content_wraper = '.article_tile_content_wraper';
      const is_target_closest_wraper = e.target.closest(article_title_content_wraper);
      if (is_target_closest_wraper) {
        const href = e.target.href || e.target.parentElement.href;
        // TODO make the open in new tab is option that user could setting
        window.open(href, openMode)
      }
    }
  }, true);

  // part3: List View
  const original_toggle_articleview = window.toggle_articleview;
  window.toggle_articleview = function () {
    console.log('toggle_articleview');
    const [id, no_helpers, event, extra] = arguments;
    const flag = typeof id === 'string' && no_helpers === false && (event instanceof Event || event instanceof MouseEvent) && extra === false;
    if (flag) {
      console.log('flag');
      return;
    }
    return original_toggle_articleview(this, arguments);
  }
  document.addEventListener('click', function (e) {
    const article_header_text = '.article_header_text';
    const is_target = e.target.closest(article_header_text);
    if (is_target) {
      const link = is_target.querySelector('a')?.href;
      link && window.open(link, openMode)
    }
  }, true);

  //
  const original_article_click_trap_async = window.article_click_trap_async;
  window.article_click_trap_async = function () {
    debugger;
    console.log('article_click_trap_async');
    return original_article_click_trap_async(this, arguments);
  }

})();
