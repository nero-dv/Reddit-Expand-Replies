// ==UserScript==
// @name         Old Reddit - Load all comments
// @namespace    URL
// @version      0.1
// @description  This script will load all comments on a Reddit page via async and sequential requests. This is useful for pages with a large number of comments that are not all loaded by default.
// @author       nero-dv, inspired by amirthfultehrani
// @match        *://*.reddit.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // Inject CSS for the toggle button into the document head
  const addStyle = (css) => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  };

  addStyle(`
        #toggleExpandButton {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 15px;
            background-color: #f0f0f0;
            color: #333;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            outline: none;
        }
        #toggleExpandButton:hover {
            background-color: #e0e0e0;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        #toggleExpandButton:active {
            transform: scale(0.95);
        }
        #toggleExpandButton.active {
            background-color: #ff4500;
            color: white;
        }
        #toggleExpandButton.active:hover {
            background-color: #ff5722;
        }
      `);

  // Expand any elements with a [+] indicator
  // const expanders = document.querySelectorAll('.tagline .expand');
  // console.log(
  //   expanders.length,
  //   '[+] elements found. \n\t--> Expanding all hidden comments...'
  // );

  // for (const expander of expanders) {
  //   if (expander.textContent.trim() === '[+]') {
  //     expander.click();
  //   }
  // }

  // Flag to control the expansion process
  let expanding = false;

  // Returns a promise that resolves after a random delay between min and max milliseconds
  const randomDelay = (min, max) =>
    new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * (max - min) + min))
    );

  // Asynchronously click each "load more comments" button but wait a random
  // time between 1000ms and 2500ms before clicking the next button
  async function expandComments() {
    const buttons = document.querySelectorAll('.sitetable .button');
    console.log('Found', buttons.length, ' "load more comments" links');
    let _iter = 0;

    for (const button of buttons) {
      if (!expanding) {
        console.log('Stopping expansion process...');
        break;
      }
      button.click();
      console.log('Clicked button', ++_iter, 'of', buttons.length);
      await randomDelay(1000, 2500);
    }
    expanding = false;
    const toggleButton = document.getElementById('toggleExpandButton');
    if (toggleButton) {
      toggleButton.classList.remove('active');
    }
  }

  // Toggle the expansion process and update the button's appearance
  function toggleExpand() {
    expanding = !expanding;
    const toggleButton = document.getElementById('toggleExpandButton');
    if (toggleButton) {
      toggleButton.classList.toggle('active', expanding);
    }
    if (expanding) {
      expandComments();
    }
  }

  // Create and insert the toggle button into the page
  const toggleButton = document.createElement('button');
  toggleButton.id = 'toggleExpandButton';
  toggleButton.textContent = 'Toggle Expand';
  toggleButton.addEventListener('click', toggleExpand);
  document.body.appendChild(toggleButton);
})();
