const express = require('express');
const swaggerJSDoc = require('./doc/swagerConfig');
const swaggerUi = require('swagger-ui-express');
const { ScrapingTable } = require('./functions/Scraping');
const { AssetFilter, EventDescriptionFilter } = require('./functions/Filters');

const app = express();
const port = 3000;

app.get('/test-scraping', async (req, res) => {
  try {
    const response = await fetch('https://br.investing.com/economic-calendar/');
    return res.status(response.status).json({ status: response.status, statusText: response.statusText });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
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
    console.log(`Running Server https://localhost${port}`);
  });
}