/* react関連の読み込み */
import React from 'react';
import styled from 'styled-components';

const Header = () => {
  return (
    <StyledHeader>
      <div className = "header-container">
        <h1>
          React <span>x</span> TypeScript <span>x</span> styled-components
        </h1>
        <h2 children = " - To Do 管理ツール編 - " />
      </div>
    </StyledHeader>
  )
}

const StyledHeader = styled.header`
  height: 45vh;
  background-color: #454e70;
  color: #d0d0d0;;
  clip-path: polygon(
    0 0,
    100% 0,
    100% 100%,
    0 calc(100% - 5vw)
  );
  letter-spacing: .15rem;

  @media (width < 600px) {
    height: 30vh;
  }

  span {
    color: #cfcf00;
  }

  .header-container {
    height: 100%;
    width: 60%;
    margin: 0 auto;
    @media (width < 600px) {
      width: 75%;
    }

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.8rem;

    h1, h2 { margin: 0 auto; }
    /* h1 {  } */
    h2 {
      width: auto;
      text-align: right;
    }
  }
`;

export default Header;
