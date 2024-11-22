import express from 'express';
import swaggerJSDoc from './doc/swagerConfig';
import { serve, setup } from 'swagger-ui-express';
import { ScrapingTable } from './functions/Scraping';
import { AssetFilter, EventDescriptionFilter } from './functions/Filters';

const app = express();
const port = 3000;


app.get('/', async (req, res) => {
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

app.use('/api-docs', serve, setup(swaggerJSDoc));

export default app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Running Server http://localhost`);
  });
}