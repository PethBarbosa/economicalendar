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
  try {
    console.log('Request query:', req.query);
    let { asset, eventDescription } = req.query;

    let scrapingResult = await ScrapingTable();
    console.log('Scraping result:', scrapingResult);

    let events = scrapingResult.listEvents;
    let utc = scrapingResult.utc;
    let listEvents = events;

    if (asset) {
      listEvents = AssetFilter(asset, events);
      console.log('Filtered by asset:', listEvents);
    }

    if (eventDescription) {
      listEvents = EventDescriptionFilter(eventDescription, listEvents);
      console.log('Filtered by eventDescription:', listEvents);
    }

    return res.json({ utc, listEvents });
  } catch (error) {
    console.error('Error in /calendar:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc));

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Running Server http://localhost${port}`);
  });
}