import { writable, get } from 'svelte/store';
import { tickers } from './tickers';
import { order } from './order';
import sort from 'fast-sort';

const initValue = [];

const sortTickersByLambda = (tickers, lambda) => {
    const $order = get(order);

    if ($order.direction === 'asc') {
        return sort(tickers).asc(lambda);
    } else {
        return sort(tickers).desc(lambda);
    }
};

const orderTickers = tickers => {
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
};

const filteredTickersStore = () => {
    const { subscribe, set, update } = writable(initValue);

    return {
        subscribe,
        updateAll: data => {
            const newTickers = orderTickers(data);
            set(newTickers);
        },
        filterExchange: filterExchange => {
            update(filteredTickers => {
                const $tickers = get(tickers);
                let newTickers = [...$tickers];

                if (!filterExchange || filterExchange === 'all') {
                    return newTickers;
                }

                if (filterExchange === 'any') {
                    return newTickers.filter(ticker => ticker.exchanges && ticker.exchanges.length > 0);
                }

                return newTickers.filter(ticker => ticker.exchanges && ticker.exchanges.includes(filterExchange));
            });
        },
        order: () => {
            update(tickers => {
                const newTickers = orderTickers(tickers);
                return newTickers;
            });
        }
    };
};

export const filteredTickers = filteredTickersStore();

tickers.subscribe(tickers => {
    filteredTickers.updateAll(tickers);
});
