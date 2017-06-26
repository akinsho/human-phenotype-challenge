const fs = require('fs');
const fetch = require('isomorphic-fetch');
const bionode = require('bionode-obo');
const request = require('request');

const oboURL =
  'https://raw.githubusercontent.com/obophenotype/human-phenotype-ontology/master/hp.obo';

const parseStanza = stanzaText =>
  stanzaText.trim().split('\n').reduce((stanza, currentLine, array) => {
    const separatorIndex = currentLine.indexOf(':');
    let key = currentLine.slice(0, separatorIndex);
    let val = currentLine.slice(separatorIndex + 1).trim();

    if (currentLine[0] === '[') {
      key = '';
      val = val.replace(/^\[/, '').replace(/\]$/, '');
    }
    if (stanza[key]) {
      if (stanza[key].constructor !== Array) {
        stanza[key] = new Array(stanza[key]);
      }
      stanza[key].push(val);
    } else {
      stanza[key] = val;
    }
    return stanza;
  }, {});

const parse = fn => {
  function transform(chunk, enc, next) {
    if (chunk[0] === charCode('[')) {
      if (header) {
        this.emit('header', parseStanza(stanzaBuffer.slice()));
        fn(parseStanza(stanzaBuffer.slice()));
        header = false;
      } else {
        this.push(parseStanza(stanzaBuffer.slice()) + '\n');
      }
      stanzaBuffer = new BufferList();
    }

    stanzaBuffer.append(chunk).append('\n');
    next();
  }
};

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
      fs.writeFileSync('HPO.obo', text);
      return parseStanza(text);
    });
  return data;
}

fetchAndParse(oboURL);
