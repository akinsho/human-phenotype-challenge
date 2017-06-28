import React, { Component } from 'react';
import Graph from 'react-graph-vis';
import SearchBar from './SearchBar.jsx';
import options from './GraphConfig.js';

import { findInDoubleQuotes, removeDuplicateObj } from './../utils.js';
import {
  Container,
  Active,
  ActiveBody,
  ActiveTitle,
  Button
} from './styled.jsx';
import data from './../../../hpo.json';

const HPO = Object.values(data);

class Phenotypes extends Component {
  state = {
    input: '',
    results: [],
    selected: HPO[125],
    graph: {},
    active: {}
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
    const firstNode = this.createNode(selected, '#B2DFDB');
    const parents = firstNode.parents.map(parent =>
      this.createNode(parent, 'red')
    );
    const children = firstNode.children.map(child => this.createNode(child));
    const edges = this.createEdges(children, firstNode);
    const nodes = [...children, ...parents, firstNode];
    return { nodes, edges };
  }

  getAncestors(goid, array = []) {
    let recursiveArray = [goid, ...array];
    if (data[goid]) {
      const { parents } = data[goid].relatives;
      if (!parents.length) {
        return recursiveArray;
      } else if (parents.length > 0) {
        const [result] = parents.map(parent =>
          this.getAncestors(parent, recursiveArray)
        );
        return result;
      }
    }
  }

  renderAncestors = () => {
    const { selected: { id }, graph } = this.state;
    const ancestors = this.getAncestors(id);
    const network = ancestors.reduce(
      (acc, ancestor) => {
        const { nodes, edges } = this.combineEdgesAndNodes(ancestor);
        acc.nodes.push(...nodes);
        acc.edges.push(...edges);
        return acc;
      },
      { nodes: [], edges: [] }
    );
    const nodes = removeDuplicateObj(network.nodes, 'id');
    const edges = removeDuplicateObj(network.edges, 'to');

    this.setState({ graph: { ...graph, nodes, edges } });
  };

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
      selected: node
    });
  };

  closeActiveBox = () => {
    this.setState({ active: {} });
  };

  events = {
    select: event => {
      const { graph } = this.state;
      const { nodes: [nodes], edges } = event;
      const node = data[nodes];
      this.setState({ active: node });
    }
  };

  //Remove the first value from the data as it is hpo meta data
  names = Object.values(data).slice(1).map(({ name, id }) => ({ name, id }));

  render() {
    const { graph, input, results, active } = this.state;
    return (
      <Container>
        <SearchBar
          data={this.names}
          value={input}
          results={results}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
        <Button onClick={this.renderAncestors}>Show Ancestors</Button>
        {graph.nodes &&
          <Graph
            style={{ width: '90vw', height: '80vh' }}
            graph={graph}
            options={options}
            events={this.events}
          />}
        {active.id &&
          <Active onClick={this.closeActiveBox}>
            <ActiveTitle>{active.name}</ActiveTitle>
            <ActiveBody>{findInDoubleQuotes(active.def)}</ActiveBody>
          </Active>}
      </Container>
    );
  }
}

export default Phenotypes;
