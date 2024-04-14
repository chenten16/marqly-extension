import * as api from './api';
import { initializeHighlighterCursor } from './highlighterCursor/index.js';
import { loadAll as loadAllHighlights } from './highlights/index.js';
import { initializeHoverTools } from './hoverTools/index.js';

function initialize() {
  initializeHoverTools();
  initializeHighlighterCursor();
  loadAllHighlights();
  window.highlighterAPI = api;
}

initialize();
