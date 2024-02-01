/* エントリポイント */

/* react関連 */
import React from 'react';
import ReactDOM from 'react-dom';               // createRootが未だ含まれていない
import { createRoot } from 'react-dom/client';  // 現状createRootだけreact-dom/clientから取得

/* 共通スタイル */
import GlobalStyle from './globalStyle/globalStyle';

/* App Component */
import App from './components/App';

// rootを取得
const rootDiv = document.querySelector('#root');

if (rootDiv) {
  const root = createRoot(rootDiv);

 root.render(
  <React.StrictMode>
    <GlobalStyle />          {/* 共通スタイル  読み込み */}
    <App />                  {/* App Component 埋め込み */}
  </React.StrictMode>
 );

} else { console.error('The element with the id "root" is not found.') }