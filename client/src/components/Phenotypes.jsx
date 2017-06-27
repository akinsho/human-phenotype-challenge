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

const StyledGraph = styled(Graph)`
  width: 100%;
  height: 80%;
`;

const HPO = Object.values(data);

const options = {
  layout: {
    randomSeed: undefined,
    hierarchical: {
      enabled: false,
      nodeSpacing: 200
    }
  },
  edges: {
    color: '#00000'
  },
  nodes: {
    color: '#2196F3',
    shape: 'box'
  }
};

const events = {
  select: event => {
    const { nodes, edges } = event;
  }
};

class Phenotypes extends Component {
  state = {
    selected: '',
    graph: {}
  };

  componentDidMount() {
    const { firstNode, children, edges } = this.combineEdgesAndNodes();
    this.setState({
      graph: {
        nodes: [firstNode, ...children],
        edges
      }
    });
  }

  createNode = node => {
    let id, name, relatives, children;
    if (typeof node === 'string') {
      const childNode = data[node];
      ({ id, name, relatives: { children } } = childNode);
    } else {
      ({ id, name, relatives: { children } } = node);
    }
    return {
      id,
      label: name,
      children
    };
  };

  createEdges = (children, firstNode) =>
    children.map(child => {
      return {
        from: firstNode.id,
        to: child.id
      };
    });

  combineEdgesAndNodes = (selected = HPO[30]) => {
    console.log('selected', selected);
    const firstNode = this.createNode(selected);
    const children = firstNode.children.map(child => this.createNode(child));
    const edges = this.createEdges(children, firstNode);
    return {
      firstNode,
      children,
      edges
    };
  };

  handleChange = ({ target: { value, id } }) => {
    const { graph } = this.state;
    this.setState({ selected: value });
    const node = HPO.find(phenotype => phenotype.name === value);
    const { firstNode, children, edges } = this.combineEdgesAndNodes(node);
    this.setState({
      graph: {
        ...graph,
        nodes: [firstNode, ...children],
        edges
      }
    });
  };

  names = Object.values(data)
    .map(({ name, id }) => ({ name, id }))
    .slice(100, 150);

  render() {
    const { graph, selected } = this.state;
    return (
      <Container>
        <SearchBar
          data={this.names}
          value={selected}
          handleChange={this.handleChange}
        />
        {graph.nodes &&
          <StyledGraph graph={graph} options={options} events={events} />}
      </Container>
    );
  }
}

export default Phenotypes;
