const cheerio = require('cheerio');
module.exports = { ScrapingTable };

let tls = process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
let keyScrapping = process.env.SCRAPER_API_KEY;
let baseUrl = `https://api.scraperapi.com?api_key=${keyScrapping}&url=`;

const url = "https://api.scraperapi.com?api_key=bab19f968cdd25fea30489d351e3fc52&url=https://br.investing.com/economic-calendar/";

async function ScrapingTable() {
    
    let listEvents = [];
    console.log('Starting script ...');

    const response =  await fetch(url);

    if (!response.http_code == 200) 
        throw new Error(`Erro: ${response.statusText}`);

    const body =  await response.text();
    const $ = cheerio.load(body);
    let clock = $('#currentTime').text();
    let timezoneOffset = $('#timeZoneGmtOffsetFormatted').text();
    
    let utc = 
    {
        currentClock : clock,
        gmt : timezoneOffset
    };

    const line = $('#economicCalendarData tbody tr');
    let dateEventGlobal = '';

    line.each((index, item) => {
        dateEvent = $(item).find('td.theDay').text().trim();
        dateEventGlobal = dateEvent ? dateEvent : dateEventGlobal;

        if (dateEvent != '')
            return true;

        let eventTitle = $(item).find('td.left.event').text().trim();
        let eventTime = $(item).find('td.first.left.time.js-time').text().trim();
        let eventImportanceLevel = $(item).find('td.left.textNum.sentiment.noWrap').prop('data-img_key'); // bull1, bull2, e bull3
        let eventAsset = $(item).find('td.left.flagCur.noWrap').text().trim();
        let current = $(item).find('td.bold').text().trim();
        let expected = $(item).find('td.fore').text().trim();
        let previous = $(item).find('td.prev').text().trim();
        
        let calendarEvent = {
            dateEvent : dateEventGlobal,
            eventTitle: eventTitle,
            eventTime: eventTime,
            eventImportanceLevel: eventImportanceLevel,
            eventAsset: eventAsset,
            current: current,
            expected: expected,
            previous: previous
        }

        listEvents.push(calendarEvent);
    });

    console.log('Stopping script!');

    return { utc, listEvents };
}
