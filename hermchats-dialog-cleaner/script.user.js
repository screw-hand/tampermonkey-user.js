// ==UserScript==
// @name         Hermchats Dialog Cleaner
// @namespace    https://screw-hand.com/
// @version      0.2
// @description  Clean up all dialogs on Hermchats
// @author       screw-hand
// @match        https://hermchats.com/chat
// @match        https://hermchats.com/chat*
// @icon         https://hermchats.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
  "use strict";

  const jtoken = localStorage.token; // 请确保这个token是最新的

  function getDialogs() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://hermchats.com/gw/chatweb/gpt/dialogs",
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
          jtoken: jtoken,
        },
        data: JSON.stringify({}),
        onload: function (response) {
          if (response.status === 200) {
            const data = JSON.parse(response.responseText);
            if (data.code === 200 && Array.isArray(data.data)) {
              resolve(data.data.map((item) => item.id));
            } else {
              reject("Unexpected response format");
            }
          } else {
            reject("Request failed");
          }
        },
        onerror: reject,
      });
    });
  }

  function deleteDialog(id) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://hermchats.com/gw/chatweb/gpt/delDialog",
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
          jtoken: jtoken,
        },
        data: JSON.stringify({ id: id }),
        onload: function (response) {
          if (response.status === 200) {
            resolve();
          } else {
            reject("Failed to delete dialog " + id);
          }
        },
        onerror: reject,
      });
    });
  }

  async function cleanDialogs() {
    try {
      const dialogIds = await getDialogs();
      console.log(`Found ${dialogIds.length} dialogs to delete.`);
      for (const id of dialogIds) {
        await deleteDialog(id);
        console.log(`Deleted dialog ${id}`);
      }
      alert("All dialogs have been deleted.");
      location.reload();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  // 使用GM_registerMenuCommand添加菜单命令
  GM_registerMenuCommand("Clean All Dialogs", cleanDialogs);
})();
