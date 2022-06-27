import { writable, get } from 'svelte/store';
import { tickers } from './tickers';
import { order } from './order';
import { global } from './global';
import { filter } from './filter';
import { favorites } from './favorites';
import { sort } from 'fast-sort';

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
    const $global = get(global);

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
            newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].price);
            break;
        case 'volume_24h':
            newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].volume24h);
            break;
        case '1h':
            newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].change1h);
            break;
        case '12h':
            newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].change12h);
            break;
        case '24h':
            newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].change24h);
            break;
        case '7d':
            newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].change7d);
            break;
        case '30d':
            newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].change30d);
            break;
        case 'ath':
            newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].fromAth);
            break;
        default:
            newTickers = sortTickersByLambda(newTickers, x => x[$global.referenceCurrency].marketCap);
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
                const $global = get(global);

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
                    newTickers = newTickers.filter(ticker => ticker[$global.referenceCurrency].volume24h < 100000);
                }

                if ($filter.volume === '100000') {
                    newTickers = newTickers.filter(
                        ticker =>
                            ticker[$global.referenceCurrency].volume24h >= 100000 &&
                            ticker[$global.referenceCurrency].volume24h <= 250000
                    );
                }

                if ($filter.volume === '250000') {
                    newTickers = newTickers.filter(
                        ticker =>
                            ticker[$global.referenceCurrency].volume24h > 250000 &&
                            ticker[$global.referenceCurrency].volume24h <= 500000
                    );
                }

                if ($filter.volume === '500000') {
                    newTickers = newTickers.filter(
                        ticker =>
                            ticker[$global.referenceCurrency].volume24h > 500000 &&
                            ticker[$global.referenceCurrency].volume24h <= 1000000
                    );
                }

                if ($filter.volume === '1000000') {
                    newTickers = newTickers.filter(
                        ticker =>
                            ticker[$global.referenceCurrency].volume24h > 1000000 &&
                            ticker[$global.referenceCurrency].volume24h <= 5000000
                    );
                }

                if ($filter.volume === '5000000') {
                    newTickers = newTickers.filter(
                        ticker =>
                            ticker[$global.referenceCurrency].volume24h > 5000000 &&
                            ticker[$global.referenceCurrency].volume24h <= 10000000
                    );
                }

                if ($filter.volume === '10000000') {
                    newTickers = newTickers.filter(
                        ticker =>
                            ticker[$global.referenceCurrency].volume24h > 10000000 &&
                            ticker[$global.referenceCurrency].volume24h <= 20000000
                    );
                }

                if ($filter.volume === '20000000') {
                    newTickers = newTickers.filter(
                        ticker =>
                            ticker[$global.referenceCurrency].volume24h > 20000000 &&
                            ticker[$global.referenceCurrency].volume24h <= 50000000
                    );
                }

                if ($filter.volume === '50000000') {
                    newTickers = newTickers.filter(ticker => ticker[$global.referenceCurrency].volume24h > 50000000);
                }

                if ($filter.marketCap === '0') {
                    newTickers = newTickers.filter(ticker => ticker[$global.referenceCurrency].marketCap < 100000);
                }

                if ($filter.marketCap === '100000') {
                    newTickers = newTickers.filter(
                        ticker =>
                            ticker[$global.referenceCurrency].marketCap >= 100000 &&
                            ticker[$global.referenceCurrency].marketCap <= 250000
                    );
                }

                if ($filter.marketCap === '250000') {
                    newTickers = newTickers.filter(
                        ticker =>
                            ticker[$global.referenceCurrency].marketCap > 250000 &&
                            ticker[$global.referenceCurrency].marketCap <= 500000
                    );
                }

                if ($filter.marketCap === '500000') {
                    newTickers = newTickers.filter(
                        ticker =>
                            ticker[$global.referenceCurrency].marketCap > 500000 &&
                            ticker[$global.referenceCurrency].marketCap <= 1000000
                    );
                }

                if ($filter.marketCap === '1000000') {
                    newTickers = newTickers.filter(
                        ticker =>
                            ticker[$global.referenceCurrency].marketCap > 1000000 &&
                            ticker[$global.referenceCurrency].marketCap <= 5000000
                    );
                }

                if ($filter.marketCap === '5000000') {
                    newTickers = newTickers.filter(
                        ticker =>
                            ticker[$global.referenceCurrency].marketCap > 5000000 &&
                            ticker[$global.referenceCurrency].marketCap <= 10000000
                    );
                }

                if ($filter.marketCap === '10000000') {
                    newTickers = newTickers.filter(
                        ticker =>
                            ticker[$global.referenceCurrency].marketCap > 10000000 &&
                            ticker[$global.referenceCurrency].marketCap <= 20000000
                    );
                }

                if ($filter.marketCap === '20000000') {
                    newTickers = newTickers.filter(
                        ticker =>
                            ticker[$global.referenceCurrency].marketCap > 20000000 &&
                            ticker[$global.referenceCurrency].marketCap <= 50000000
                    );
                }

                if ($filter.marketCap === '50000000') {
                    newTickers = newTickers.filter(ticker => ticker[$global.referenceCurrency].marketCap > 50000000);
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
    if (tickers.length <= 0) return;

    filteredTickers.updateAll(tickers);

    filter.subscribe(filter => {
        filteredTickers.filter();
        filteredTickers.order();
    });
});
