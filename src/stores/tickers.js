import { writable, get } from 'svelte/store';
import { order } from './order';
import { debugMode, apiUrls, debugApiUrls, minVolumeToView, minMarketCapToView } from '../constants';
import sort from 'fast-sort';

const urls = debugMode ? debugApiUrls : apiUrls;

const initValue = [];

const sortTickersByLambda = (tickers, lambda) => {
    const $order = get(order);

    if ($order.direction === 'asc') {
        return sort(tickers).asc(lambda);
    } else {
        return sort(tickers).desc(lambda);
    }
};

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
            if (!matchingTicker.exchanges) matchingTicker.exchanges = {};

            if (exchange === 'coinbasePro') exchange = 'coinbase';

            matchingTicker.exchanges[exchange] = exchange;
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
        },
        order: () => {
            update(tickers => {
                let newTickers = [...tickers];
                const $order = get(order);

                switch ($order.by) {
                    case 'rank':
                        newTickers = sortTickersByLambda(newTickers, x => x.rank);
                        break;
                    case 'symbol':
                        newTickers = sortTickersByLambda(newTickers, x => x.symbol);
                        break;
                    case 'name':
                        newTickers = sortTickersByLambda(newTickers, x => x.name);
                        break;
                    case 'price':
                        newTickers = sortTickersByLambda(newTickers, x => x.quotes.USD.price);
                        break;
                    case 'volume_24h':
                        newTickers = sortTickersByLambda(newTickers, x => x.quotes.USD.volume_24h);
                        break;
                    case '1h':
                        newTickers = sortTickersByLambda(newTickers, x => x.quotes.USD.percent_change_1h);
                        break;
                    case '12h':
                        newTickers = sortTickersByLambda(newTickers, x => x.quotes.USD.percent_change_12h);
                        break;
                    case '24h':
                        newTickers = sortTickersByLambda(newTickers, x => x.quotes.USD.percent_change_24h);
                        break;
                    case '7d':
                        newTickers = sortTickersByLambda(newTickers, x => x.quotes.USD.percent_change_7d);
                        break;
                    case '30d':
                        newTickers = sortTickersByLambda(newTickers, x => x.quotes.USD.percent_change_30d);
                        break;
                    case 'ath':
                        newTickers = sortTickersByLambda(newTickers, x => x.quotes.USD.percent_from_price_ath);
                        break;
                    default:
                        newTickers = sortTickersByLambda(newTickers, x => x.quotes.USD.market_cap);
                }

                return newTickers;
            });
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
    tickers.order();
});
