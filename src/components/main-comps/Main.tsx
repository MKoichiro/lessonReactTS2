/* react */
import React, { useState, MouseEvent, useEffect, useRef } from 'react';
/* font awesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faGear } from '@fortawesome/free-solid-svg-icons';
/* styled-components */
import styled from 'styled-components';
import { getBtnStyle } from './styleMain';
/* components */
import Form from './Form';
import Todo from './Todo';
import TabSettingModal from './TabSettingModal'



// TodoTypes は global に定義
interface TodoTypes { id: number; detail?: string; title: string; isCompleted: boolean; }
interface CategoryTypes { id: number; title: string; }

// === ▽ Main Component (main elm) ▽ ============================================= //
const Main = () => {

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const CATEGORIES_L_STRAGE_KEY = 'tab_titles';
  const TEMPLATE_CATEGORY_TITLE = 'Template 1'
  const TEMPLATE_CATEGORY_KEY   = '0_Template 1';
  const ID_ADMIN                = 'id_admin';

  // 新規ブラウザまたは新規デバイスからアクセスされたとき
  if (!localStorage.getItem(ID_ADMIN)) { localStorage.setItem(ID_ADMIN, JSON.stringify(1)); }

  // categories の初期化
  const storageDataTabTitleString: string | null = localStorage.getItem('tab_titles');
  let storageDataTabTitle: CategoryTypes[];
  if (storageDataTabTitleString) {
    storageDataTabTitle = JSON.parse(storageDataTabTitleString);
  }
  else { // 新規ブラウザまたは新規デバイスからアクセスされたとき
    storageDataTabTitle = [{id: 0, title: TEMPLATE_CATEGORY_TITLE}];
    localStorage.setItem(TEMPLATE_CATEGORY_KEY, JSON.stringify(storageDataTabTitle));
    console.error("local storage に 'tab_titles' のデータがありません。");
  }
  const [categories, setCategories] = useState<CategoryTypes[]>(storageDataTabTitle);


  // categories の更新関数
  const updateCategories = (newCategories: CategoryTypes[]) => {

    setCategories(newCategories);
    localStorage.setItem(CATEGORIES_L_STRAGE_KEY, JSON.stringify(newCategories));
  };

  // 0番目の category で todos の初期化
  const initializeTodos = (storageKey: string): TodoTypes[] => {
    const templateTodos = [
      {
        id: Date.now(),
        title: "下のフォームからタスクを新規作成・追加できます。追加済みのタスクを編集するにはここをダブルクリック。",
        detail: "編集が完了したら余白をクリックして変更内容を確定。",
        isCompleted: false,
      },
    ];
    localStorage.setItem(storageKey, JSON.stringify(templateTodos));
    return templateTodos;
  };
  const storageData = localStorage.getItem(storageDataTabTitle[0].title);
  let initialTodos: TodoTypes[];
  if (storageData === null) { initialTodos = initializeTodos(TEMPLATE_CATEGORY_KEY); }
  else                      { initialTodos = JSON.parse(storageData);                 }
  const [todos, setTodos] = useState<TodoTypes[]>(initialTodos);

  // todos の更新関数
  const updateTodos = (newTodos: TodoTypes[]) => {
    setTodos(newTodos);
    const TODO_L_STRAGE_KEY = `${categories[activeIndex].id}_${categories[activeIndex].title}`;
    localStorage.setItem(TODO_L_STRAGE_KEY, JSON.stringify(newTodos));
  };

  // --- Todo Component に渡すハンドラ --------------------------------------- //
  // 1. delete button: click
  const handleTodoDeleteClick = (id: number) => {
    const deletingTodo = todos.filter(todo => {return todo.id === id})[0];
    if (!confirm(`以下のタスクを完全に削除します。\n\n ・${ deletingTodo.title }`)) { return }
    
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
    if (!confirm('[ ! ] 完了済みのタスクをすべて削除します。')) { return }
    updateTodos(newTodos);
  };
  // ------------------------------------------------------------------------- //

  // --- TabUl Component  ---------------------------------------------------- //
  // tab 切り替えの処理は tabSettingModal Component でも使用するので関数化
  const switchTab = (newActiveIndex: number, targetKey?: string) => {
    let storageKey: string;
    if (targetKey) {
      storageKey = targetKey;
    } else {
      storageKey = `${categories[newActiveIndex].id}_${categories[newActiveIndex].title}`;
    }
    const storageData = localStorage.getItem(storageKey);
    let savedTodos;
    if (storageData === null) { console.error('local storage に category title と一致するデータが見つかりません。') }
    else                      { savedTodos = JSON.parse(storageData) }
    setActiveIndex(newActiveIndex);
    setTodos(savedTodos);
  };

  const TabUl = () => {
    const containerRef = useRef<HTMLUListElement>(null);

    // const handleUlScroll = (e: MouseEvent) => {
    //   const targetElm = e.currentTarget;
    //   const container = containerRef.current;
    //   const targetRect = targetElm.getBoundingClientRect();
    //   if (!container) { console.error('tab ul が見つかりません。'); return; }
    //   const containerRect = container.getBoundingClientRect();
    //   const scrollLeft = targetRect.left - containerRect.left;
    //   console.log(scrollLeft);

    //   setTimeout(() => {
    //     // container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    //     targetElm.scrollIntoView({block: 'start', behavior: 'smooth'});
    //     console.log('excuted');

    //   }, 1000);
    // };
    const handleTabClick = (i: number) => (e: MouseEvent) => { switchTab(i); /* handleUlScroll(e) */};
    const tabNames = categories.map(category => {return category.title});

    const TabItems = tabNames.map((tabName, i) => {

      const [isActive, setIsActive] = useState(false);
      useEffect(() => { setTimeout(() => { setIsActive(activeIndex === i); }, 0) }, [activeIndex]);

      return (
        <StyledTabLi key = { i } $isActive = { isActive } >
            <StyledBtn
              $isActive = { isActive }
              onClick   = { handleTabClick(i) }
              children  = { tabName } />
          { ( i !== categories.length - 1) && <SeparaterBetweenTabs /> } {/* 最後はいらない */}
        </StyledTabLi>
      );
    });

    return ( <StyledTabUl children = { TabItems } ref = { containerRef } /> );
  };
  // ------------------------------------------------------------------------- //

  // --- TodoList Component  ------------------------------------------------- //
  // Todo Component (li elm) からなる配列を生成
  const todoListItems = todos.map((todo) => {
    return (
      <Todo
        key           = { todo.id                  }
        todo          = { todo                     }
        onDeleteClick = { handleTodoDeleteClick    }
        onChangeClick = { handleTodoCheckBoxChange }
        renewTodo     = { handleTodoEdited         } />
    );
  });

  const TodosList = () => { return <StyledUl id="todos" children={ todoListItems } /> };
  // ------------------------------------------------------------------------- //


  // --- 作業中 : modal の開閉動作制御部分 --------------------------------------------------------------------------
  const [tabSettingModalIsOpen, setTabSettingModalIsOpen] = useState(false);
  const handleGearIconClick = () => { setTabSettingModalIsOpen(true) };
  const closeModal = () => { setTabSettingModalIsOpen(false) };
  // --- 作業中 : modal の開閉動作制御部分 --------------------------------------------------------------------------


  // Main DOM を return
  return (
    <StyledMain>

      <StyledH2>
        ToDo List
        <button onClick = { handlePurgeClick } >
          <StyledFAI icon = { faArrowsRotate } />
        </button>
      </StyledH2>

      <StyledTabNav>
        <TabUl />
        <Separater/>
        <button>
          <StyledFAI icon = { faGear } onClick  = { handleGearIconClick } />
        </button>
      </StyledTabNav>
      <TodosList />

      <Form 
        onAddSubmit = { handleAddFormSubmit } />
      <TabSettingModal
        isOpen           = { tabSettingModalIsOpen }
        modalCloser      = { closeModal }
        todosInitializer = { initializeTodos }
        tabSwitcher      = { switchTab }
        categories       = { categories }
        updateCategories = { updateCategories } />

    </StyledMain>
  );
}
// ============================================= △ Main Component (main elm) △ === //


