const express = require('express');
const swaggerJSDoc = require('./doc/swagerConfig');
const swaggerUi = require('swagger-ui-express');
const { ScrapingTable } = require('./functions/Scraping');
const { AssetFilter, EventDescriptionFilter } = require('./functions/Filters');

const app = express();
const port = 3000;

app.get('/calendar/filters', async (req, res) => {
  try{
    let { asset, eventDescription } = req.query;
    let json = (await ScrapingTable()).listEvents;
    let jsonFiltered = json;
    
    if (asset)
      jsonFiltered = AssetFilter(asset, json);

    if (eventDescription)
      jsonFiltered = EventDescriptionFilter(eventDescription, jsonFiltered);
    
      return res.json(jsonFiltered);

  }catch(error){
      return res.json(error.message);
  }
});

app.get('/calendar', async (req, res) => {
  try{
      let json = await ScrapingTable();
      return res.json(json);
      
    }catch(error){
      return res.json(error.message);
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc));

app.listen(port, () => {
  console.log(`Running Server http://localhost:${port}`);
});