import { writable, get } from 'svelte/store';
import { order } from './order';
import { global } from './global';
import {
    debugMode,
    apiUrls,
    debugApiUrls,
    minVolumeToView,
    minMarketCapToView,
    localStorageExpireTimeoutMs,
    localStorageDatabaseName,
    localStorageTickersTable,
    localStorageFetchTimeTable
} from '../constants';
import localforage from 'localforage';

localforage.config({
    name: localStorageDatabaseName,
    storeName: localStorageDatabaseName
});

const urls = debugMode ? debugApiUrls : apiUrls;

const initValue = [];

const getTickersFromApi = async () => {
    const tickersResponse = await fetch(urls.tickers);
    let tickersJson = await tickersResponse.json();

    // Remove coins with too low volume
    tickersJson = tickersJson
        .filter(ticker => ticker.quotes.USD.volume_24h > minVolumeToView)
        .filter(ticker => ticker.quotes.USD.market_cap > minMarketCapToView);

    return tickersJson;
};

const addMarketToTickers = async (tickersResponse, exchange) => {
    const response = await fetch(urls.markets[exchange]);
    const markets = await response.json();

    markets.forEach(market => {
        const matchingTicker = tickersResponse.find(x => x.id === market.base_currency_id);

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

const tickersStore = () => {
    const { subscribe, set, update } = writable(initValue);

    return {
        subscribe,
        updateAll: data => {
            set(data);
        }
    };
};

export const tickers = tickersStore();

const getFetchTime = async () => {
    const fetchTime = await localforage.getItem(localStorageFetchTimeTable);

    if (!fetchTime) {
        const now = Date.now();
        localforage.setItem(localStorageFetchTimeTable, now);
        return now;
    }

    return fetchTime;
};

getFetchTime().then(fetchTime => {
    if (Date.now() - fetchTime > localStorageExpireTimeoutMs) {
        // Cache has expired
        console.log('Expired cache, deleting local storage.');
        localforage.clear();
    }

    localforage
        .getItem(localStorageTickersTable)
        .then(localTickers => {
            if (localTickers) {
                // If tickers are saved in localForage, use that
                console.log('Fetching data from local storage.');
                tickers.updateAll(localTickers);
                global.isLoading(false);
            } else {
                // If it's not stored, get the data from API
                console.log(`Fetching data from API (debug mode: ${debugMode})`);
                getTickersFromApi().then(async tickersResponse => {
                    tickersResponse = await addMarketToTickers(tickersResponse, 'coinbasePro');
                    tickersResponse = await addMarketToTickers(tickersResponse, 'binance');
                    tickersResponse = await addMarketToTickers(tickersResponse, 'idex');
                    tickersResponse = await addMarketToTickers(tickersResponse, 'idax');
                    tickersResponse = await addMarketToTickers(tickersResponse, 'kraken');
                    tickersResponse = await addMarketToTickers(tickersResponse, 'kucoin');
                    tickersResponse = await addMarketToTickers(tickersResponse, 'okex');

                    tickers.updateAll(tickersResponse);
                    global.isLoading(false);

                    // Save the API data to localForage
                    localforage.setItem(localStorageTickersTable, tickersResponse);

                    localforage.getItem(localStorageFetchTimeTable).then(fetchTime => {
                        if (!fetchTime) {
                            localforage.setItem(localStorageFetchTimeTable, Date.now());
                        }
                    });
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
});
