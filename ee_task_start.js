// ==UserScript==
// @name         ee-task-start
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A tool to start or cancel all running tasks in the google earthengine playground
// @author       Jonas Kittner: https://github.com/theendlessriver13
// @match        https://code.earthengine.google.com/
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function run() {
    let tasks = document.getElementsByClassName(
      "task local awaiting-user-config"
    );
    for (let i = 0; i < tasks.length; i++) {
      tasks[i].getElementsByClassName("run-button")[0].click();
    }
  }

  function cancel_submitted() {
    let running_tasks = document.getElementsByClassName(
      "task local submitted-to-backend"
    );
    for (let i = 0; i < running_tasks.length; i++) {
      running_tasks[i].getElementsByClassName("indicator")[0].click();
    }
  }

  function cancel_running() {
    let running_tasks = document.getElementsByClassName(
      "task local running-on-backend"
    );
    for (let i = 0; i < running_tasks.length; i++) {
      running_tasks[i].getElementsByClassName("indicator")[0].click();
    }
  }
  async function wait_until_asset_is_filled(element) {
    return await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (
          element.getElementsByClassName("jfk-textinput asset-id")[0].value !=
          ""
        ) {
          resolve(element);
          clearInterval(interval);
        }
      }, 50);
    });
  }

  function confirm_start() {
    let confirm_dialog = document.getElementsByClassName(
      "modal-dialog task-config-dialog"
    );

    for (let i = 0; i < confirm_dialog.length; i++) {
      if (
        confirm_dialog[i].getElementsByClassName(
          "jfk-radiobutton jfk-radiobutton-checked"
        )[0].innerText == "EE Asset"
      ) {
        wait_until_asset_is_filled(confirm_dialog[i]).then((element) => {
          element
            .getElementsByClassName(
              "goog-buttonset-default goog-buttonset-action"
            )[0]
            .click();
        });
      } else {
        confirm_dialog[i]
          .getElementsByClassName(
            "goog-buttonset-default goog-buttonset-action"
          )[0]
          .click();
      }
    }
  }

  function confirm() {
    let confirm_buttons = document.getElementsByClassName(
      "goog-buttonset-default goog-buttonset-action"
    );
    for (let i = 0; i < confirm_buttons.length; i++) {
      confirm_buttons[i].click();
    }
  }

  function download_all() {
    run();
    confirm_start();
  }

  function cancel_all_submitted() {
    cancel_submitted();
    confirm();
  }
  function cancel_all_running() {
    cancel_running();
    confirm();
  }

  let base_btn = document.createElement("button");
  base_btn.style.color = "#fff";
  base_btn.style.borderRadius = "8px";
  base_btn.style.marginLeft = "4px";
  base_btn.style.marginRight = "4px";

  // run all Image exports
  let btn_run = base_btn.cloneNode(true);
  btn_run.innerHTML = "start all";
  btn_run.style.background = "#28a745";

  // cancel all submitted tasks
  let btn_cancel = base_btn.cloneNode(true);
  btn_cancel.innerHTML = "cancel submitted";
  btn_cancel.style.background = "#ffc107";

  // cancel all running tasks
  let btn_cancel_running = base_btn.cloneNode(true);
  btn_cancel_running.innerHTML = "cancel running";
  btn_cancel_running.style.background = "#b00";

  let box = document.getElementsByClassName("goog-tab-bar")[1];
  box.appendChild(btn_run);
  box.appendChild(btn_cancel);
  box.appendChild(btn_cancel_running);
  btn_run.onclick = download_all;
  btn_cancel.onclick = cancel_all_submitted;
  btn_cancel_running.onclick = cancel_all_running;
})();
