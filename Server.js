const express = require('express');
const { ScrapingTable } = require('./functions/Scraping');
const { AssetFilter, EventDescriptionFilter } = require('./functions/Filters');

const app = express();
const port = 3000;

app.get('/calendar/filters', async (req, res) => {
  let { asset, eventDescription } = req.query;
  let json = (await ScrapingTable()).listEvents;
  let jsonFiltered = json;
  
  if (asset)
    jsonFiltered = AssetFilter(asset, json);

  if (eventDescription)
    jsonFiltered = EventDescriptionFilter(eventDescription, jsonFiltered);
  
    return res.json(jsonFiltered);
});

app.get('/calendar', async (req, res) => {
  let json = await ScrapingTable();
  return res.json(json);
});
  
app.listen(port, () => {
  console.log(`Running Server http://localhost:${port}`);
});