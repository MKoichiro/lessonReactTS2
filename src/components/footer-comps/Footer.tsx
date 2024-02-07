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
  margin-top: auto;
  height: 5rem;
  width: 100%;
  color: #777;
  border-top: .15rem solid #999;
  background: #e9e9e9;

  h3 {
    height: inherit;
    line-height: 5rem;
    text-align: center
  }
`;

export default Footer;
