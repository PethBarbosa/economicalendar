const express = require('express');
const swaggerJSDoc = require('./doc/swagerConfig');
const swaggerUi = require('swagger-ui-express');
const { ScrapingTable } = require('./functions/Scraping');
const { AssetFilter, EventDescriptionFilter } = require('./functions/Filters');

const app = express();
const port = 3000;

app.get('/calendar', async (req, res) => {
  try{
    let { asset, eventDescription } = req.query;
    let events = (await ScrapingTable()).listEvents; 
    let utc = (await ScrapingTable()).utc;
    debugger;
    let listEvents = events;
    
    if (asset)
      listEvents = AssetFilter(asset, events);

    if (eventDescription)
      listEvents = EventDescriptionFilter(eventDescription, listEvents);
    
      return res.json({ utc, listEvents });

  }catch(error){
      return res.json(error.message);
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc));

app.listen(port, () => {
  console.log(`Running Server http://localhost:${port}`);
});