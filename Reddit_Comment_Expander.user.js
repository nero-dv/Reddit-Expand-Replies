// ==UserScript==
// @name         Expand All Reddit Replies (Toggleable)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggleable auto-expand for "more replies" on Reddit posts with an improved floating button
// @author       Amir Tehrani
// @match        https://www.reddit.com/r/*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    console.log("Tampermonkey script loaded");

    let isExpanding = false;

    function clickMoreRepliesButtons() {
        if (!isExpanding) return;

        const moreRepliesButtons = document.querySelectorAll(
            'faceplate-partial[loading="action"][src*="/svc/shreddit/more-comments/"] > div > button[type="button"], a[id^="comments-permalink-"][slot="more-comments-permalink"]'
        );

        console.log("Found", moreRepliesButtons.length, "'more replies' buttons");

        moreRepliesButtons.forEach(button => {
            if (button.offsetParent !== null && !button.disabled) {
                console.log("Clicking 'more replies' button...");
                button.click();
            }
        });
    }

    function addStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    addStyle(`
        faceplate-partial[loading="action"][src*="/svc/shreddit/more-comments/"] > div > button[type="button"],
        a[id^="comments-permalink-"][slot="more-comments-permalink"] {
            display: block !important;
            visibility: visible !important;
            pointer-events: auto !important;
        }
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

    function addToggleButton() {
        const button = document.createElement('button');
        button.id = 'toggleExpandButton';
        button.textContent = 'Enable Auto-Expand';
        button.addEventListener('click', toggleExpanding);
        document.body.appendChild(button);
    }

    function toggleExpanding() {
        isExpanding = !isExpanding;
        const button = document.getElementById('toggleExpandButton');
        button.textContent = isExpanding ? 'Disable Auto-Expand' : 'Enable Auto-Expand';
        button.classList.toggle('active', isExpanding);
        if (isExpanding) {
            clickMoreRepliesButtons();
        }
    }

    function initScript() {
        addToggleButton();

        window.addEventListener('scroll', () => {
            setTimeout(clickMoreRepliesButtons, 2000);
        });

        const commentsSection = document.querySelector('.ListingLayout-outerContainer');
        if (commentsSection) {
            const commentsObserver = new MutationObserver(clickMoreRepliesButtons);
            commentsObserver.observe(commentsSection, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'complete') {
        initScript();
    } else {
        window.addEventListener('load', initScript);
    }

    setInterval(clickMoreRepliesButtons, 5000);
})();
