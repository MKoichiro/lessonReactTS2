/* react */
import React, { useState, useEffect, useRef, MouseEvent } from 'react';
/* font awesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faGear, faPlus  } from '@fortawesome/free-solid-svg-icons';
/* styled-components */
import styled from 'styled-components';
import { getBtnStyle } from './styleMain';
/* components */
import Form from './Form';
import Todo from './Todo';

import {StyledForm, StyledLegend, StyledInputsWrapper, StyledInputWrapper, StyledLabel, StyledInput, StyledSmall, StyledAddBtn} from './Form';

// TodoTypes は global に定義
interface TodoTypes { id: number; detail?: string; title: string; isCompleted: boolean; }
interface CategoryTypes { id: number; title: string; }

// === ▽ Main Component (main elm) ▽ ============================================= //
const Main = () => {

  const [todos, setTodos] = useState<TodoTypes[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const storageDataTabTitleString: string | null = localStorage.getItem('tab_titles');
  let storageDataTabTitle: CategoryTypes[];
  if (storageDataTabTitleString) {
    storageDataTabTitle = JSON.parse(storageDataTabTitleString);
  } else {
    storageDataTabTitle = [];
    console.error("local storage に 'tab_titles' のデータがありません。");
  }
  console.log(storageDataTabTitle);
  const [categories, setCategories] = useState<CategoryTypes[]>(storageDataTabTitle);



  useEffect(() => {
    const storageData = localStorage.getItem(storageDataTabTitle[activeIndex].title);
    let savedTodos;
    if (storageData === null) { savedTodos = []                      }
    else                      { savedTodos = JSON.parse(storageData) }
    setTodos(savedTodos);
    console.log(activeIndex, savedTodos);
  }, [activeIndex]);




  const updateTodos = (newTodos: TodoTypes[]) => {
    setTodos(newTodos);
    const TODO_L_STRAGE_KEY = categories[activeIndex].title;
    localStorage.setItem(TODO_L_STRAGE_KEY, JSON.stringify(newTodos));
  }

  // --- Todo Component に渡すハンドラ --------------------------------------- //
  // 1. delete button: click
  const handleTodoDeleteClick = (id: number) => {
    if (!confirm('Are you sure to delet this item?')) { return }
    
    const newTodos = [...todos].filter((todo) => { return todo.id !== id });
    updateTodos(newTodos);
  }
  // 2. check box: change
  const handleTodoCheckBoxChange = (id: number) => {
    const newTodos: TodoTypes[] = [...todos].map((todo) => {
      return {
        ...todo, // この書き方が許されるらしい、いったんベタっとspredして、変更のあるプロパティのみ変更できる。ただし、普通に(スプレッド構文以外で)同一名のプロパティを書くとエラーなので注意
        isCompleted: (id === todo.id) ? !todo.isCompleted : todo.isCompleted,
      };
    });
    updateTodos(newTodos);
  }
  // ------------------------------------------------------------------------- //

  const handleTodoEdited = (newTodo: TodoTypes) => {

    const newTodos = [...todos];
    // todo.idはDate.now()なので、todo.idが直接indexに一致しない。ので、ここでfindIndexする必要がある。
    const todoIndex = newTodos.findIndex((item) => item.id === newTodo.id);
  
    if (todoIndex !== -1) {
      newTodos[todoIndex] = newTodo;
      updateTodos(newTodos);
    } else { console.error('リストのデータが見つからないため、更新できませんでした。') }
  }

  // --- Form Component に渡すハンドラ: add button: click -------------------- //
  const handleAddFormSubmit = (title: string, detail?: string) => {
    const newTodos = [...todos];
    const newItem: TodoTypes  = {
      id: Date.now(),
      title: title,
      detail: detail,
      isCompleted: false
    }
    newTodos.push(newItem);
    updateTodos(newTodos);
  }
  // ------------------------------------------------------------------------- //

  // --- Main Component で使うハンドラ: purge button: click ------------------ //
  const handlePurgeClick = () => {
    const newTodos = todos.filter((todo) => { return !todo.isCompleted });
    const hasCompletedTodo = !(todos.length === newTodos.length);
    if (!hasCompletedTodo) { return }
    if (!confirm('[!] 完了済みのタスクをすべて削除しますか？')) { return }
    updateTodos(newTodos);
  };
  // ------------------------------------------------------------------------- //



  // 作業中--------------------------------------------------------------------------

  const Tab = () => {

    const handleTabClick = (i: number) => (e: MouseEvent) => {
      console.log(`Clicked tab index: ${i}`);
      setActiveIndex(i);
    };

    const tabNames = categories.map(category => {return category.title});
    const TabItems = tabNames.map((tabName, i) => {
      return (
        <StyledButton
          key={i}
          $isActive={activeIndex === i}
          onClick={handleTabClick(i)}
          children={tabName}
        />
      );
    });

    return ( <StyledTabUl children={ TabItems } /> );
  };



  // Todo Component (li elm) の配列を生成
  const TodoListItems = todos.map((todo) => {
    return (
      <Todo
        key           = { todo.id }
        todo          = { todo    }
        onDeleteClick = { handleTodoDeleteClick    }
        onChangeClick = { handleTodoCheckBoxChange }
        renewTodo     = { handleTodoEdited         }
      />
    );
  });

  const TodosList = () => {
    return ( <StyledUl id="todos" children={ TodoListItems } /> );
  };



  const [tabEditIsOpen, setTabEditIsOpen] = useState(false);
  const [newTabTitle, setNewTabTitle] = useState('');
  // const inputRef = useRef<HTMLInputElement>(null);


  const handleGearIconClick = () => {
    setTabEditIsOpen(true);
    
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTabTitle(e.currentTarget.value);
  }

  const executeAdd = () => {
    // フォームをクリア
    setNewTabTitle('');

    // 新しい newTabTitle を key として、todos を格納するための空の配列を新規登録登録
    const TODO_L_STRAGE_KEY = newTabTitle;
    localStorage.setItem(TODO_L_STRAGE_KEY, JSON.stringify([]));

    // categories を新しいtabtitleを含めたものに更新
    const newCategory = {id: categories.length, title: newTabTitle}
    const newCategories = [...categories, newCategory];
    setCategories(newCategories);

    // local storage の tab_titles を更新
    const TAB_TITLES_L_STRAGE_KEY = 'tab_titles';
    localStorage.setItem(TAB_TITLES_L_STRAGE_KEY, JSON.stringify(newCategories));
  };
  // 作業中--------------------------------------------------------------------------


  // Main DOM を return
  return (
    <StyledMain>

      <StyledH2>
        ToDo List
        <StyledBtn onClick={ handlePurgeClick }>
          <div>
            <FontAwesomeIcon icon={faArrowsRotate} />
          </div>
        </StyledBtn>
      </StyledH2>

      <StyledTabNav>
        <Tab />
        <Separater/>
        <StyledGearIcon onClick={handleGearIconClick} children={<FontAwesomeIcon icon={faGear} />}/>
      </StyledTabNav>
      <TodosList />

      <Form 
        key = {10}
        onAddSubmit = { handleAddFormSubmit }
      />

      <div>
        <StyledForm onSubmit={(e) => { e.preventDefault() }}>
          <StyledLegend id="test">CREATE NEW LIST</StyledLegend>
          <StyledInputsWrapper>
            <StyledInputWrapper to="test" smooth={true}>
              <StyledLabel $optional={false} htmlFor="new-tab-title">
                <span>{/* 必須 */}</span>Category Name:
              </StyledLabel>
              <StyledInput
                id="new-tab-title"
                type="text"
                required
                placeholder="例: 買い物用"
                value={newTabTitle}
                onChange={handleTitleChange}
                // ref={inputRef}
              />
              {/* <StyledSmall
                $showNotion={showNotion ? true : false}
                children="※ タイトルは必須です。" /> */}
            </StyledInputWrapper>

          </StyledInputsWrapper>
          <StyledAddBtn
            onClick={executeAdd}
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
        </StyledForm> <legend>
          CREATE NEW LIST
        </legend>

      </div>

    </StyledMain>
  );
}
// ============================================= △ Main Component (main elm) △ === //

// === ▽ style ▽ ================================================================= //
// main elm
const StyledMain = styled.main({
  width: '60%',
  margin: '0 auto',
  '@media (max-width: 1024px)': {
    width: '90%',
  },
});

const StyledH2 = styled.h2({
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '.15rem solid #3e3e3e',
  padding: '0 .8rem .8rem',
});

// ul
const StyledUl = styled.ul({
  marginTop: '.8rem',
});

const StyledBtn = styled.button<{id?: string;}>`
  ${getBtnStyle}
`;

const StyledTabNav = styled.nav`
  margin-top: 3.2rem;
  padding: 0 .8rem;

  display: flex;
`;
const Separater = styled.span`
  width: .3rem;
  background: #990;
  height: 3.6rem;
  margin: 0 1.6rem 0 3rem;
`;
const StyledGearIcon = styled.div`
  height: 3.6rem;
  display: flex;
  align-items: center;
  svg {
    padding: .4rem;
    height: 1.8rem;
  }
`;


const StyledTabUl = styled.ul`
  font-size: 2rem;
  display: flex;
  flex: 1;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar  {
    display: none;
  }
`;
const StyledButton = styled.button<{$isActive: boolean}>`
  color: ${props => props.$isActive ? '#990' : '#777'};
  background-color: ${props => props.$isActive ? '#f9f9f9' : '#d9d9d9'};
  height: 3.6rem;
  line-height: calc(3.6rem - (.4rem + .15rem) * 2);
  display: block;
  max-width: 15%;
  min-width: 15%;
  border: .15rem solid #444;
  padding: .4rem .8rem;
  font-size: inherit;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  & + button {
    border-left: none;
  }
`;


// ================================================================= △ style △ === //



export default Main;