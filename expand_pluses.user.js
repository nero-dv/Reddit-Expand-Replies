// ==UserScript==
// @name         Old Reddit - Expand all hidden comments
// @namespace    URL
// @version      0.1
// @description  This script will expand all hidden comments on a Reddit page.
// @author       nero-dv
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
        #unhiderButton {
            position: fixed;
            bottom: 80px;
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
        #unhiderButton:hover {
            background-color: #e0e0e0;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        #unhiderButton:active {
            transform: scale(0.95);
        }
        #unhiderButton.active {
            background-color: #ff4500;
            color: white;
        }
        #unhiderButton.active:hover {
            background-color: #ff5722;
        }
      `);

  // Flag to control the expansion process
  let unhiding = false;

  const unhideComments = () => {
    // Expand any elements with a [+] indicator
    const expanders = document.querySelectorAll('.tagline .expand');
    console.log(
      expanders.length,
      '[+] elements found. \n\t--> Expanding all hidden comments...'
    );
    let _n = 0
    for (const expander of expanders) {
      if (expander.textContent.trim() === '[+]') {
        expander.click();
        ++_n
      };
    };
    console.log(_n, ' [+] found and expanded')

    unhiding = false;
    const toggleButton = document.getElementById('unhiderButton');
    if (toggleButton) {
      toggleButton.classList.remove('active');
    }
  };

  // Toggle the expansion process and update the button's appearance
  function toggleUnhide() {
    unhiding = !unhiding;
    const toggleButton = document.getElementById('unhiderButton');
    if (toggleButton) {
      toggleButton.classList.toggle('active', unhiding);
    }
    if (unhiding) {
      unhideComments();
    }
  }

  // Create and insert the toggle button into the page
  const unhideButton = document.createElement('button');
  unhideButton.id = 'unhiderButton';
  unhideButton.textContent = 'Unhide [-] Comments';
  unhideButton.addEventListener('click', toggleUnhide);
  document.body.appendChild(unhideButton);
})();
