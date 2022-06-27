import { writable } from 'svelte/store';

const initValue = [];

const getDecimalsForPrice = price => {
    if (price > 1) return price.toFixed(2);
    if (price < 0.001) return price.toFixed(8);

    return price.toFixed(6);
};

const getQuotes = quotes => {
    return {
        price: getDecimalsForPrice(quotes.price),
        volume24h: quotes.volume_24h,
        marketCap: quotes.market_cap,
        change1h: quotes.percent_change_1h,
        change12h: quotes.percent_change_12h,
        change24h: quotes.percent_change_24h,
        change7d: quotes.percent_change_7d,
        change30d: quotes.percent_change_30d,
        fromAth: quotes.percent_from_price_ath !== null ? quotes.percent_from_price_ath : '?'
    };
};

const getTickerData = ticker => {
    return {
        id: ticker.id,
        symbol: ticker.symbol,
        name: ticker.name,
        rank: ticker.rank,
        usd: getQuotes(ticker.quotes.USD),
        sek: getQuotes(ticker.quotes.SEK),
        btc: getQuotes(ticker.quotes.BTC),
        exchanges: ticker.exchanges
    };
};

const tickersStore = () => {
    const { subscribe, set } = writable(initValue);

    return {
        subscribe,
        save: data => {
            const newData = [];
            data.forEach(ticker => newData.push(getTickerData(ticker)));
            set(newData);
        }
    };
};

export const tickers = tickersStore();
