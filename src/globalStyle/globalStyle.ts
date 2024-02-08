import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

/* reset css などの共通スタイル */
  :root {
    --eng-ff-1:                            Arial, 'Helvetica Neue', Helvetica, sans-serif;
    --eng-ff-2: 'Times NewRoman', 'Times', Arial, 'Helvetica Neue', Helvetica, sans-serif;
    --eng-ff-3: 'Economica'              , Arial, 'Helvetica Neue', Helvetica, sans-serif;
    --border-weight: .15rem;
    @media (width < 600px) {
      --border-weight: .1rem;
    }

  }

  * { box-sizing: border-box }
    
  html { font-size: 62.5%;}

  body {
    background: #e9e9e9;
    color: #3e3e3e;
    font-family: Economica, Arial, 'Helvetica Neue', Helvetica, 'Hiragino Kaku Gothic Pro', 'ヒラギノ角ゴ Pro W3', Meiryo, メイリオ, '游ゴシック Medium', 'Yu Gothic Medium', '游ゴシック体', 'Yu Gothic', YuGothic, 'MS PGothic', Osaka, arial, sans-serif;
    /* reset */
    margin: 0; padding: 0;
  }
  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  h1, h2,
  h3, h4,
  h5, h6,
  p,
  a, button,
  ol, ul, li { padding: 0; margin: 0; }

  button {
    color: #444;
    background: none;
    border: none;
    font-size: inherit;
    cursor: pointer;
    font-family: Economica, Arial, 'Helvetica Neue';
    font-weight: 700;
    user-select: none;
    touch-action: manipulation; /* Modern browsers */
    -webkit-tap-highlight-color: rgba(0,0,0,0); /* iOS Safari */
    -webkit-touch-callout: none; /* iOS Safari */
  }
  a {
    color: inherit;
    text-decoration: none;
  }

  li {
    list-style-type: none;
  }

  form {
    font-size: inherit;
  }
  label {
    cursor: pointer;
  }
  input {
    margin: 0;
    padding: 0;
  }
  textarea {
    resize: none;
  }



  /* font-size */
  h1 { font-size: 3.2rem }
  h2 { font-size: 2.4rem }
  h3 { font-size: 1.8rem }
  h4 { font-size: 1.6rem }
  h5 { font-size: 1.2rem }
  h6 { font-size: 1.0rem }
  p,
  a, button, label { font-size: 1.6rem }



  @media (max-width: 1024px) {
    html { font-size: 50% }
  }
  @media (max-width: 600px) {
    html { font-size: 35% }
  }

`;



export default GlobalStyle;