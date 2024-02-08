/* react関連の読み込み */
import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <StyledFooter>
      <h3 children = " React x TypeScript 入門学習: To Do ツール 編 " />
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  display: flex;
  margin-top: auto;
  height: 15vh;
  width: 100%;
  color: #777;
  background: #fcfcfc;
  clip-path: polygon(
    0 5vw, 100% 0, 100% 100%, 0 100%
  );
  @media (width < 600px) {
    height: 10vh;
  }

  h3 {
    padding: 0 .8rem;
    align-self: flex-end;
    margin: 0 auto 0;
    width: 60%;
    line-height: 5rem;
    text-align: right;
    @media (width < 1024px) {
      width: 90%;
    }
  }
`;

export default Footer;
