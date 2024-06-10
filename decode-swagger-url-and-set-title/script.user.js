// ==UserScript==
// @name         decode-swagger-url-and-set-title
// @namespace    https://screw-hand.com/
// @version      1.0
// @description  Decode URL encoded titles for Swagger pages and set document.title
// @author       screw-hand
// @match        *://*/*swagger/index.html?urls.primaryName=*
// @icon         https://static1.smartbear.co/swagger/media/assets/swagger_fav.png
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // Function to decode and set the title
  function decodeAndSetTitle() {
      // Extract 'urls.primaryName' parameter value from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const titleParam = urlParams.get('urls.primaryName');

      if (titleParam) {
          // Decode URL encoded title
          const decodedTitle = decodeURIComponent(titleParam);
          console.log(`Decoding URL parameter: ${titleParam} -> ${decodedTitle}`);
          if (document.title !== decodedTitle) {
              document.title = decodedTitle;
          }
      }
  }

  // Initial decoding and setting of the title
  decodeAndSetTitle();
})();