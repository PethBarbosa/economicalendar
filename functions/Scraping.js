const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Evitar rejeição de SSL para algumas conexões

const url = 'https://br.investing.com/economic-calendar/';

async function ScrapingTable() {
  if (process.env.NODE_ENV === 'production') {
    // Se estiver em produção (Vercel), usa Puppeteer
    console.log('Executando com Puppeteer...');
    return await scrapeWithPuppeteer();
  } else {
    // Se estiver em ambiente local, usa fetch + cheerio
    console.log('Executando localmente com fetch...');
    return await scrapeWithFetch();
  }
}

// Função para scraping usando Puppeteer
async function scrapeWithPuppeteer() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'load',
    timeout: 0
  });

  const body = await page.content();
  const $ = cheerio.load(body);
  await browser.close();

  return extractData($);
}

// Função para scraping usando fetch (em desenvolvimento)
async function scrapeWithFetch() {
  const response = await fetch(url);

  if (!response.ok)
    throw new Error(`Erro ao acessar a URL: ${response.statusText} (${response.status})`);

  const body = await response.text();
  const $ = cheerio.load(body);

  return extractData($);
}

// Função comum para extrair os dados (UTC + lista de eventos)
function extractData($) {
  let listEvents = [];
  let clock = $('#currentTime').text().trim();
  let timezoneOffset = $('#timeZoneGmtOffsetFormatted').text().trim();
  
  let utc = {
    currentClock: clock,
    gmt: timezoneOffset
  };

  const line = $('#economicCalendarData tbody tr');
  let dateEventGlobal = '';

  line.each((index, item) => {
    let dateEvent = $(item).find('td.theDay').text().trim();
    dateEventGlobal = dateEvent ? dateEvent : dateEventGlobal;

    if (dateEvent !== '') return true;

    let eventTitle = $(item).find('td.left.event').text().trim();
    let eventTime = $(item).find('td.first.left.time.js-time').text().trim();
    let eventImportanceLevel = $(item).find('td.left.textNum.sentiment.noWrap').prop('data-img_key'); // bull1, bull2, e bull3
    let eventAsset = $(item).find('td.left.flagCur.noWrap').text().trim();
    let current = $(item).find('td.bold').text().trim();
    let expected = $(item).find('td.fore').text().trim();
    let previous = $(item).find('td.prev').text().trim();

    let calendarEvent = {
      dateEvent: dateEventGlobal,
      eventTitle: eventTitle,
      eventTime: eventTime,
      eventImportanceLevel: eventImportanceLevel,
      eventAsset: eventAsset,
      current: current,
      expected: expected,
      previous: previous
    };

    listEvents.push(calendarEvent);
  });

  return { utc, listEvents };
}

module.exports = { ScrapingTable };
