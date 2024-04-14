import { executeInCurrentTab } from '../utils';

// TODO: Rename to removeLostHighlight
function removeHighlight(highlightId) {

    function contentScriptRemoveHighlight(highlightIndex) {
        window.highlighterAPI.highlight.removeLost(highlightIndex);
    }

    executeInCurrentTab({ func: contentScriptRemoveHighlight, args: [highlightId] });
}

export default removeHighlight;
