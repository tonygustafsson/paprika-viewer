import { debugMode, apiUrls, debugApiUrls } from './constants';

const urls = debugMode ? debugApiUrls : apiUrls;

export const addMarketToTickers = async (tickers, exchange) => {
    const response = await fetch(urls.markets[exchange]);
    const markets = await response.json();

    markets.forEach(market => {
        const matchingTicker = tickers.find(x => x.id === market.base_currency_id);

        if (matchingTicker) {
            if (!matchingTicker.exchanges) matchingTicker.exchanges = {};
            matchingTicker.exchanges[exchange] = true;
        }
    });

    return tickers;
};
