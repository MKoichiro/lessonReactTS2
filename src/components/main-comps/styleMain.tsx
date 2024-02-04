import { css } from 'styled-components';

// button 共通のスタイル関数
const getBtnStyle = (props: { id?: string; }) => css`
  color: #444;
  font-family: ${ props.id === 'add-btn' ? 'var(--eng-ff-2)' : 'var(--eng-ff-3)' };
  margin-left: ${ props.id === 'add-btn' ? 'auto' : '' };
  display: inline-block;
  height: 3.2rem;
  width: 3.2rem;
  transition: transform 100ms;
  &:active { transform: scale(.9); }
`;

export { getBtnStyle };