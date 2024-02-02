/* react */
import React, { FC, useState } from 'react';
/* font awesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus  } from '@fortawesome/free-solid-svg-icons';
/* styled-components */
import styled from 'styled-components';
import { getBtnStyle } from './styleMain';

import {StyledForm, StyledLegend, StyledInputsWrapper, StyledInputWrapper, StyledLabel, StyledInput, StyledSmall, StyledAddBtn} from './Form';


// === ▽ Main Component (main elm) ▽ ============================================= //
interface CategoryTypes { id: number; title: string; }
interface modal {categories: CategoryTypes[]; updateCategories: (newCategories: CategoryTypes[]) => void;}

const TabSettingModal: FC<modal> = (props) => {

  // const [tabEditIsOpen, setTabEditIsOpen] = useState(false);
  const [newTabTitle, setNewTabTitle] = useState('');

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
    const newCategory = {id: props.categories.length, title: newTabTitle}
    const newCategories = [...props.categories, newCategory];
    props.updateCategories(newCategories);

    // local storage の tab_titles を更新
    const TAB_TITLES_L_STRAGE_KEY = 'tab_titles';
    localStorage.setItem(TAB_TITLES_L_STRAGE_KEY, JSON.stringify(newCategories));
  };
  const TabList = () => {

    const tabNames = props.categories.map(category => {return category.title});
    const TabItems = tabNames.map((tabName, i) => {
      return (
        <li
          key={i}
          children={tabName}
        />
      );
    });

    return ( <StyledTabUl children={ TabItems } /> );
  };

  return (
    <div>
    <TabList />

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
    </StyledForm>

  </div>
  );
};

// ============================================= △ Main Component (main elm) △ === //

// === ▽ style ▽ ================================================================= //
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
// ================================================================= △ style △ === //


export default TabSettingModal;