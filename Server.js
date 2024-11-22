const express = require('express');
const swaggerJSDoc = require('./doc/swagerConfig');
const swaggerUi = require('swagger-ui-express');
const { ScrapingTable } = require('./functions/Scraping');
const { AssetFilter, EventDescriptionFilter } = require('./functions/Filters');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

app.get('/', async (req, res) => {
  res.json({"retorno": "ok"});
});

app.get('/calendar', async (req, res) => {
  try{
    let { asset, eventDescription } = req.query;
    let events = (await ScrapingTable()).listEvents; 
    let utc = (await ScrapingTable()).utc;
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

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Running Server http://localhost${port}`);
  });
}