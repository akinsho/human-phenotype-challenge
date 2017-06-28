import React, { Component } from 'react';
import Graph from 'react-graph-vis';
import styled from 'styled-components';
import SearchBar from './SearchBar.jsx';

import data from './../../../hpo.json';

const Container = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HPO = Object.values(data);

const options = {
  layout: {
    randomSeed: undefined,
    hierarchical: {
      enabled: false,
      nodeSpacing: 300
    }
  },
  edges: {
    color: '#00000'
  },
  nodes: {
    color: '#2196F3',
    shape: 'box',
    font: '14px Helvetica black'
  }
};

const events = {
  select: event => {
    const { nodes, edges } = event;
  }
};

class Phenotypes extends Component {
  state = {
    input: '',
    results: [],
    selected: HPO[125],
    graph: {}
  };

  componentDidMount() {
    const { nodes, edges } = this.combineEdgesAndNodes();
    this.setState({ graph: { nodes, edges } });
  }

  /**
   * Takes a phenotype object or id and returns a graph node object
   *
   * @param {String or Object} node A phenotype object or the id of one
   * @returns {Object} A graph node with a label, id and its children
   */
  createNode = (node, color) => {
    let id, label, relatives, children, parents;
    if (typeof node === 'string') {
      const childNode = data[node];
      ({ id, name: label, relatives: { children, parents } } = childNode);
    } else {
      ({ id, name: label, relatives: { children, parents } } = node);
    }
    return { id, label, children, parents, color };
  };

  createEdges = (children, firstNode) => {
    const parentEdges = firstNode.parents.map(parent => ({
      from: parent, // Order of to and from is reversed for parents
      to: firstNode.id
    }));
    const childEdges = children.map(child => ({
      from: firstNode.id,
      to: child.id
    }));
    return [...childEdges, ...parentEdges];
  };

  combineEdgesAndNodes(selected = this.state.selected) {
    //console.log('selected', selected);
    const firstNode = this.createNode(selected, '#B2DFDB');
    const children = firstNode.children.map(child => this.createNode(child));
    const edges = this.createEdges(children, firstNode);
    const nodes = [...children, firstNode];
    return { nodes, edges };
  }

  handleChange = ({ target: { value, id } }) => {
    const results = this.names.filter(({ name }) => name.includes(value));
    this.setState({ input: value, results });
  };

  handleSubmit = ({ target: { value }, currentTarget: { textContent } }) => {
    const { graph } = this.state;
    const node = HPO.find(
      phenotype => phenotype.name === (value || textContent)
    );
    const { nodes, edges } = this.combineEdgesAndNodes(node);
    this.setState({
      graph: { ...graph, nodes, edges },
      input: '',
      selected: value
    });
  };

  //Remove the first value from the data as it hpo meta data
  names = Object.values(data).slice(1).map(({ name, id }) => ({ name, id }));

  render() {
    const { graph, input, results } = this.state;
    return (
      <Container>
        <SearchBar
          data={this.names}
          value={input}
          results={results}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
        {graph.nodes &&
          <Graph
            style={{ width: '70vw', height: '70vh' }}
            graph={graph}
            options={options}
            events={events}
          />}
      </Container>
    );
  }
}

export default Phenotypes;
