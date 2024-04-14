function changeColor(colorTitle) {
    if (!colorTitle) return;

    chrome.storage.sync.set({ color: colorTitle });

    // Also update the context menu
    chrome.contextMenus.update(colorTitle, { checked: true });
}

export default changeColor;
