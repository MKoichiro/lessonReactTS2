/* プレエントリポイント */

/* react関連の読み込み */
import React from 'react';
import ReactDOM from 'react-dom';

import Header from './header-comps/Header'
import Main from './main-comps/Main'
import Footer from './footer-comps/Footer'



const App = () => {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}

export default App;