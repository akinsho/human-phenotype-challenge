import React, { Component } from 'react';
import Phenotypes from './components/Phenotypes.jsx';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Phenotypes />
      </div>
    );
  }
}

export default App;
