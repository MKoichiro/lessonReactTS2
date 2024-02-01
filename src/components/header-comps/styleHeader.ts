import styled from 'styled-components';

const HeaderStyled = styled.header({
  '&': {
    height: '30rem',

    '.header-container': {
      height: '100%',
      width: '60%',
      margin: '0 auto',

      display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '1.8rem',
    },

    'h1, h2': {
      margin: '0 auto',
    },
    h1: {
      color: '#000',
    },
    h2: {
      width: 'auto',
      textAlign: 'right',
    },
  },

});




export { HeaderStyled };