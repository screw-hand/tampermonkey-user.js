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

  debugger

  const scriptName = 'inoreader-open-link';
  const openMode = '_blank';
  const view_style_config = {
    0:'List',      // Supported
    1:'Expanded',
    2:'Column',
    3:'Card',      // Supported
    4:'Magazine',
  }

  function isMode(modeStr) {
    const currentMode = view_style_config[window.view_style];
    console.log({ currentMode });
    return currentMode === modeStr;
  }

  function cardModeOpenLink (e) {
    const article_title_link = '.article_title_link';
    const article_title_picture = '.article_tile_picture';
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
  }

  function listViewOpenLink(e) {
    const article_header_text = '.article_header_text';
    const is_target = e.target.closest(article_header_text);
    if (is_target) {
      const link = is_target.querySelector('a')?.href;
      link && window.open(link, openMode)
    }
  }

  function magazineModeOpenLink(e) {
    const article_magazine_content_wraper = '.article_magazine_content_wraper';
    const is_target = e.target.closest(article_magazine_content_wraper);
    if (is_target) {
      const link = is_target.querySelector('a')?.href;
      link && event.preventDefault();
      link && window.open(link, openMode);
    }
  }

  const originalDialog = window.dialog;
  window.dialog = function () {
    console.log("dialog");
    const flag = arguments[0] === "article_dialog";
    console.log({ flag });
    if (isMode('Card') && falg) {
      return cardModeOpenLink(event);
    } else if (isMode('Magazine') && falg) {
      return magazineModeOpenLink(event);
    }
    return originalDialog.apply(this, arguments);
  };


  const original_toggle_articleview = window.toggle_articleview;
  window.toggle_articleview = function () {
    console.log('toggle_articleview');
    if (isMode('List')) {
      const [id, no_helpers, event, extra] = arguments;
      const flag = typeof id === 'string' && no_helpers === false && (event instanceof Event || event instanceof MouseEvent) && extra === false;
      console.log({ flag });
      if (flag) {
        return listViewOpenLink(event);
      }
    } else if (isMode('Magazine')) {
      return magazineModeOpenLink(event);
    }
    return original_toggle_articleview.apply(this, arguments);
  }

  const original_article_click_trap_async = window.article_click_trap_async;
  window.article_click_trap_async = function () {
    console.log('article_click_trap_async');
    if (isMode('Magazine')) {
      return magazineModeOpenLink(event);
    }
    return original_article_click_trap_async.apply(this, arguments);
  }

})();
