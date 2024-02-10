/* プレエントリポイント */

/* react関連の読み込み */
import React, {useState}from 'react';
import ReactDOM from 'react-dom';

import Header from './header-comps/Header'
import Main from './main-comps/Main'
import Footer from './footer-comps/Footer'

import styled from 'styled-components';



const App = () => {
  const [enlarged, setEnlarged] = useState(false);
  const handleTestClick = () => {
    setEnlarged(!enlarged);
  }
  return (
    <>
      <Header />
      <Main />
      <Footer />
      <Test onClick={handleTestClick} $enlarged={enlarged}/>
    </>
  );
}
const Test = styled.div<{$enlarged: boolean}>`
  background: pink;
  transition: width 1s, height 1s;
  width: ${props => props.$enlarged ? '500px' : '300px'};
  height: ${props => props.$enlarged ? '500px' : '300px'};
`;
export default App;