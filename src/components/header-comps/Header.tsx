/* react関連の読み込み */
import React from 'react';

import { HeaderStyled } from './styleHeader';

const Header = () => {
  return (
    <HeaderStyled>
      <div className="header-container">
        <h1>React x TypeScript 入門学習</h1>
        <h2> - To Do 管理ツール編 - </h2>
      </div>
    </HeaderStyled>
  )
}

export default Header;
