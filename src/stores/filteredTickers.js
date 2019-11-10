import { writable, get } from 'svelte/store';
import { tickers } from './tickers';
import { order } from './order';
import { filter } from './filter';
import { favorites } from './favorites';
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
        filter: () => {
            update(() => {
                const $tickers = get(tickers);
                const $filter = get(filter);

                let newTickers = [...$tickers];

                if ($filter.favorites === true) {
                    const $favorites = get(favorites);
                    newTickers = newTickers.filter(ticker => $favorites.hasOwnProperty(ticker.symbol));
                }

                if ($filter.exchange === 'any') {
                    newTickers = newTickers.filter(ticker => ticker.exchanges && ticker.exchanges.length > 0);
                } else if ($filter.exchange !== 'all') {
                    newTickers = newTickers.filter(
                        ticker => ticker.exchanges && ticker.exchanges.includes($filter.exchange)
                    );
                }

                if ($filter.volume === '0') {
                    newTickers = newTickers.filter(ticker => ticker.quotes.USD.volume_24h < 100000);
                }

                if ($filter.volume === '100000') {
                    newTickers = newTickers.filter(
                        ticker => ticker.quotes.USD.volume_24h >= 100000 && ticker.quotes.USD.volume_24h <= 250000
                    );
                }

                if ($filter.volume === '250000') {
                    newTickers = newTickers.filter(
                        ticker => ticker.quotes.USD.volume_24h > 250000 && ticker.quotes.USD.volume_24h <= 500000
                    );
                }

                if ($filter.volume === '500000') {
                    newTickers = newTickers.filter(
                        ticker => ticker.quotes.USD.volume_24h > 500000 && ticker.quotes.USD.volume_24h <= 1000000
                    );
                }

                if ($filter.volume === '1000000') {
                    newTickers = newTickers.filter(
                        ticker => ticker.quotes.USD.volume_24h > 1000000 && ticker.quotes.USD.volume_24h <= 5000000
                    );
                }

                if ($filter.volume === '5000000') {
                    newTickers = newTickers.filter(
                        ticker => ticker.quotes.USD.volume_24h > 5000000 && ticker.quotes.USD.volume_24h <= 10000000
                    );
                }

                if ($filter.volume === '10000000') {
                    newTickers = newTickers.filter(
                        ticker => ticker.quotes.USD.volume_24h > 10000000 && ticker.quotes.USD.volume_24h <= 20000000
                    );
                }

                if ($filter.volume === '20000000') {
                    newTickers = newTickers.filter(
                        ticker => ticker.quotes.USD.volume_24h > 20000000 && ticker.quotes.USD.volume_24h <= 50000000
                    );
                }

                if ($filter.volume === '50000000') {
                    newTickers = newTickers.filter(ticker => ticker.quotes.USD.volume_24h > 50000000);
                }

                if ($filter.marketCap === '0') {
                    newTickers = newTickers.filter(ticker => ticker.quotes.USD.market_cap < 100000);
                }

                if ($filter.marketCap === '100000') {
                    newTickers = newTickers.filter(
                        ticker => ticker.quotes.USD.market_cap >= 100000 && ticker.quotes.USD.market_cap <= 250000
                    );
                }

                if ($filter.marketCap === '250000') {
                    newTickers = newTickers.filter(
                        ticker => ticker.quotes.USD.market_cap > 250000 && ticker.quotes.USD.market_cap <= 500000
                    );
                }

                if ($filter.marketCap === '500000') {
                    newTickers = newTickers.filter(
                        ticker => ticker.quotes.USD.market_cap > 500000 && ticker.quotes.USD.market_cap <= 1000000
                    );
                }

                if ($filter.marketCap === '1000000') {
                    newTickers = newTickers.filter(
                        ticker => ticker.quotes.USD.market_cap > 1000000 && ticker.quotes.USD.market_cap <= 5000000
                    );
                }

                if ($filter.marketCap === '5000000') {
                    newTickers = newTickers.filter(
                        ticker => ticker.quotes.USD.market_cap > 5000000 && ticker.quotes.USD.market_cap <= 10000000
                    );
                }

                if ($filter.marketCap === '10000000') {
                    newTickers = newTickers.filter(
                        ticker => ticker.quotes.USD.market_cap > 10000000 && ticker.quotes.USD.market_cap <= 20000000
                    );
                }

                if ($filter.marketCap === '20000000') {
                    newTickers = newTickers.filter(
                        ticker => ticker.quotes.USD.market_cap > 20000000 && ticker.quotes.USD.market_cap <= 50000000
                    );
                }

                if ($filter.marketCap === '50000000') {
                    newTickers = newTickers.filter(ticker => ticker.quotes.USD.market_cap > 50000000);
                }

                return newTickers;
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

filter.subscribe(filter => {
    filteredTickers.filter();
    filteredTickers.order();
});
