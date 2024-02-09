/* react関連 */
import React, { FC, useState, useRef } from 'react';
/* styled-components */
import styled from 'styled-components';
import { Link } from 'react-scroll';
/* font awesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

/* from 関連の共通スタイルを定義してあるスタイル関数を import */
import * as FormStyles from './commonStyleForm';


// === ▽ Form Component (form elm) ▽ ============================================= //
// props の型定義
interface FormProps { onAddSubmit: (text: string, detail?: string) => void }

// Form Component を定義
const Form: FC<FormProps> = (props) => {

  const [title, setTitle]   = useState('');
  const [detail, setDetail] = useState('');
  const [showNotion, setShowNotion] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    // 入力がスペースのみや空欄の場合は入力エラーを表示するだけで抜ける
    const titleTrimed: string = title.replaceAll(/ |　/g, '');
    if (!titleTrimed) { setShowNotion(true); return }

    const detailTrimed: string | null = detail.replaceAll(/ |　/g, '');
    if (!detailTrimed) { props.onAddSubmit(title)         }
    else               { props.onAddSubmit(title, detail) }
  };

  const handleInputBlur = (target: 'input' | 'textarea') => {
    // input から focus が外れたとき、textarea にも focus が当たっていなければ
    if (target === 'input') {
      setTimeout (() => { (document.activeElement !== textareaRef.current) && setShowNotion(false); }, 0);
    }
    // textarea から focus が外れたとき、input にも focus が当たっていなければ
    else if (target === 'textarea') {
      setTimeout (() => { (document.activeElement !== inputRef.current) && setShowNotion(false); }, 0);
    }
  }


  // Form DOM を return
  return (
    <StyledForm onSubmit={ (e) => {e.preventDefault()} }>
      <StyledLegend id="create-new">CREATE NEW</StyledLegend>
      <StyledInputsWrapper>
        <StyledInputWrapper to="create-new" smooth={true}>
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
            onBlur   = {() => {handleInputBlur('input')}}
          />
          <StyledSmall
            $showNotion={ showNotion }
            children="※ タイトルは必須です。" />
        </StyledInputWrapper>

        <StyledInputWrapper to="create-new">
          <StyledLabel $optional={true} htmlFor="new-detail">
            <span>{/* 任意 */}</span>Detail:
          </StyledLabel>
          <StyledInput
            as={'textarea'}
            id="new-detail"
            placeholder="例: 牛乳、ニンジン、ジャガイモ、カレールー"
            value    = { detail             }
            onChange = { handleDetailChange }
            ref      = {textareaRef}
            onBlur   = {() => {handleInputBlur('textarea')}}
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
const StyledForm = styled.form`
  ${ FormStyles.getFormStyle }
  margin: 3.2rem 0;
  padding: 3.2rem .8rem 0;
  border-top: var(--border-weight) dashed #3e3e3e;
`;

const StyledLegend = styled.legend`
  ${ FormStyles.getLegendStyle }
`;
const StyledInputsWrapper = styled.div`
  ${ FormStyles.getInputsWrapperStyle }
`;
const StyledInputWrapper = styled(Link)`
  ${ FormStyles.getInputWrapperStyle }
`;
const StyledLabel = styled.label<{$optional?: boolean}>`
  ${ FormStyles.getLabelStyle }
`;
const StyledInput = styled.input<{$as?: React.ElementType}>`
  ${ FormStyles.getInputStyle }
`;
const StyledAddBtn = styled.button<{id?: string}>`
  ${ FormStyles.getAddBtnStyle }
`;
const StyledSmall = styled.small<{$showNotion: boolean}>`
  ${ FormStyles.getSmallStyle }
`;
// ================================================================= △ style △ === //

export default Form;