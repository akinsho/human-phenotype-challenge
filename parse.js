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
    .reduce((terms, item, currentLine, array) => {
      item.split('\n').reduce((stanza, currentLine) => {
        const separatorIndex = currentLine.indexOf(':');
        const key = currentLine.slice(0, separatorIndex);
        const val = currentLine.slice(separatorIndex + 1).trim();

        if (key) {
          if (key === 'is_a') {
            stanza.relatives = { parents: [], children: [] };
            stanza.relatives.parents.push(val.split(' ')[0]);
          }
          stanza[key] = val;
          terms[stanza.id] = stanza;

          if (stanza.relatives) {
            stanza.relatives.parents.forEach(item => {
              const parent = terms[item];
              if (parent) {
                if (!parent.relatives) {
                  parent.relatives = { parents: [], children: [] };
                }
                const { children } = parent.relatives;
                if (children.indexOf(stanza.id) === -1) {
                  children.push(stanza.id);
                }
              }
            });
          }
        }
        return stanza;
      }, {});

      return terms;
    }, {});

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
  return data;
}

module.exports = fetchAndParse(oboURL);
