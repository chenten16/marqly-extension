import fs from 'node:fs';
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  /**
   * if you want to support multiple languages, you can use the following reference
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
   */
  name: '__MSG_extensionName__',
  version: packageJson.version,
  description: '__MSG_extensionDescription__',
  permissions: ['storage', 'cookies', 'contextMenus', 'scripting'],
  host_permissions: ['*://*/*'],
  optional_permissions: ['tabs'],
  optional_host_permissions: ['*://*/*'],
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icon-34.png',
  },
  icons: {
    128: 'icon-128.png',
  },
  commands: {
    'execute-highlight': {
      suggested_key: {
        default: 'Alt+H',
        mac: 'MacCtrl+H',
      },
      description: 'Highlight selected text',
    },
    'toggle-highlighter-cursor': {
      description: 'Toggle the highlighter cursor',
    },
    'change-color-to-corn': {
      description: 'Change highlighter color to corn',
    },
    'change-color-to-lavender': {
      description: 'Change highlighter color to lavender',
    },
    'change-color-to-melon': {
      description: 'Change highlighter color to melon',
    },
    'change-color-to-pale-blue': {
      description: 'Change highlighter color to pale blue',
    },
    'change-color-to-feldspar': {
      description: 'Change highlighter color to feldspar',
    },
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['src/pages/contentInjected/index.js', 'assets/js/jquery.js'],
      // KEY for cache invalidation
      css: ['assets/css/contentStyle<KEY>.chunk.css'],
    },
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['src/pages/contentUI/index.js'],
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        'assets/js/*.js',
        'assets/templates/*.html',
        'assets/css/*.css',
        'assets/img/*.svg',
        'icon-128.png',
        'icon-34.png',
      ],
      matches: ['*://*/*'],
    },
  ],
};

export default manifest;
