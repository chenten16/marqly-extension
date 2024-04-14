import getCurrentColor from './getCurrentColor.js';

import { executeInCurrentTab } from '../utils';

async function highlightText() {

    function contentScriptHighlightText(currentColor) {
        window.highlighterAPI.highlight.create(currentColor);
    }

    const currentColor = await getCurrentColor();
    executeInCurrentTab({ func: contentScriptHighlightText, args: [currentColor] });
}

export default highlightText;