// === ▽ style ▽ ================================================================= //
// main elm
const StyledMain = styled.main`
  width: 60%;
  margin: 3.2rem auto 0;
  @media (width < 1024px) {
    width: 90%;
  }
`;

const StyledH2 = styled.h2`
  display: flex;
  justify-content: space-between;
  border-bottom: var(--border-weight) solid #3e3e3e;
  padding: 0 .8rem .8rem;
`;

const StyledTabNav = styled.nav`
  --nav-height: 3.6rem;
  margin-top: 3.2rem;
  padding: 0 .8rem;
  display: flex;
  @media (width < 600px) {
    --nav-height: 2.4rem;
  }
`;

const StyledTabUl = styled.ul`
  display: flex;
  flex: 1;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar  {
    display: none;
  }
`;

const StyledFAI = styled(FontAwesomeIcon)` ${ getBtnStyle } `;

const StyledTabLi = styled.li<{ $isActive: boolean }>`
  display: flex;
  height: var(--nav-height);
  line-height: calc(var(--nav-height) - (.4rem + var(--border-weight)) * 2);

  width: 15rem;
  transition: flex 750ms, width 750ms;
  flex: ${props => props.$isActive ? '0 0 50rem' : '0 0 15rem'};
`;

const StyledBtn = styled.button<{ $isActive: boolean }>`
  display: block;
  width: 100%;
  padding: .4rem .8rem;

  font-size: 1.6rem;
  font-weight: normal;
  font-family: var(--eng-ff-1);
  letter-spacing: .1rem;

  color: ${ props => props.$isActive ? '#fff' : '#444' };
  background-color: ${ props => props.$isActive ? '#454e70' : '#ddd' };


  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  transition: transform 100ms;
  &:active { transform: scale(.95); }
`;

const SeparaterBetweenTabs = styled.span`
  min-width: calc(var(--border-weight) * 1.5);
  background: #fff;
  height: 75%;
  align-self: center;
  margin: 0 .8rem;
`;

const Separater = styled.span`
  width: .3rem;
  background: #bb0;
  height: var(--nav-height);
  margin: 0 1.6rem 0 3.2rem;
  @media (width < 600px) {
    width: .15rem;
  }
`;

// ul
const StyledUl = styled.ul`
  margin-top: 3.2rem;
`;
// ================================================================= △ style △ === //

export default Main;