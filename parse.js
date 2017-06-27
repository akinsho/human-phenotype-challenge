const fs = require('fs');
const fetch = require('isomorphic-fetch');
const request = require('request');

const oboURL =
  'https://raw.githubusercontent.com/obophenotype/human-phenotype-ontology/master/hp.obo';

const parseStanza = stanzaText =>
  //parse obo data as text split the string on term and type def
  stanzaText
    .trim()
    .split(/\[Term\]|\[TypeDef\]/)
    .map((item, currentLine, array) =>
      item.split('\n').reduce((stanza, currentLine) => {
        const separatorIndex = currentLine.indexOf(':');
        const key = currentLine.slice(0, separatorIndex);
        const val = currentLine.slice(separatorIndex + 1).trim();
        if (key) {
          if (key === 'is_a') {
            //Take the id i.e HP number to make looking up parents clearer
            stanza.parents = val.split(' ')[0];
          }
          if (!Array.isArray(stanza[key])) {
            stanza[key] = [];
            stanza[key].push(val);
          } else {
            stanza[key] = val;
          }
        }
        return stanza;
      }, {})
    );

function addChildren(stanzas) {
  return stanzas.map(stanza => {
    if (stanza.parents) {
      const parentStanza = stanzas.find(item => {
        console.log('item', item);
        return item['id'] === stanza.parents;
      });
      console.log('parent', parentStanza);
      if (parentStanza) {
        parentStanza.children = [];
        parentStanza.children.push(stanza.id);
      }
    }
    return stanza;
  });
}

async function fetchAndParse(url) {
  const data = await fetch(url)
    .then(res => {
      if (res.ok) {
        return res.text();
      } else {
        throw new Error('Could not fetch data');
      }
    })
    .then(text => {
      if (!fs.existsSync('HPO.obo')) {
        fs.writeFileSync('HPO.obo', text);
      }
      return parseStanza(text);
    });
  //return data and write or write the file
  fs.writeFileSync('hpo.json', JSON.stringify(data, null, 2));
  const lookup = data.reduce((terms, item) => {
    terms[item.id] = item;
    return terms;
  }, {});
  console.log('updatedData', addChildren(data));
  //console.log('looku', lookup);
  return data;
}

module.exports = fetchAndParse(oboURL);
