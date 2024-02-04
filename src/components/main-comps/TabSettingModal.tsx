/* react */
import React, { FC, useState } from 'react';
/* font awesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisVertical, faTrashCan, faAngleUp, faAnglesUp, faAngleDown, faAnglesDown } from '@fortawesome/free-solid-svg-icons';
/* styled-components */
import styled from 'styled-components';
import { Link } from 'react-scroll';

/* from 関連の共通スタイルを定義してあるスタイル関数を import */
import * as FormStyles from './commonStyleForm';
import { getBtnStyle } from './styleMain';



// === ▽ TabSettingModal Component  ▽ ============================================= //
interface CategoryTypes { id: number; title: string; }
interface modal {categories: CategoryTypes[]; updateCategories: (newCategories: CategoryTypes[]) => void;}

const TabSettingModal: FC<modal> = (props) => {

  const [newTabTitle, setNewTabTitle] = useState('');

  // sort関連ボタンのハンドラ
  const handleDeleteBtnClick = () => {
    console.log('DELETE btn clicked');
    console.log(props.categories)
  };
  // ToTopBtn: 1番上に移動
  const handleToTopBtnClick = () => {
    console.log('TO TOP btn clicked');
  };
  const handleToBottomBtnClick = () => {
    console.log('TO BOTTOM btn clicked');
  };
  const handleUpBtnClick = () => {
    console.log('UP btn clicked');
  };
  const handleDownBtnClick = () => {
    console.log('DOWN btn clicked')
  };

  // フォームの入力に合わせて newTabTitle を更新
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setNewTabTitle(e.currentTarget.value); }

  // category の追加
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
    const tabNames = props.categories.map(category => {
      return category.title
    });
    const TabItems = tabNames.map((tabName, i) => {
      return (
        <StyledLi key={i}>
          <TabTitleContainer>
            <GripBtn
              icon = { faEllipsisVertical } />
            <p children={ tabName }/>
            <DeleteBtn
              icon    = {faTrashCan}
              onClick = { handleDeleteBtnClick } />
          </TabTitleContainer>
          <SortBtnsContainer>
            <ToTopBtn
              icon    = { faAnglesUp }
              onClick = { handleToTopBtnClick } />
            <ToBottomBtn
              icon    = { faAnglesDown }
              onClick = { handleToBottomBtnClick }/>
            <UpBtn
              icon    = { faAngleUp }
              onClick = { handleUpBtnClick } />
            <DownBtn
              icon    = { faAngleDown }
              onClick = { handleDownBtnClick } />
          </SortBtnsContainer>
        </StyledLi>
      );
    });
    return ( <StyledTabUl children = { TabItems } /> );
  };


  return (
    <>
      <Mask/>

      <StyledDiv>

      <StyledH2> Tab Setting </StyledH2>
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

      </StyledDiv>
    </>

  );
};

// ============================================= △ TabSettingModal Component △ === //

// === ▽ style ▽ ================================================================= //

const Mask = styled.div`
  /* position: fixed;
  inset: 0;  */
  backdrop-filter: blur(4px);
  display: none;
`;
const StyledDiv = styled.div`
  /* position: fixed;
  top: 6.4rem; z-index: 3; */
  background: pink;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const StyledH2 = styled.h2`
  /* color: red; */
`;

const StyledTabUl = styled.ul`
  font-size: 1.6rem;
`;
const StyledLi = styled.li`
  /* outline: .2rem solid #000; */
  &:nth-child(even) { background: #e0e0e0 }

  & + li { margin-top: 1.6rem; }
  line-height: 3.2rem;
  p {
    height: 3.2rem;
    font-size: 1.8rem;
    font-weight: bold;
  }
`;

const TabTitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const GripBtn = styled(FontAwesomeIcon)`
  ${ getBtnStyle }
  height: 1.6rem;
  padding: .8rem .4rem;
  cursor: pointer;
`

const DeleteBtn = styled(FontAwesomeIcon)`
  ${ getBtnStyle }
  margin-left: auto;
  /* background: red; */

  height: 1.6rem;
  padding: .8rem .4rem;
  cursor: pointer;
`;

const SortBtnsContainer = styled.div`
  display: flex;
  height: 4rem;
  align-items: center;
  justify-content: flex-end;
  gap: 3.2rem;
`;


const ToTopBtn = styled(FontAwesomeIcon)`
  ${ getBtnStyle }
  height: 1.6rem;
  padding: .8rem .4rem;
  cursor: pointer;
`;
const ToBottomBtn = styled(FontAwesomeIcon)`
  ${ getBtnStyle }
  height: 1.6rem;
  padding: .8rem .4rem;
  cursor: pointer;
`;
const UpBtn = styled(FontAwesomeIcon)`
  ${ getBtnStyle }
  height: 1.6rem;
  padding: .8rem .4rem;
  cursor: pointer;
`;
const DownBtn = styled(FontAwesomeIcon)`
  ${ getBtnStyle }
  height: 1.6rem;
  padding: .8rem .4rem;
  cursor: pointer;
`;

const StyledForm = styled.form`
  ${ FormStyles.getFormStyle }
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


// ================================================================= △ style △ === //

export default TabSettingModal;