import { update as updateStorage } from '../utils/storageManager.js';

async function updateColor(highlightId, colorId) {
  let color = await findColor(colorId);
  const highlights = $(`.highlighter--highlighted[data-highlight-id='${highlightId}']`);
  highlights.css('backgroundColor', color.color); // Change the background color attribute
  highlights.css('color', color.textColor || 'inherit');

  updateStorage(
    highlightId,
    window.location.hostname + window.location.pathname,
    window.location.pathname,
    color.color,
    color.textColor,
  ); // update the value in the local storage
}

function findColor(colorId) {
  return new Promise((resolve, _reject) => {
    chrome.runtime.sendMessage({ action: 'get-color-options' }, ({ response: colorOptions }) => {
      // Find index by color rgb value (returns -1 if nothing found):
      const color = colorOptions.find(color => color.title === colorId);
      resolve(color);
    });
  });
}

export default updateColor;
