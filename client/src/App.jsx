import React, { Component } from 'react';
import Phenotypes from './components/Phenotypes.jsx';
import SearchBar from './components/SearchBar.jsx';
import { injectGlobal } from 'styled-components';

//eslint-disable-next-line
injectGlobal`
  body, html {
    margin:0;
    padding: 0
}
`;

class App extends Component {
  render() {
    return (
      <div>
        <Phenotypes />
      </div>
    );
  }
}

export default App;
