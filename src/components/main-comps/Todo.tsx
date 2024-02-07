/* react関連 */
import React, { FC, useState, useRef, useEffect } from 'react';

/* font awesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faTrashCan } from '@fortawesome/free-solid-svg-icons';

/* styled-components */
import styled from 'styled-components';
import { getBtnStyle } from './styleMain';


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
    console.log(contentRef);
    // const height = target ? target.scrollHeight : 0;
    // console.log(`${target?.scrollHeight}px`);
    const height = target ? `${target.scrollHeight}px` : `0px`;
    console.log(height);
    setContentHeight(height);
  }, []);


  const inToEditing = () => {
    setInEditing(true);
    setIsOpen(true);
    document.addEventListener('click', handleOutsideClick);
    inputRef.current?.focus();
    if (!inEditing) {
      const target = contentRef.current;
      // const height = target ? target.scrollHeight : 0;
      const height = target ? `${target.scrollHeight}px` : `0px`;
      setContentHeight(height);
    }
  }

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
        inToEditing();
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
    if ( (e.target as Element).closest('.in-editing') ) { return }
    // click された要素が label 要素とその子孫要素の場合: ダブルクリックのうちの1回目のクリックで実行されてしまうのを回避
    if ( (e.target as Element).closest('label')       ) { return }

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

  const Detail = ({ detail }: { detail?: string | undefined }) => {
    const lines = detail?.split(/\n/g);
    const components = lines?.map((line, i) => {
      const formattedLine = line.replaceAll(' ', '\u00A0');
      return ( <p key={i} children={ formattedLine } /> );
    });

    return (
      <div
        className = "detail"
        ref={contentRef}
        children  = { components } />
    );
  };


  // Todo DOM を return
  return (
    <StyledLi
      $isOpen        = { isOpen                     }
      $isDetail      = { Boolean(props.todo.detail) }
      $isCompleted   = { props.todo.isCompleted     }
      $inEditing     = { inEditing                  }
      $contentHeight = { contentHeight              }
    >
      <div className="heading">
        <input
          type = "checkbox"
          checked  = { props.todo.isCompleted                       }
          onChange = { () => { props.onChangeClick(props.todo.id) } } />
        <label
          onClick  = { handleSingleDoubleClick }
          children = { props.todo.title        } />
        <input
          className = "in-editing"
          type      = "text"
          value    = { editingTitle                                    }
          ref      = { inputRef                                        }
          onChange = { (e) => {setEditingTitle(e.currentTarget.value)} } />


        <OpenBtn
          onClick   = { () => setIsOpen(!isOpen)   }
          $isOpen   = { isOpen                     }
          $isDetail = { Boolean(props.todo.detail) }
        >
          <StyledFAI icon = { faChevronUp }/>
        </OpenBtn>

        <DeleteBtn onClick = { () => { props.onDeleteClick(props.todo.id) } } >
          <StyledFAI icon = { faTrashCan }/>
        </DeleteBtn>

      </div>

      <Detail
        detail={props.todo.detail} />

      <textarea
        className   = "in-editing"
        placeholder = "詳細を追加"
        value    = { editingDetail                                    }
        ref      = { textareaRef                                      }
        onChange = { (e) => {setEditingDetail(e.currentTarget.value)} } />
    </StyledLi>
  );
}
// =============================================== △ Todo Component (li elm) △ === //

// === ▽ style ▽ ================================================================= //
// li 以下
interface StyledLiProps {
  $isOpen:              boolean;
  $isDetail:            boolean;
  $isCompleted:         boolean;
  $inEditing:           boolean;
  $contentHeight: string | 'auto';
}

const StyledLi = styled.li<StyledLiProps>`
  font-family: Arial, Helvetica, 'ヒラギノ角ゴ Pro W3', 'Yu Gothic', sans-serif;
  padding: .8rem;
  display: flex;
  flex-direction: column;

  .in-editing {
    border: none;
    background: #fff;
    line-height: 2.8rem;
    padding: 0 .4rem;
    flex: 1;
    display: ${ props => props.$inEditing ? 'block' : 'none' };
    cursor: auto;
  }

  .in-editing:focus {
    border: none;
    outline: var(--border-weight) solid #999900;
  }

  &:nth-child(even) {
    background: #e0e0e0;
  }

  .heading {
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    line-height: 3.2rem;

    input[type="checkbox"] {
      position: relative;
      display: block;
      cursor: pointer;
      border-radius: 0; // iOSで丸くなるのを回避
      border: var(--border-weight) solid #999900;
      margin: 0 1.6rem 0 .8rem;
      width: 1.6rem;
      height: 1.6rem;
      appearance: none;
    }

    input:checked::before {
      content: '';
      position: absolute;
      inset: -.6rem 0 0 .6rem;
      border-right: .3rem solid #999900;
      border-bottom: .3rem solid #999900;
      transform-origin: right bottom;
      transform: translate(-.75rem, -.15rem) rotate(45deg);
    }

    label {
      display: ${ props => props.$inEditing ? 'none': 'block' };
      flex: 1;
      border: none;
      line-height: inherit;
      cursor: ${ props => props.$isDetail ? 'pointer' : 'auto' };
      font-size: inherit;
      font-weight: bold;
    }

    /* input[checked] では初めに checked がついていたものにしか適用されない */
    input:checked + label {
      color: #aaa;
      text-decoration: line-through;
    }

  }

  .detail {
    color: ${ props => props.$isCompleted ? '#aaa': 'inherit' };
    display: ${ props => props.$inEditing ? 'none': 'block' };
    max-height: ${ props => props.$isOpen ? `${ props.$contentHeight }` : '0' };
    max-height: ${ props => props.$inEditing && 'auto' };
    padding-right: 1.6rem;
    padding-bottom: 0;
    padding-left: calc(1.6rem + 1.6rem + .8rem);
    padding-top: ${ props => props.$isOpen ? '.8rem' : '0' }; 
    overflow-y: hidden;
    /* background: pink; */
    transition: max-height 0.5s ease-in-out, padding 0.5s ease-in-out;
  }

  textarea.in-editing {
    margin-top: .8rem;
    min-height: ${ props => `${ props.$contentHeight }` };
    margin-left: calc(1.6rem + 1.6rem + .8rem);
    border-radius: 0; // iOSで丸くなるのを回避
  }
`;

// btns
const StyledFAI = styled(FontAwesomeIcon)` ${ getBtnStyle } `;

// open btn
const OpenBtn = styled.button<{ $isOpen: boolean; $isDetail: boolean; }>`
  svg {
    align-self: flex-start;
    color: #444;
    scale: ${props => props.$isOpen ? '1 1': '1 -1'};
    display: ${props => props.$isDetail ? 'block': 'none'};
    height: 1.6rem;
    padding: .8rem .4rem;
    font-size: .4rem;
    transition: scale .5s;
    margin-right: .8rem;
  }
`;

// delete btn
const DeleteBtn = styled.button`
  align-self: flex-start;
  border: none;
  svg.trash {
    scale: none;
    color: #444;
  }
`;
// ================================================================= △ style △ === //

export default Todo;