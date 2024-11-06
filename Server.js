const express = require('express');
const { ScrapingTable } = require('./functions/Scraping');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  let teste = await ScrapingTable();
  console.log(teste);
  return res.json(teste);
});

app.listen(port, () => {
  console.log(`Running Server http://localhost:${port}`);
});