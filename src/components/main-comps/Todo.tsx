/* react関連 */
import React, { FC, useState, useRef, useEffect } from 'react';

/* font awesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faTrashCan } from '@fortawesome/free-solid-svg-icons';

/* styled-components */
import styled, {css} from 'styled-components';
import { getIconRect, getBtnStyle } from './styleMain';


// TodoTypes は global に定義
interface TodoTypes { id: number; detail?: string; title: string; isCompleted: boolean; }

// === ▽ Todo Component (li elm)  ▽ ============================================== //
// props の型を定義
interface TodoProps {
  todo:                          TodoTypes;
  onDeleteClick:      (id: number) => void;
  onChangeClick:      (id: number) => void;
  renewTodo:     (todo: TodoTypes) => void;
}

// Todo Component を定義
const Todo: FC<TodoProps> = (props) => {

  const [ isOpen,        setIsOpen        ] = useState(true); // 高さを取得するためあえて最初は開いておく
  const [ inEditing,     setInEditing     ] = useState(false);
  const [ editingTitle,  setEditingTitle  ] = useState(props.todo.title);
  const [ editingDetail, setEditingDetail ] = useState(props.todo.detail);
  const [ contentHeight, setContentHeight ] = useState<string | 'auto'>('auto');

  const contentRef  = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const target = contentRef.current;
    // const height = target ? target.scrollHeight : 0;
    // console.log(`${target?.scrollHeight}px`);
    const height = target ? `${target.scrollHeight}px` : `0px`;
    setContentHeight(height);
  }, []);



  const inToEditing = (trigger: 'input' | 'textarea') => {
    console.log(inputRef, textareaRef);
    setInEditing(true);
    setIsOpen(true);
    document.addEventListener('click', handleOutsideClick);

    if (trigger === 'input') {
      setTimeout(() => { inputRef.current?.focus(); }, 0);
    }
    else if (trigger === 'textarea') {
      setTimeout(() => {
        const textarea = textareaRef.current;
        textarea?.focus();
        textarea && (textarea.selectionStart = textarea.selectionEnd = textarea?.value.length);
      }, 0);
    }

    if (!inEditing) {
      const target = contentRef.current;
      // const height = target ? target.scrollHeight : 0;
      const height = target ? `${target.scrollHeight}px` : `0px`;
      setContentHeight(height);
    }
  };

  // double/singleクリックを区別して処理を実行する関数
  let clickCounts: number = 0, timeoutId: number | undefined;
  const DELAY: number = 200;
  const handleSingleDoubleClick = () => {
    clickCounts++;
    switch (clickCounts) {
      case 1: // single: delay[ms]後に実行予約
        timeoutId = window.setTimeout(() => {
          // --- 正味実行したい処理 -------------------- //
          console.log("Single click: toggle open/close state");
          if (props.todo.detail) { setIsOpen(!isOpen) }
          // ------------------------------------------- //
          clickCounts = 0;
        }, DELAY);
      break;

      case 2: // double: delay[ms]以内に再びclickされたとき
        // single click の実行予約をキャンセル
        clearTimeout(timeoutId);
        // --- 正味実行したい処理 -------------------- //
        console.log("Double click: switch to edit mode");
        inToEditing('input');
        // ------------------------------------------- //
        clickCounts = 0;
      break;
      
      default:
        console.error('clickカウンターが予期せぬ値になりました。\n' + `clickCounts: ${clickCounts}`);
      break;
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    // click された要素が input 要素とその子孫要素の場合
    if ( (e.target as Element).closest('.now-editing') ) { return }
    // click された要素が label 要素とその子孫要素の場合: ダブルクリックのうちの1回目のクリックで実行されてしまうのを回避
    if ( (e.target as Element).closest('label') )        { return }

    if (inputRef.current && textareaRef.current) {
      const editedTitle = inputRef.current.value;
      const editedDetail = textareaRef.current.value;
      const newTodo = {
        ...props.todo,
        title: editedTitle,
        detail: editedDetail,
      }
      props.renewTodo(newTodo);
      document.removeEventListener('click', handleOutsideClick);
      setInEditing(false);
    }
  }

  const Detail: FC<{todo: TodoTypes;}> = (props) => {
    const lines = props.todo.detail?.split(/\n/g);
    const components = lines?.map((line, i) => {
      const formattedLine = line.replaceAll(' ', '\u00A0');
      return (
        <p
          key            = { i }
          children       = { formattedLine }
          onDoubleClick  = { () => { inToEditing('textarea') } } />
      );
    });
  
    return (
      <StyledDiv
        $inEditing     = { inEditing              }
        $isCompleted   = { props.todo.isCompleted }
        $isOpen        = { isOpen                 }
        $contentHeight = { contentHeight          }
        ref            = { contentRef             }
        children       = { components             } />
    );
  };


  // Todo DOM を return
  return (
    <StyledLi $hasDetail = { Boolean(props.todo.detail) } >
      <StyledHeading>

        <StyledCheckBox
          type = "checkbox"
          checked  = { props.todo.isCompleted                       }
          onChange = { () => { props.onChangeClick(props.todo.id) } } />
        <StyledLabel
          $inEditing    = {inEditing}
          $hasDetail    = {Boolean(props.todo.detail)}
          onDoubleClick = { (e) => { e.preventDefault() } }
          onClick       = { handleSingleDoubleClick       }
          children      = { props.todo.title              } />
        <StyledInput
          className  = 'now-editing'
          $inEditing = { inEditing }
          type       = "text"
          value      = { editingTitle                                      }
          ref        = { inputRef                                          }
          onChange   = { (e) => { setEditingTitle(e.currentTarget.value) } } />

        <OpenBtn
          onClick   = { () => setIsOpen(!isOpen)   }
          $isOpen   = { isOpen                     }
          $hasDetail = { Boolean(props.todo.detail) }
        >
          <StyledFAI icon = { faChevronUp }/>
        </OpenBtn>

        <DeleteBtn onClick = { () => { props.onDeleteClick(props.todo.id) } } >
          <StyledFAI icon = { faTrashCan }/>
        </DeleteBtn>

      </StyledHeading>

      <Detail todo = { props.todo } />

      <StyledTextArea
        className      = "now-editing"
        $inEditing     = { inEditing }
        $hasDetail     = { Boolean(props.todo.detail) }
        $contentHeight = { contentHeight }
        placeholder    = "詳細を追加"
        value          = { editingDetail                                    }
        ref            = { textareaRef                                      }
        onChange       = { (e) => {setEditingDetail(e.currentTarget.value)} } />
    </StyledLi>
  );
}
// =============================================== △ Todo Component (li elm) △ === //


