import { executeInCurrentTab } from '../utils';

function showHighlight(highlightId) {
    function contentScriptShowHighlight(highlightId) { // eslint-disable-line no-shadow
        window.highlighterAPI.highlight.show(highlightId);
    }

    executeInCurrentTab({ func: contentScriptShowHighlight, args: [highlightId] });
}

export default showHighlight;
