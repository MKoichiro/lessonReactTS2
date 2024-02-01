/* react関連 */
import React, { FC, useState, useRef } from 'react';
/* styled-components */
// import styled from 'styled-components';
import styled, { css } from 'styled-components';
import { Link } from 'react-scroll';
/* font awesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

/* Main Component 用の スタイルを import */
import { getBtnStyle } from './styleMain';



// === ▽ Form Component (form elm) ▽ ============================================= //
// props の型定義
interface FormProps { onAddSubmit: (text: string, detail?: string) => void }

// Form Component を定義
const Form: FC<FormProps> = (props) => {

  const [title, setTitle]   = useState('');
  const [detail, setDetail] = useState('');
  const [showNotion, setShowNotion] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
    if (showNotion && e.currentTarget.value) { setShowNotion(false) }
  };
  const handleDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetail(e.currentTarget.value);
  }


  const executeAdd = () => {
    // 入力フォームのクリア
    setTitle('');
    setDetail('');
    if (inputRef.current) { inputRef.current.focus() }

    // スペースのみの入力場合は何もせずに抜ける
    const titleTrimed: string = title.replaceAll(/ |　/g, '');
    if (!titleTrimed) { setShowNotion(true); return }

    const detailTrimed: string | null = detail.replaceAll(/ |　/g, '');
    if (!detailTrimed) { props.onAddSubmit(title)         }
    else               { props.onAddSubmit(title, detail) }

  };


  // Form DOM を return
  return (
    <StyledForm onSubmit={ (e) => {e.preventDefault()} }>
      <StyledLegend id="test">CREATE NEW</StyledLegend>
      <StyledInputsWrapper>
        <StyledInputWrapper to="test" smooth={true}>
          <StyledLabel $optional={false} htmlFor="new-title">
            <span>{/* 必須 */}</span>Title:
          </StyledLabel>
          <StyledInput
            id="new-title"
            type="text"
            required
            placeholder="例: スーパーでお買い物"
            value    = {             title }
            onChange = { handleTitleChange }
            ref      = {          inputRef }
          />
          <StyledSmall
            $showNotion={showNotion ? true : false}
            children="※ タイトルは必須です。" />
        </StyledInputWrapper>

        <StyledInputWrapper to="test">
          <StyledLabel $optional={true} htmlFor="new-detail">
            <span>{/* 任意 */}</span>Detail:
          </StyledLabel>
          <StyledInput
            as={'textarea'}
            id="new-detail"
            placeholder="例: 牛乳、ニンジン、ジャガイモ、カレールー"
            value    = { detail             }
            onChange = { handleDetailChange }
          />
        </StyledInputWrapper>
      </StyledInputsWrapper>
      <StyledAddBtn
        onClick={ executeAdd }
        type="button"
        id="add-btn"
      >
        <div>
          <div>
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <p>Add</p>
        </div>
      </StyledAddBtn>
    </StyledForm>
  );
}
// ============================================= △ Form Component (form elm) △ === //

// === ▽ style ▽ ================================================================= //
// form
const StyledForm = styled.form({
  margin: '3.2rem 0 90vh',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3.2rem',
  borderTop: '.15rem dashed #3e3e3e',
  padding: '3.2rem .8rem 0',
    input: {
      flex: 1,
    }
});


// legend
const StyledLegend = styled.legend({
  minWidth: '100%',
  fontSize: '2.4rem',
  fontWeight: 700,
});

// div
const StyledInputsWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  minWidth: '100%',
  
  'div + div': {
    marginTop: '1.6rem',
  },
});

// div StyledInputWrapper
const StyledInputWrapper = styled(Link)({
  display: 'flex',
  flexDirection: 'column',
});

// label
const StyledLabel = styled.label<{$optional?: boolean}>`
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
    background: ${props => props.$optional ? '#444' : '#999900' };
    padding: 0 .4rem;
  }
  span::before {
    content: '${props => props.$optional ? '任意' : '必須'}';
  }
`;

// input
const StyledInput = styled.input<{as?: React.ElementType}>`
  margin-top: .8rem;
  font-size: 1.6rem;
  padding: .4rem;
  line-height: 2.0rem;
  height: ${props => (props.as === 'textarea') ? '10rem' : '2.0rem'};
  background: #ddd;
  border: none;
  border-radius: 0;
  color: #999900;
  &::placeholder {
    color: #888;
  }
  &:focus {
    outline: .2rem solid #999900;
  }

  @media (width < 600px) {
    font-size: 2.8rem;
    &::placeholder {
      font-size: 1.6rem;
    }
  }
`;

// add btn
const StyledAddBtn = styled.button`
  ${getBtnStyle}
  border: var(--border-weight) solid #444;
  transition: width .5s ease-out;

  --margin: .3rem;
  --net-btn-size: calc((3.2rem - .3rem));
  --net-inner-btn-size: calc(var(--net-btn-size) - var(--margin) * 2);
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

  &:hover {
    width: calc(3.2rem + 6rem);
  }
  &:hover > div {
    p {
      transform: translateX(0);
    }
  }
`;

const StyledSmall = styled.small<{$showNotion: boolean}>`
  opacity: ${props => props.$showNotion ? 1 : 0 };
  text-align: right;
  color: #999900;
  font-size: 1.4rem;
  height: 1.8rem;
  line-height: 1.8rem;
  padding-top: .4rem;
`;
// ================================================================= △ style △ === //



export default Form;
export {StyledForm, StyledLegend, StyledInputsWrapper, StyledInputWrapper, StyledLabel, StyledInput, StyledSmall, StyledAddBtn};