// === ▽ style ▽ ================================================================= //
// li 
const StyledLi = styled.li<{$hasDetail: boolean}>`
  font-family: Arial, Helvetica, 'ヒラギノ角ゴ Pro W3', 'Yu Gothic', sans-serif;
  padding: .8rem;
  display: flex;
  flex-direction: column;

  --cb-side-length: 1.6rem;
  --cb-margin-l: .8rem;
  --cb-margin-r: 1.6rem;
  ${ getIconRect }
  --detail-margin-l: calc(var(--cb-side-length) + var(--cb-margin-l) + var(--cb-margin-r));
  --detail-margin-r: ${ props => props.$hasDetail ? 'calc((var(--icon-width) + var(--padding-lr) * 2) * 2)' : 'calc(var(--icon-width) + var(--padding-lr) * 2)'};

  &:nth-child(odd) { background: #e0e0e0; }
`;

const StyledHeading = styled.div`
  display: flex;
  align-items: center;

  /* input[checked] では初めに checked がついていたものにしか適用されない */
  input:checked + label {
    color: #aaa;
    text-decoration: line-through;
  }
`;

const StyledCheckBox = styled.input`
  position: relative;
  display: block;
  cursor: pointer;
  border-radius: 0; // iOSで丸くなるのを回避
  border: var(--border-weight) solid #990;
  margin: 0 var(--cb-margin-r) 0 var(--cb-margin-l);
  width: var(--cb-side-length);
  height: var(--cb-side-length);
  appearance: none;
  @media (width < 600px) {
    --cb-side-length: 1.6rem;
  }

  &:checked::before {
    content: '';
    position: absolute;
    inset: -.6rem 0 0 .6rem;
    border-right: .3rem solid #990;
    border-bottom: .3rem solid #990;
    transform-origin: right bottom;
    transform: translate(-.75rem, -.15rem) rotate(45deg);
  }
`;


const StyledLabel = styled.label<{$inEditing: boolean; $hasDetail: boolean}>`
  display: ${ props => props.$inEditing ? 'none': 'block' };
  flex: 1;
  border: none;
  cursor: ${ props => props.$hasDetail ? 'pointer' : 'auto' };
  font-weight: bold;
`;

const StyledDiv = styled.div<{$inEditing: boolean; $isCompleted: boolean; $isOpen: boolean; $contentHeight: string}>`

  display: ${ props => props.$inEditing ? 'none': 'block' };
  color: ${ props => props.$isCompleted ? '#aaa': 'inherit' };
  max-height: ${ props => props.$isOpen ? `${ props.$contentHeight }` : '0' };
  max-height: ${ props => props.$inEditing && 'auto' };
  text-decoration: ${ props => props.$isCompleted ? 'line-through' : 'none' };

  padding-top: ${ props => props.$isOpen ? '.8rem' : '0' };
  padding-right: 1.6rem;
  padding-bottom: 0;
  padding-left: var(--detail-margin-l);

  overflow-y: hidden;
  transition: max-height 0.5s ease-in-out, padding 0.5s ease-in-out;
`;

const getInEditingStyle = (props: {$inEditing: boolean}) => css`
  --line-height: 2.8rem;
  @media (width < 600px) {
    --line-height: 2rem;
  }
  border: none;
  background: #fff;
  line-height: var(--line-height);
  padding: 0 .4rem;
  flex: 1;
  display: ${ props.$inEditing ? 'block' : 'none' };
  cursor: auto;
  border-radius: 0; // iOSで丸くなるのを回避
  &:focus {
    border: none;
    outline: var(--border-weight) solid #990;
  }
`;

const StyledTextArea = styled.textarea<{$contentHeight: string; $hasDetail: boolean; $inEditing: boolean}>`
  ${ getInEditingStyle }

  margin-top: .8rem;
  min-height: ${ props => `${ props.$contentHeight }` };
  margin-left: var(--detail-margin-l);
  margin-right: var(--detail-margin-r);
`;

const StyledInput = styled.input<{$inEditing: boolean}>`
  ${ getInEditingStyle }
`;




// btns
const StyledFAI = styled(FontAwesomeIcon)` ${ getBtnStyle } `;

// open btn
const OpenBtn = styled.button<{ $isOpen: boolean; $hasDetail: boolean; }>`
  scale: ${ props => props.$isOpen ? '1 1': '1 -1' };
  display: ${ props => props.$hasDetail ? 'block': 'none' };
  svg:active {
    transform: none;
  }
`;

// delete btn
const DeleteBtn = styled.button`
`;
// ================================================================= △ style △ === //

export default Todo;