const express = require('express');
const { ScrapingTable } = require('./functions/Scraping');
const { AssetFilter } = require('./functions/Filters');

const app = express();
const port = 3000;

app.get('/calendar/:asset', async (req, res) => {
  let param = req.params.asset;
  let json = await ScrapingTable();
  let jsonFiltered = AssetFilter(param, json);
  return res.json(jsonFiltered);
});


app.get('/calendar', async (req, res) => {
  let json = await ScrapingTable();
  return res.json(json);
});

app.listen(port, () => {
  console.log(`Running Server http://localhost:${port}`);
});