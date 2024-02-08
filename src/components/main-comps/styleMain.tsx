import { css } from 'styled-components';

// button 共通のスタイル関数
const getBtnStyle = () => css`
  color: #444;
  display: inline-block;
  width: 3.2rem;
  transition: transform 100ms;
  &:active { transform: scale(.9); }
  font-family: var(--eng-ff-3);

  height: 1.6rem;
  padding: .8rem .4rem;
  @media (width < 600px) {
    width: 1rem;
    padding: .4rem .4rem;
  }
`;



export { getBtnStyle };