const express = require('express');

const fetchAndParse = require('./parse.js');
const port = process.env.PORT || 4001;
const app = express();

app.use(express.static('client/build'));

app.get('/data', (req, res) => {
  const oboUrl =
    'https://raw.githubusercontent.com/obophenotype/human-phenotype-ontology/master/hp.obo';
  fetchAndParse(oboUrl).then(data => res.send(data));
});

app.listen(port, () => {
  console.log(`Doing the things on port ${port}`);
});
