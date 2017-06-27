import React, { Component } from 'react';
import Graph from 'react-graph-vis';
import data from './../../../hpo.json';

//console.log('data', data);

const nodes = data.slice(10, 20).map(node => {
  return {
    id: node.id[0],
    label: node.name[0]
  };
});

const graph = {
  nodes: [
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' },
    { id: 6, label: 'Node 6' }
  ],
  edges: [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 2, to: 5 }
  ]
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
