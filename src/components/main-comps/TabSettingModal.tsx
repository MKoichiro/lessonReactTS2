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
interface modal {
  isOpen: boolean;
  closer: () => void;
  categories: CategoryTypes[];
  updateCategories: (newCategories: CategoryTypes[]) => void;
}

const TabSettingModal: FC<modal> = (props) => {

  const [newTabTitle, setNewTabTitle] = useState('');

  // sort関連ボタンのハンドラ
  // idを振りなおす共通の処理
  const renumberCategories = (categories: CategoryTypes[]) => {
    const renumberedCategories = categories.map((category, i) => {
      return { ...category, id: i }
    });
    return renumberedCategories;
  };
  // DeleteBtn: カテゴリーごとtodoリストを削除
  const handleDeleteBtnClick = (index: number) => {
    if (!confirm('本当に削除しますか？\n削除すると復元はできません。')) { return }
    const removedCategories = [...props.categories].filter((_, i) => i !== index);
    const renumberedCategories = renumberCategories(removedCategories);
    props.updateCategories(renumberedCategories);
  };
  // ToTopBtn / ToBottomBtn: 1番上、または1番下に移動
  const handleToTopOrBottomBtnClick = (index: number, which: 't' | 'b') => {
    const rearrangedCategories = [...props.categories];
    const trimedCategory = rearrangedCategories.splice(index, 1);
    if      (which === 't') { rearrangedCategories.unshift(...trimedCategory) }
    else if (which === 'b') { rearrangedCategories.push(...trimedCategory)    }
    const renumberedCategories = renumberCategories(rearrangedCategories);
    props.updateCategories(renumberedCategories);
  };
  // UpBtn / DownBtn: 1つ上、または1つ下に移動
  const handleUpOrDownBtnClick = (index: number, which: 'u' | 'd') => {
    const rearrangedCategories = [...props.categories];
    if      (which === 'u') { rearrangedCategories.splice(index - 1, 0, ...rearrangedCategories.splice(index, 1)) }
    else if (which === 'd') { rearrangedCategories.splice(index + 1, 0, ...rearrangedCategories.splice(index, 1)) }
    const renumberedCategories = renumberCategories(rearrangedCategories);
    props.updateCategories(renumberedCategories);
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
              onClick = { () => handleDeleteBtnClick(i) } />
          </TabTitleContainer>
          <SortBtnsContainer>
            <ToTopBtn
              icon    = { faAnglesUp }
              onClick = { () => handleToTopOrBottomBtnClick(i, 't') } />
            <ToBottomBtn
              icon    = { faAnglesDown }
              onClick = { () => handleToTopOrBottomBtnClick(i, 'b') }/>
            <UpBtn
              icon    = { faAngleUp }
              onClick = { () => handleUpOrDownBtnClick(i, 'u') } />
            <DownBtn
              icon    = { faAngleDown }
              onClick = { () => handleUpOrDownBtnClick(i, 'd') } />
          </SortBtnsContainer>
        </StyledLi>
      );
    });
    return (
      <StyledTabUl>
          { TabItems }
      </StyledTabUl>
    );
  };


  return (
    <Mask
      $isOpen={props.isOpen}
      onClick={props.closer}
    >
        <StyledDiv>

<StyledH2> Tab Setting </StyledH2>
<TabList />

<StyledForm onSubmit={(e) => { e.preventDefault() }}>
  <StyledLegend
    id="test"
    children="CREATE NEW LIST" />
  <StyledInputsWrapper>
    <StyledInputWrapper
      to="test"
      smooth={true} >
      <StyledLabel
        $optional={false}
        htmlFor="new-tab-title"
      >
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


    </Mask>
  );
};
// ============================================= △ TabSettingModal Component △ === //


// === ▽ style ▽ ================================================================= //
const Mask = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0; 
  backdrop-filter: blur(4px);
  display: ${ props => props.$isOpen ? 'flex': 'none' };
  justify-content: center;
  align-items: center;
`;
const StyledDiv = styled.div`
  position: absolute;
  width: 50%;
  padding: 1.6rem;
  background: #e9e9e9;
  border-radius: .8rem;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
`;

const StyledH2 = styled.h2`
  /* color: red; */
`;

const StyledTabUl = styled.ul`
  font-size: 1.6rem;
  max-height: 50vh;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  
  /* リスト部分にスクロールの余地があることを示す影:
     スクロール位置が上端の時、上の影を隠す。(下端も同様) */
  background: linear-gradient(to Bottom, #e9e9e9 30%, transparent),                /* 上の影の隠し */
              linear-gradient(to Bottom, transparent, #e9e9e9 70%),         /* 下の影の隠し */
              linear-gradient(to Bottom, rgba(0 0 0 / .15) 10%, transparent),        /* 上の影 */
              linear-gradient(to Bottom, transparent, rgba(0 0 0 / .15) 90%); /* 下の影 */

  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-position: 0 0, 0 100%, 0 0, 0 100%;
  background-repeat: no-repeat;
  background-attachment: local, local, scroll, scroll;
`;
const StyledLi = styled.li`
  &:nth-child(even) { background: rgba(0 0 0 / .04) }

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
`;

const DeleteBtn = styled(FontAwesomeIcon)`
  ${ getBtnStyle }
  margin-left: auto;
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