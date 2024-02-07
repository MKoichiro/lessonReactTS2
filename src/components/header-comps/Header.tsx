/* react関連の読み込み */
import React from 'react';
import styled from 'styled-components';

const Header = () => {
  return (
    <StyledHeader>
      <div className = "header-container">
        <h1 children = " React x TypeScript x styled-components " />
        <h2 children = " - To Do 管理ツール編 - " />
      </div>
    </StyledHeader>
  )
}

const StyledHeader = styled.header`
  height: 30rem;

  .header-container {
    height: 100%;
    width: 60%;
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.8rem;

    h1, h2 { margin: 0 auto; }
    h1 { color: #262626; }
    h2 {
      width: auto;
      text-align: right;
    }
  }
`;

export default Header;
