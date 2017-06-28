//Config Object for the Graph component
const options = {
  layout: {
    randomSeed: undefined,
    hierarchical: {
      enabled: false,
      nodeSpacing: 300
    }
  },
  edges: {
    color: '#00000',
    smooth: {
      enabled: true
    }
  },
  nodes: {
    color: '#2196F3',
    shape: 'box',
    shapeProperties: {
      borderRadius: 3
    },
    shadow: {
      enabled: true
    },
    mass: 4,
    margin: 12,
    font: '14px Helvetica black'
  }
};

export default options;
