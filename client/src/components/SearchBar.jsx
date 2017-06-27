import React, { Component } from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  width: 100%;
  height: 10%;
  color: palevioletred;
`;

class SearchBar extends Component {
  state = {
    selected: ''
  };

  render() {
    return <Nav><input /></Nav>;
  }
}

export default SearchBar;
