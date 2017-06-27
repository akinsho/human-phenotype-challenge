import React, { Component } from 'react';
import Graph from 'react-graph-vis';
import data from './../../../hpo.json';

const hpoArray = Object.values(data);

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

const firstNode = createNode(hpoArray[30]);

const children = firstNode.children.map(child => createNode(child));

const createEdges = children => {
  return children.map(child => {
    return {
      from: firstNode.id,
      to: child.id
    };
  });
};

const edges = createEdges(children);

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

class Phenotypes extends Component {
  render() {
    return <Graph graph={graph} options={options} events={events} />;
  }
}

export default Phenotypes;
