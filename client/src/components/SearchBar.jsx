import React, { Component } from 'react';
import styled from 'styled-components';
import data from './../../../hpo.json';

const Nav = styled.nav`
  width: 100%;
  height: 10%;
  background-color:#2196F3;
  display: flex;
  align-items: center;
  justify-content: center;
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
