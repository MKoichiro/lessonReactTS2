/* react */
import React, { FC, useState } from 'react';
/* font awesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus  } from '@fortawesome/free-solid-svg-icons';
/* styled-components */
import styled from 'styled-components';
import { Link } from 'react-scroll';

/* from 関連の共通スタイルを定義してあるスタイル関数を import */
import {getFormStyle, getLegendStyle, getInputsWrapperStyle, getInputWrapperStyle, getLabelStyle, getInputStyle, getSmallStyle, getAddBtnStyle} from './commonStyleForm';


// === ▽ TabSettingModal Component  ▽ ============================================= //
interface CategoryTypes { id: number; title: string; }
interface modal {categories: CategoryTypes[]; updateCategories: (newCategories: CategoryTypes[]) => void;}

const TabSettingModal: FC<modal> = (props) => {

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

      <h2> Tab Setting </h2>
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

// ============================================= △ TabSettingModal Component △ === //

// === ▽ style ▽ ================================================================= //
const StyledForm          = styled.form` ${ getFormStyle } `;
const StyledLegend        = styled.legend` ${ getLegendStyle } `;
const StyledInputsWrapper = styled.div` ${ getInputsWrapperStyle } `;
const StyledInputWrapper  = styled(Link)` ${ getInputWrapperStyle } `;
const StyledLabel         = styled.label<{$optional?: boolean}>` ${ getLabelStyle } `;
const StyledInput         = styled.input<{$as?: React.ElementType}>` ${ getInputStyle } `;
const StyledAddBtn        = styled.button<{id?: string}>` ${ getAddBtnStyle } `;

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