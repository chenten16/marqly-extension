import React, { useEffect } from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/popup/Popup.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { useRef } from 'react';
import { useState } from 'react';

const Popup = () => {
  const baseUrl = 'http://localhost:3000';
  const [frameUrl, setFrameUrl] = useState('');

  // const theme = useStorage(exampleThemeStorage);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'retrieve_token_from_cookie' }, response => {
      if (!response.token) {
        return setFrameUrl(`${baseUrl}/auth-extension`);
      }
      setFrameUrl(
        `${baseUrl}/bookmark-url-extension?url=${btoa(encodeURIComponent(response.currentUrl))}&token=${btoa(response.token)}`,
      );
    });
  }, []);

  return (
    <div style={{ minWidth: '100%', height: '100%' }}>
      <iframe
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-forms"
        style={{ width: '100%', height: '100%' }}
        src={`${frameUrl}`}></iframe>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div>Loading...</div>), <div>Error Occur</div>);
