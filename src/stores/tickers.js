import { writable } from 'svelte/store';

const initValue = [];

const getTickerData = ticker => {
    return {
        id: ticker.id,
        symbol: ticker.symbol,
        name: ticker.name,
        rank: ticker.rank,
        usd: {
            price: ticker.quotes.USD.price.toFixed(2),
            volume24h: ticker.quotes.USD.volume_24h,
            marketCap: ticker.quotes.USD.market_cap,
            change1h: ticker.quotes.USD.percent_change_1h,
            change12h: ticker.quotes.USD.percent_change_12h,
            change24h: ticker.quotes.USD.percent_change_24h,
            change7d: ticker.quotes.USD.percent_change_7d,
            change30d: ticker.quotes.USD.percent_change_30d,
            fromAth: ticker.quotes.USD.percent_from_price_ath
        },
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
