/* form 以下の各要素の共通スタイルをスタイル関数で管理 */

import { css } from 'styled-components';
/* Main Component 用の スタイルを import */
import { getBtnStyle } from './styleMain';

// form
const getFormStyle = () => css`
  display: flex;
  flex-wrap: wrap;
  gap: 3.2rem;
  input: { flex: 1; }
`;

// legend
const getLegendStyle = () => css`
  min-width: 100%;
  font-size: 2.4rem;
  font-weight: 700;
`;

// div: StyledInput"s"Wrapper
const getInputsWrapperStyle = () => css`
  display: flex;
  flex-direction: column;
  min-width: 100%;
  
  div + div { margin-top: 1.6rem }
`;

// div: StyledInputWrapper
const getInputWrapperStyle = () => css`
  display: flex;
  flex-direction: column;
`;

// label
const getLabelStyle = (props: { $optional?: boolean; }) => css`
  display: flex;
  gap: .8rem;
  align-items: center;
  font-weight: 700;
  font-size: 2rem;
  letter-spacing: .1rem;
  span {
    font-weight: normal;
    font-size: 1.2rem;
    height: 1.8rem;
    line-height: 1.8rem;
    color: #fff;
    background: ${ props.$optional ? '#444' : '#999900' };
    padding: 0 .4rem;
  }
  span::before {
    content: '${ props.$optional ? '任意' : '必須' }';
  }
`;

// input
const getInputStyle = (props: { as?: React.ElementType; }) => css`
  margin-top: .8rem;
  font-size: 1.6rem;
  padding: .4rem;
  line-height: 2.0rem;
  height: ${ props.as === 'textarea' ? '10rem' : '2.0rem' };
  background: #ddd;
  border: none;
  border-radius: 0;
  color: #999900;
  &::placeholder { color: #888; }
  &:focus { outline: .2rem solid #999900; }

  @media (width < 600px) {
    font-size: 2.8rem;
    &::placeholder { font-size: 1.6rem; }
  }
`;

// add btn
const getAddBtnStyle = () => css`
  /* btn 共通スタイルの読み込みとプロパティの上書き */
  ${ getBtnStyle }
  height: 3.2rem;
  padding: 0;
  font-family: var(--eng-ff-2);

  /* 以下追加プロパティ */
  --margin: .3rem;
  --net-btn-size: calc(3.2rem - .3rem);
  --net-inner-btn-size: calc(var(--net-btn-size) - var(--margin) * 2);

  margin-left: auto;
  border: var(--border-weight) solid #444;
  transition: width .5s ease-out;

  & > div {
    margin: var(--margin);
    width: auto;
    height: var(--net-inner-btn-size);
    contain: paint;
    position: relative;
    div {
      position: absolute;
      top: 0; bottom: 0; left: 0;
      width: var(--net-inner-btn-size);
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        display: block;
        width: 100%;
      }
    }
    p {
      font-family: var(--eng-ff-3);
      letter-spacing: .15rem;
      font-size: 1.8rem;
      position: absolute;
      top: 0; bottom: 0;
      left: calc(var(--border-weight) + var(--margin) + var(--net-inner-btn-size));
      line-height: var(--net-inner-btn-size);
      width: 6rem;
      text-align: center;
      transform: translateX(6rem);
      transition: transform .5s .25s ease-out;
    }
  }

  &:hover { width: calc(3.2rem + 6rem); }
  &:hover > div {
    p { transform: translateX(0); }
  }
`;

// small
const getSmallStyle = (props: { $showNotion: boolean; }) => css`
  opacity: ${ props.$showNotion ? 1 : 0 };
  text-align: right;
  color: #999900;
  font-size: 1.4rem;
  height: 1.8rem;
  line-height: 1.8rem;
  padding-top: .4rem;
`;

export {
  getFormStyle,
  getLegendStyle,
  getInputsWrapperStyle,
  getInputWrapperStyle,
  getLabelStyle,
  getInputStyle,
  getSmallStyle,
  getAddBtnStyle
}