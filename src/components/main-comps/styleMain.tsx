import { css } from 'styled-components';

const getIconRect = () => css`
  --icon-width: 3.2rem;
  --icon-height: 1.6rem;
  --padding-tb: .8rem;
  --padding-lr: .4rem;
  @media (width < 1024px) {
    --icon-width: 1.6rem;
    --padding-tb: .4rem;
  }
  @media (width < 600px) {
    --icon-width: 1rem;
    --icon-height: 1rem;
  }
`;

// button 共通のスタイル関数
const getBtnStyle = () => css`
  ${getIconRect}
  display: inline-block;
  font-family: var(--eng-ff-3);
  color: #444;

  width: var(--icon-width);
  height: var(--icon-height);
  padding: var(--padding-tb) var(--padding-lr);

  transition: transform 100ms;
  &:active { transform: scale(.9); }
`;

export { getIconRect, getBtnStyle };