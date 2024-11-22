import { load } from 'cheerio';
export default { ScrapingTable };

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const url = 'https://br.investing.com/economic-calendar/';

async function ScrapingTable() {
    
    let listEvents = [];
    console.log('Starting script ...');

    const response =  await fetch(url);

    if (!response.ok) 
        throw new Error(`Erro: ${response.statusText}`);

    const body =  await response.text();
    const $ = load(body);
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
