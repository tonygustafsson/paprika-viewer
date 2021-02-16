import { global } from '../stores/global';
import { tickers } from '../stores/tickers';
import { apiUrls, minVolumeToView, minMarketCapToView, localStorageTickersTable } from '../constants';
import { getFromStorage, saveToStorage } from '../utils/storage';

const getTickersFromApi = async () => {
    const tickersResponse = await fetch(apiUrls.tickers);
    let tickersJson = await tickersResponse.json();

    if (minVolumeToView !== 0) {
        // Remove coins with too low volume
        tickersJson = tickersJson.filter(ticker => ticker.quotes.USD.volume_24h > minVolumeToView);
    }

    if (minMarketCapToView !== 0) {
        // Remove coins with too low marketcap
        tickersJson = tickersJson.filter(ticker => ticker.quotes.USD.market_cap > minMarketCapToView);
    }

    return tickersJson;
};

const addMarketToTickers = async (tickersResponse, exchange) => {
    const response = await fetch(apiUrls.markets[exchange]);
    const markets = await response.json();

    markets.forEach(market => {
        const matcher = market.base_currency_id;
        const matchingTicker = tickersResponse.find(x => x.id === matcher);

        if (matchingTicker) {
            if (!matchingTicker.exchanges) matchingTicker.exchanges = [];

            if (exchange === 'coinbasePro') exchange = 'coinbase';

            if (!matchingTicker.exchanges.includes(exchange)) {
                matchingTicker.exchanges.push(exchange);
            }
        }
    });

    return tickersResponse;
};

export const getTickers = async () => {
    const tickersFromStorage = await getFromStorage(localStorageTickersTable);

    if (tickersFromStorage) {
        // If tickers are saved in localForage, use that
        tickers.save(tickersFromStorage);
        global.isLoading(false);
    } else {
        // If it's not stored, get the data from API
        console.log(`Fetching tickers from API.`);
        getTickersFromApi().then(async tickersResponse => {
            tickersResponse = await addMarketToTickers(tickersResponse, 'coinbasePro');
            tickersResponse = await addMarketToTickers(tickersResponse, 'binance');
            tickersResponse = await addMarketToTickers(tickersResponse, 'idex');
            tickersResponse = await addMarketToTickers(tickersResponse, 'kraken');
            tickersResponse = await addMarketToTickers(tickersResponse, 'kucoin');
            tickersResponse = await addMarketToTickers(tickersResponse, 'okex');
            tickersResponse = await addMarketToTickers(tickersResponse, 'uniswap');

            tickers.save(tickersResponse);
            global.isLoading(false);

            // Save the API data to localForage
            saveToStorage(localStorageTickersTable, tickersResponse);
        });
    }
};
