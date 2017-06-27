import React, { Component } from 'react';
import styled from 'styled-components';
import data from './../../../hpo.json';

const Nav = styled.nav`
  width: 100%;
  height: 5%;
  background-color:#2196F3;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1em;
`;

function SearchBar({ data, handleChange, selected }) {
  return (
    <Nav>
      <select onChange={handleChange}>
        {data.map(({ id, name }) => (
          <option key={id} value={selected}>
            {name}
          </option>
        ))}
      </select>
      <input />
    </Nav>
  );
}

export default SearchBar;
