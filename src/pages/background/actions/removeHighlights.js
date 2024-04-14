import { executeInCurrentTab } from '../utils';

function removeHighlights() {

    function contentScriptRemoveHighlights() {
        window.highlighterAPI.highlights.deleteAll();
    }

    executeInCurrentTab({ func: contentScriptRemoveHighlights });
}

export default removeHighlights;
