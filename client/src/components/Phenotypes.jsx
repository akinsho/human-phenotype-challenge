import React, { Component } from 'react';
import Graph from 'react-graph-vis';
import styled from 'styled-components';
import SearchBar from './SearchBar.jsx';

import data from './../../../hpo.json';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const hpo = Object.values(data);

const createNode = node => {
  if (typeof node === 'string') {
    const childNode = data[node];
    const { id, name, relatives: { children } } = childNode;
    return {
      id,
      label: name,
      children
    };
  }
  const { id, name, relatives: { children } } = node;
  return {
    id,
    label: name,
    children
  };
};

const createEdges = (children, firstNode) =>
  children.map(child => ({
    from: firstNode.id,
    to: child.id
  }));

const combineEdgesAndNodes = () => {
  const firstNode = createNode(hpo[30]);
  const children = firstNode.children.map(child => createNode(child));
  const edges = createEdges(children, firstNode);
  return {
    firstNode,
    children,
    edges
  };
};

const { firstNode, children, edges } = combineEdgesAndNodes();

const graph = {
  nodes: [firstNode, ...children],
  edges
};

const options = {
  layout: {
    hierarchical: true
  },
  edges: {
    color: '#00000'
  }
};

const events = {
  select: event => {
    const { nodes, edges } = event;
  }
};

const names = Object.values(data)
  .map(phenotype => {
    return phenotype.name;
  })
  .slice(100, 150);

class Phenotypes extends Component {
  render() {
    return (
      <Container>
        <SearchBar data={names} />
        <Graph graph={graph} options={options} events={events} />;
      </Container>
    );
  }
}

export default Phenotypes;
