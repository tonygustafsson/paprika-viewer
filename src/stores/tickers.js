import { writable, get } from 'svelte/store';
import { order } from './order';
import { global } from './global';
import { filteredTickers } from './filteredTickers';
import { debugMode, apiUrls, debugApiUrls, minVolumeToView, minMarketCapToView } from '../constants';

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

getTickersFromApi().then(async tickersResponse => {
    tickersResponse = await addMarketToTickers(tickersResponse, 'coinbasePro');
    tickersResponse = await addMarketToTickers(tickersResponse, 'binance');
    tickersResponse = await addMarketToTickers(tickersResponse, 'idex');
    tickersResponse = await addMarketToTickers(tickersResponse, 'idax');
    tickersResponse = await addMarketToTickers(tickersResponse, 'kraken');
    tickersResponse = await addMarketToTickers(tickersResponse, 'kucoin');
    tickersResponse = await addMarketToTickers(tickersResponse, 'okex');

    tickers.updateAll(tickersResponse);
    filteredTickers.updateAll(tickersResponse);

    global.isLoading(false);
});
