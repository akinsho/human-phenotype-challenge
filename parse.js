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

function addChildren(stanzas, lookup) {
  return stanzas.map(stanza => {
    if (stanza.parents) {
      const parent = lookup[stanza.id];
      if (parent) {
        parent.children = [];
        parent.children.push(stanza.id[0]);
      }
    }
    return lookup;
  });
}

async function fetchAndParse(url) {
  const data = await fetch(url)
    .then(res => res.text())
    .then(text => {
      if (!fs.existsSync('HPO.obo')) {
        fs.writeFileSync('HPO.obo', text);
      }
      return parseStanza(text);
    })
    .catch(e => new Error(e.message));
  //return data and write the file
  fs.writeFileSync('hpo.json', JSON.stringify(data, null, 2));
  const lookup = data.reduce((terms, item) => {
    terms[item.id] = item;
    return terms;
  }, {});
  console.log(addChildren(data, lookup));
  return data;
}

module.exports = fetchAndParse(oboURL);
