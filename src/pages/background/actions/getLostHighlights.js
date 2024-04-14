import { executeInCurrentTab } from '../utils';

function getLostHighlights() {
    function contentScriptGetLostHighlights() {
        const lostHighlights = [];
        window.highlighterAPI.highlights.getAllLost().forEach((highlight, index) => lostHighlights.push({ string: highlight?.string, index }));
        return lostHighlights;
    }

    return executeInCurrentTab({ func: contentScriptGetLostHighlights });
}

export default getLostHighlights;
