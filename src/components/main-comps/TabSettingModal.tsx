/* categories の追加・削除・並び替えを設定するモーダル */

/* react */
import React, { FC, useState, useRef } from 'react';
/* font awesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisVertical, faTrashCan, faAngleUp, faAnglesUp, faAngleDown, faAnglesDown, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
/* styled-components */
import styled from 'styled-components';

/* from 関連の共通スタイルを定義してあるスタイル関数を import */
import * as FormStyles from './commonStyleForm';
import { getBtnStyle } from './styleMain';

// === ▽ TabSettingModal Component ▽ ============================================== //
interface TodoTypes { id: number; detail?: string; title: string; isCompleted: boolean; }
interface CategoryTypes {
  id: number;
  title: string;
}
interface modal {
  isOpen: boolean;
  modalCloser: () => void;
  todosInitializer: (storageKey: string) => TodoTypes[];
  tabSwitcher: (newActiveIndex: number, storageKey: string) => void;
  categories: CategoryTypes[];
  updateCategories: (newCategories: CategoryTypes[]) => void;
}

const TabSettingModal: FC<modal> = (props) => {

  const [newTabTitle, setNewTabTitle] = useState('');
  const [showNotion, setShowNotion]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- input のハンドラ --------------------------------------------------- //
  // フォームの入力に合わせて newTabTitle を更新
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setNewTabTitle(e.currentTarget.value); }
  // フォーカスが外れたら入力エラーを非表示に
  const handleInputBlur = () => { setShowNotion(false); }
  // --------------------------------------------------- input のハンドラ --- //

  // --- sort 関連ボタンのハンドラ ------------------------------------------ //
  // idを振りなおす共通の処理
  const renumberCategories = (categories: CategoryTypes[]) => {
    const renumberedCategories = categories.map((category, i) => {
      return { ...category, id: i }
    });
    return renumberedCategories;
  };

  // Delete Btn(ゴミ箱アイコン):              カテゴリーごとtodoリストを削除
  const handleDeleteBtnClick = (index: number) => {
    const TODO_L_STRAGE_KEY = props.categories[index].title;
    if (!confirm('本当に削除しますか？\n削除すると復元はできません。')) { return }
    const removedCategories = [...props.categories].filter((_, i) => i !== index);
    const renumberedCategories = renumberCategories(removedCategories);
    props.updateCategories(renumberedCategories);
    localStorage.removeItem(TODO_L_STRAGE_KEY);
  };
  // To Top Btn("<<") / To Bottom Btn(">>"):  1番上、または1番下に移動
  const handleToTopOrBottomBtnClick = (index: number, which: 't' | 'b') => {
    const categoryTitle = props.categories[index].title;
    const rearrangedCategories = [...props.categories];
    const trimedCategory = rearrangedCategories.splice(index, 1);
    if      (which === 't') {
      rearrangedCategories.unshift(...trimedCategory);
      props.tabSwitcher(0, categoryTitle);
    }
    else if (which === 'b') {
      rearrangedCategories.push(...trimedCategory);
      props.tabSwitcher(props.categories.length - 1, categoryTitle);
    }
    const renumberedCategories = renumberCategories(rearrangedCategories);
    props.updateCategories(renumberedCategories);
  };
  // Up Btn("<") / Down Btn(">"):             1つ上、または1つ下に移動
  const handleUpOrDownBtnClick = (index: number, which: 'u' | 'd') => {
    const rearrangedCategories = [...props.categories];
    if      (which === 'u') { rearrangedCategories.splice(index - 1, 0, ...rearrangedCategories.splice(index, 1)) }
    else if (which === 'd') { rearrangedCategories.splice(index + 1, 0, ...rearrangedCategories.splice(index, 1)) }
    const renumberedCategories = renumberCategories(rearrangedCategories);
    props.updateCategories(renumberedCategories);
  };
  // ------------------------------------------ sort 関連ボタンのハンドラ --- //

  // --- add Btn のハンドラ ------------------------------------------------- //
  const handleAddBtnClick = () => {
    // フォームをクリア
    setNewTabTitle('');

    if (inputRef.current) { inputRef.current.focus() }

    // 入力がスペースのみや空欄の場合は入力エラーを表示するだけで抜ける
    const titleTrimed: string = newTabTitle.replaceAll(/ |　/g, '');
    if (!titleTrimed) { setShowNotion(true); return }

    // 新しい newTabTitle を key として、todos を格納するための空の配列を新規登録登録
    const TODO_L_STRAGE_KEY = newTabTitle;
    props.todosInitializer(TODO_L_STRAGE_KEY);

    // categories 配列を newTabTitle を含めたものに更新
    const newCategory = {id: props.categories.length, title: newTabTitle}
    const newCategories = [...props.categories, newCategory];
    props.updateCategories(newCategories);

    // 新規作成した category のタブに切り替え
    props.tabSwitcher(props.categories.length, newTabTitle);
  };
  // ------------------------------------------------- add Btn のハンドラ --- //

  // --- TabItems (TabListContainer に渡す JSX 配列) を用意 ----------------- //
  const tabNames = props.categories.map(category => { return category.title });
  const TabItems = tabNames.map((tabName, i) => {
    return (
      <StyledLi key={i}>

        <TabTitleContainer>
          <button>
            <StyledFAI
              icon = { faEllipsisVertical } />
          </button>
          <p children = { tabName } />
        </TabTitleContainer>

        <SortBtnsContainer className="sort-btns-container" >
          {/* To Top Btn */}
          <button onClick = { () => handleToTopOrBottomBtnClick(i, 't') } >
            <StyledFAI icon = { faAnglesUp } />
          </button>

          {/* To Bottom Btn */}
          <button onClick = { () => handleToTopOrBottomBtnClick(i, 'b') } >
            <StyledFAI icon = { faAnglesDown } />
          </button>

          {/* Up Btn */}
          <button onClick = { () => handleUpOrDownBtnClick(i, 'u') } >
            <StyledFAI icon = { faAngleUp } />
          </button>

          {/* Down Btn */}
          <button onClick = { () => handleUpOrDownBtnClick(i, 'd') } >
            <StyledFAI icon = { faAngleDown } />
          </button>

          {props.categories.length !== 1 && (
            <>
              <Separater />

              <DeleteBtn
                $isLastOne={props.categories.length === 1}
                onClick={() => handleDeleteBtnClick(i)} >
                <StyledFAI icon={faTrashCan} />
              </DeleteBtn>
            </>
          )}


        </SortBtnsContainer>

      </StyledLi>
    );
  });
  // ---------------------------------------------------- TabItems を用意 --- //

  return (
    <Mask
      $isOpen = { props.isOpen }
      onClick = { props.modalCloser }
    >

      <StyledDiv
        onClick = { (e) => { e.stopPropagation() } } >

        <StyledH2>
          Category Setting
          <button onClick = { props.modalCloser } >
            <StyledFAI icon = { faRectangleXmark } />
          </button>
        </StyledH2>

        <TabListContainer children = { TabItems } />

        <StyledForm onSubmit = { (e) => { e.preventDefault() } }>
          <StyledLegend children = "CREATE NEW LIST" />

          <StyledInputsWrapper>
            <StyledInputWrapper>

              <StyledLabel
                $optional = { false }
                htmlFor = "new-tab-title"
              >
                <span></span>Category Name:
              </StyledLabel>
              <StyledInput
                required
                id          = "new-tab-title"
                type        = "text"
                placeholder = "例: 買い物用"
                value       = { newTabTitle }
                ref         = { inputRef }
                onBlur      = { handleInputBlur }
                onChange    = { handleTitleChange } />
              <StyledSmall
                $showNotion = { showNotion }
                children    =  "※ タイトルは必須です。" />

            </StyledInputWrapper>
          </StyledInputsWrapper>
          
          <StyledAddBtn
            onClick = { handleAddBtnClick }
            type    = "button"
            id      = "add-btn"
          >
            <div>
              <div> <FontAwesomeIcon icon = { faPlus } /> </div>
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
  z-index: 1;
  inset: 0;
  height: 100lvh;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: ${ props => props.$isOpen ? 'flex': 'none' };
  justify-content: center;
  align-items: center;
  /* cursor: pointer; */
`;

const StyledDiv = styled.div`
  position: absolute;
  z-index: 2;
  width: 50%;
  padding: 1.6rem;
  background: #e9e9e9;
  border-radius: .8rem;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  @media (width < 1024px) {
    width: 75%;
  }
  @media (width < 600px) {
    width: 85%;
  }
`;

const StyledH2 = styled.h2`
  display: flex;
  justify-content: space-between;
`;

const TabListContainer = styled.ul`
  font-size: 1.6rem;
  max-height: 50vh;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  
  /* リスト部分にスクロールの余地があることを示す影:
     スクロール位置が上端の時、上の影を隠す。(下端も同様) */
  background: linear-gradient(to Bottom, #e9e9e9 30%, transparent),         /* 上の影の隠し */
              linear-gradient(to Bottom, transparent, #e9e9e9 70%),         /* 下の影の隠し */
              linear-gradient(to Bottom, rgba(0 0 0 / .15) 10%, transparent), /* 上の影 */
              linear-gradient(to Bottom, transparent, rgba(0 0 0 / .15) 90%); /* 下の影 */
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-position: 0 0, 0 100%, 0 0, 0 100%;
  background-repeat: no-repeat;
  background-attachment: local, local, scroll, scroll;
`;

const StyledLi = styled.li`
  display: flex;
  align-items: center;
  font-family: var(--eng-ff-1);
  padding: .8rem 0;

  &:nth-child(odd) {
    background: rgba(0 0 0 / .04);
    .sort-btns-container {
      /* border-bottom: .15rem solid #990; */
    }
  }

  p {
    font-size: 1.4rem;
    line-height: 2.4rem;
    font-weight: bold;
  }
  @media (width < 600px) {
    flex-wrap: wrap;
  }
`;

const TabTitleContainer = styled.div`
  display: flex;
  align-items: center;
  @media (width < 600px) {
    width: 100%;
  }
`;

const StyledFAI = styled(FontAwesomeIcon)` ${ getBtnStyle } `;

const SortBtnsContainer = styled.div`
  margin-left: auto;
  margin-right: 1.6rem;
  min-width: 30%;
  display: flex;
  height: 3.2rem;
  align-items: center;
  justify-content: space-between;
  border-radius: .6rem;
  @media (width < 600px) {
    min-width: 50%;
    height: 2.4rem;
  }
`;

const Separater = styled.span`
  width: calc(var(--border-weight) * 1.5);
  background-color: #bb0;
  height: 2.4rem;
  margin: 0 .4rem;
  @media (width < 600px) {
    height: 2rem;
  }
`;

const DeleteBtn = styled.button<{ $isLastOne: boolean }>`
  display: ${ props => props.$isLastOne ? 'none' : 'block' };
`;

const StyledForm = styled.form`
  ${ FormStyles.getFormStyle }
  gap: 1.6rem;
`;

const StyledLegend = styled.legend`
  ${ FormStyles.getLegendStyle }
  padding-top: 3.2rem;
  border-top: var(--border-weight) dashed #444;
`;

const StyledInputsWrapper = styled.div` ${ FormStyles.getInputsWrapperStyle } `;

const StyledInputWrapper = styled.div` ${ FormStyles.getInputWrapperStyle } `;

const StyledLabel = styled.label<{ $optional?: boolean }>` ${ FormStyles.getLabelStyle } `;

const StyledInput = styled.input<{ $as?: React.ElementType }>` ${ FormStyles.getInputStyle } `;

const StyledSmall = styled.small<{$showNotion: boolean}>` ${ FormStyles.getSmallStyle } `;

const StyledAddBtn = styled.button<{ id?: string }>` ${ FormStyles.getAddBtnStyle } `;
// ================================================================= △ style △ === //

export default TabSettingModal;