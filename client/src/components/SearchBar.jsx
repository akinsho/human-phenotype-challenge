import React, { Component } from 'react';
import styled from 'styled-components';
import data from './../../../hpo.json';

const Nav = styled.nav`
  width: 100%;
  height: 20%;
  background-color:#2196F3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;
`;

class SearchBar extends Component {
  state = {
    selected: ''
  };

  handleChange = ({ target: { value } }) => {
    this.setState({
      selected: value
    });
  };
  render() {
    return (server/
      <Nav>
        <select onChange={this.handleChange}>
          {this.props.data.map((name, index) => (
            <option key={index} value={name}>{name}</option>
          ))}
        </select>
        <input />
      </Nav>
    );
  }
}

export default SearchBar;
