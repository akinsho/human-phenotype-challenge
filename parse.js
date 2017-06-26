const fs = require('fs');
const fetch = require('isomorphic-fetch');
const request = require('request');

const oboURL =
  'https://raw.githubusercontent.com/obophenotype/human-phenotype-ontology/master/hp.obo';

const parseStanza = stanzaText =>
  stanzaText.trim().split(/\[Term\]|\[TypeDef\]/).map((item, currentLine) => {
    return item.split('\n').reduce((stanza, currentLine) => {
      const separatorIndex = currentLine.indexOf(':');
      const key = currentLine.slice(0, separatorIndex);
      const val = currentLine.slice(separatorIndex + 1).trim();
      if (key) {
        if (!Array.isArray(stanza[key])) {
          stanza[key] = [];
          stanza[key].push(val);
        } else {
          stanza[key] = val;
        }
      }
      return stanza;
    }, {});
  });

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
  fs.writeFileSync('hpo.json', JSON.stringify(data, null, 2));
  return data;
}

fetchAndParse(oboURL);
