import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';
import {
  changeColor,
  editColor,
  getColorOptions,
  getCurrentColor,
  getHighlights,
  getLostHighlights,
  highlightText,
  loadPageHighlights,
  removeHighlight,
  removeHighlights,
  showHighlight,
  toggleHighlighterCursor,
} from './actions/index.js';
import { wrapResponse } from './utils';
reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

const getCurrentUrl = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.url.split('#')[0];
};

const getAuthToken = async () => chrome.cookies.get({ url: 'http://localhost', name: 'token' });

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === 'retrieve_token_from_cookie') {
//     chrome.cookies.get({ url: 'http://localhost', name: 'token' }).then(async cookie => {
//       const url = await getCurrentUrl();
//       sendResponse({ token: cookie?.value, currentUrl: url });
//     });
//     return true;
//   }
// });

function initializeContextMenus() {
  // Add option when right-clicking
  chrome.runtime.onInstalled.addListener(async () => {
    // remove existing menu items
    chrome.contextMenus.removeAll();

    chrome.contextMenus.create({ title: 'Highlight', id: 'highlight', contexts: ['selection'] });
    chrome.contextMenus.create({ title: 'Toggle Cursor', id: 'toggle-cursor' });
    chrome.contextMenus.create({ title: 'Highlighter color', id: 'highlight-colors' });
    chrome.contextMenus.create({ title: 'Corn', id: 'corn', parentId: 'highlight-colors', type: 'radio' });
    chrome.contextMenus.create({ title: 'Lavender', id: 'lavender', parentId: 'highlight-colors', type: 'radio' });
    chrome.contextMenus.create({ title: 'Melon', id: 'melon', parentId: 'highlight-colors', type: 'radio' });
    chrome.contextMenus.create({ title: 'Pale Blue', id: 'pale-blue', parentId: 'highlight-colors', type: 'radio' });
    chrome.contextMenus.create({ title: 'Feldspar', id: 'feldspar', parentId: 'highlight-colors', type: 'radio' });

    // Get the initial selected color value
    const { title: colorTitle } = await getCurrentColor();
    chrome.contextMenus.update(colorTitle, { checked: true });
  });
}

function initializeContextMenuEventListeners() {
  chrome.contextMenus.onClicked.addListener(({ menuItemId, parentMenuItemId }) => {
    if (parentMenuItemId === 'highlight-color') {
      changeColor(menuItemId);
      return;
    }

    switch (menuItemId) {
      case 'highlight':
        highlightText();
        break;
      case 'toggle-cursor':
        toggleHighlighterCursor();
        break;
    }
  });
}

function initializeTabEventListeners() {
  // If the URL changes, try again to highlight
  // This is done to support javascript Single-page applications
  // which often change the URL without reloading the page
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, _tab) => {
    if (changeInfo.url) {
      loadPageHighlights(tabId);
    }
  });
}

function initializeKeyboardShortcutEventListeners() {
  // Add Keyboard shortcuts
  chrome.commands.onCommand.addListener(command => {
    switch (command) {
      case 'execute-highlight':
        highlightText();
        break;
      case 'toggle-highlighter-cursor':
        toggleHighlighterCursor();
        break;
      case 'change-color-to-corn':
        changeColor('corn');
        break;
      case 'change-color-to-lavender':
        changeColor('lavender');
        break;
      case 'change-color-to-melon':
        changeColor('melon');
        break;
      case 'change-color-to-pale-blue':
        changeColor('pale-blue');
        break;
      case 'change-color-to-feldspar':
        changeColor('feldspar');
        break;
    }
  });
}

function initializeMessageEventListeners() {
  // Listen to messages from content scripts
  /* eslint-disable consistent-return */
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (!request.action) return;

    switch (request.action) {
      case 'highlight':
        highlightText();
        const highlights = getHighlights();
        console.log(highlights);
        return;
      case 'remove-highlights':
        removeHighlights();
        return;
      case 'remove-highlight':
        removeHighlight(request.highlightId);
        return;
      case 'change-color':
        changeColor(request.color);
        return;
      case 'edit-color':
        editColor(request.colorTitle, request.color, request.textColor);
        return;
      case 'toggle-highlighter-cursor':
        toggleHighlighterCursor();
        return;
      case 'get-highlights':
        wrapResponse(getHighlights(), sendResponse);
        return true; // return asynchronously
      case 'get-lost-highlights':
        wrapResponse(getLostHighlights(), sendResponse);
        return true; // return asynchronously
      case 'show-highlight':
        return showHighlight(request.highlightId);
      case 'get-current-color':
        wrapResponse(getCurrentColor(), sendResponse);
        return true; // return asynchronously
      case 'get-color-options':
        wrapResponse(getColorOptions(), sendResponse);
        return true; // return asynchronously
      case 'retrieve_token_from_cookie':
        getAuthToken().then(async cookie => {
          const url = await getCurrentUrl();
          sendResponse({ token: cookie?.value, currentUrl: url });
        });
        return true;
    }
  });
  /* eslint-enable consistent-return */
}

initializeContextMenus();
initializeContextMenuEventListeners();
initializeTabEventListeners();
initializeKeyboardShortcutEventListeners();
initializeMessageEventListeners();
