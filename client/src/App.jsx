import React, { Component } from 'react';
import Phenotypes from './components/Phenotypes.jsx';
import SearchBar from './components/SearchBar.jsx';
import styled, { injectGlobal } from 'styled-components';

//eslint-disable-next-line
injectGlobal`
  body, html {
    margin:0;
    padding: 0;
    height: 100%;
    width: 100%;
    font-family: Helvetica;
    box-sizing: border-box;
  }

  * {
    box-sizing: inherit
  }
`;

const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

class App extends Component {
  render() {
    return (
      <AppWrapper>
        <Phenotypes />
      </AppWrapper>
    );
  }
}

export default App;
