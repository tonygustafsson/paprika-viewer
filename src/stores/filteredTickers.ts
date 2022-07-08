import { writable, get } from 'svelte/store';
import { tickers } from './tickers';
import { sort } from './sort';
import { settings } from './settings';
import { filter } from './filter';
import { favorites } from './favorites';
import { orderBy } from 'lodash-es';
import type { Ticker } from 'src/types';

const initValue: Ticker[] = [];

const sortTickersByLambda = (tickers: Ticker[], lambda: (ticker: Ticker) => number | string) => {
	const $sort = get(sort);
	return orderBy(tickers, lambda, $sort.direction);
};

const sortTickers = (tickers: Ticker[]) => {
	let newTickers = [...tickers];
	const $sort = get(sort);
	const $settings = get(settings);
	const refCurrency = $settings.referenceCurrency;

	switch ($sort.by) {
		case 'rank':
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.rank);
			break;
		case 'symbol':
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.symbol);
			break;
		case 'name':
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.name);
			break;
		case 'price':
			newTickers = sortTickersByLambda(
				newTickers,
				(ticker: Ticker) => ticker.quotes[refCurrency].price
			);
			break;
		case 'volume_24h':
			newTickers = sortTickersByLambda(
				newTickers,
				(ticker: Ticker) => ticker.quotes[refCurrency].volume_24h
			);
			break;
		case 'percent_change_1h':
			newTickers = sortTickersByLambda(
				newTickers,
				(ticker: Ticker) => ticker.quotes[refCurrency].percent_change_1h
			);
			break;
		case 'percent_change_12h':
			newTickers = sortTickersByLambda(
				newTickers,
				(ticker: Ticker) => ticker.quotes[refCurrency].percent_change_12h
			);
			break;
		case 'percent_change_24h':
			newTickers = sortTickersByLambda(
				newTickers,
				(ticker: Ticker) => ticker.quotes[refCurrency].percent_change_24h
			);
			break;
		case 'percent_change_7d':
			newTickers = sortTickersByLambda(
				newTickers,
				(ticker: Ticker) => ticker.quotes[refCurrency].percent_change_7d
			);
			break;
		case 'percent_change_30d':
			newTickers = sortTickersByLambda(
				newTickers,
				(ticker: Ticker) => ticker.quotes[refCurrency].percent_change_30d
			);
			break;
		case 'percent_change_1y':
			newTickers = sortTickersByLambda(
				newTickers,
				(ticker: Ticker) => ticker.quotes[refCurrency].percent_change_1y
			);
			break;
		case 'percent_from_price_ath':
			newTickers = sortTickersByLambda(
				newTickers,
				(ticker: Ticker) => ticker.quotes[refCurrency].percent_from_price_ath
			);
			break;
		default:
			newTickers = sortTickersByLambda(
				newTickers,
				(ticker: Ticker) => ticker.quotes[refCurrency].market_cap
			);
	}

	return newTickers;
};

const filteredTickersStore = () => {
	const { subscribe, set, update } = writable(initValue);

	return {
		subscribe,
		updateAll: (data: Ticker[]) => {
			const newTickers = sortTickers(data);
			set(newTickers);
		},
		filter: () => {
			update(() => {
				const $tickers = get(tickers);
				const $filter = get(filter);
				const $settings = get(settings);

				let newTickers = [...$tickers];

				if ($filter.favorites === true) {
					const $favorites = get(favorites);
					newTickers = newTickers.filter((ticker) =>
						Object.prototype.hasOwnProperty.call($favorites, ticker.symbol)
					);
				}

				if ($filter.exchange === 'any') {
					newTickers = newTickers.filter(
						(ticker) => ticker.exchanges && ticker.exchanges.length > 0
					);
				} else if ($filter.exchange !== 'all') {
					newTickers = newTickers.filter(
						(ticker) => ticker.exchanges && ticker.exchanges.includes($filter.exchange)
					);
				}

				if ($filter.volume === '0') {
					newTickers = newTickers.filter(
						(ticker) => ticker.quotes[$settings.referenceCurrency].volume_24h < 100000
					);
				}

				if ($filter.volume === '100000') {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].volume_24h >= 100000 &&
							ticker.quotes[$settings.referenceCurrency].volume_24h <= 250000
					);
				}

				if ($filter.volume === '250000') {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].volume_24h > 250000 &&
							ticker.quotes[$settings.referenceCurrency].volume_24h <= 500000
					);
				}

				if ($filter.volume === '500000') {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].volume_24h > 500000 &&
							ticker.quotes[$settings.referenceCurrency].volume_24h <= 1000000
					);
				}

				if ($filter.volume === '1000000') {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].volume_24h > 1000000 &&
							ticker.quotes[$settings.referenceCurrency].volume_24h <= 5000000
					);
				}

				if ($filter.volume === '5000000') {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].volume_24h > 5000000 &&
							ticker.quotes[$settings.referenceCurrency].volume_24h <= 10000000
					);
				}

				if ($filter.volume === '10000000') {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].volume_24h > 10000000 &&
							ticker.quotes[$settings.referenceCurrency].volume_24h <= 20000000
					);
				}

				if ($filter.volume === '20000000') {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].volume_24h > 20000000 &&
							ticker.quotes[$settings.referenceCurrency].volume_24h <= 50000000
					);
				}

				if ($filter.volume === '50000000') {
					newTickers = newTickers.filter(
						(ticker) => ticker.quotes[$settings.referenceCurrency].volume_24h > 50000000
					);
				}

				if ($filter.marketCap === '0') {
					newTickers = newTickers.filter(
						(ticker) => ticker.quotes[$settings.referenceCurrency].market_cap < 100000
					);
				}

				if ($filter.marketCap === '100000') {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].market_cap >= 100000 &&
							ticker.quotes[$settings.referenceCurrency].market_cap <= 250000
					);
				}

				if ($filter.marketCap === '250000') {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].market_cap > 250000 &&
							ticker.quotes[$settings.referenceCurrency].market_cap <= 500000
					);
				}

				if ($filter.marketCap === '500000') {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].market_cap > 500000 &&
							ticker.quotes[$settings.referenceCurrency].market_cap <= 1000000
					);
				}

				if ($filter.marketCap === '1000000') {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].market_cap > 1000000 &&
							ticker.quotes[$settings.referenceCurrency].market_cap <= 5000000
					);
				}

				if ($filter.marketCap === '5000000') {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].market_cap > 5000000 &&
							ticker.quotes[$settings.referenceCurrency].market_cap <= 10000000
					);
				}

				if ($filter.marketCap === '10000000') {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].market_cap > 10000000 &&
							ticker.quotes[$settings.referenceCurrency].market_cap <= 20000000
					);
				}

				if ($filter.marketCap === '20000000') {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].market_cap > 20000000 &&
							ticker.quotes[$settings.referenceCurrency].market_cap <= 50000000
					);
				}

				if ($filter.marketCap === '50000000') {
					newTickers = newTickers.filter(
						(ticker) => ticker.quotes[$settings.referenceCurrency].market_cap > 50000000
					);
				}

				return newTickers;
			});
		},
		sort: () => {
			update((tickers) => {
				const newTickers = sortTickers(tickers);

				console.log({ sorted: true, newTickers });

				return newTickers;
			});
		}
	};
};

export const filteredTickers = filteredTickersStore();

tickers.subscribe((tickers) => {
	if (tickers.length <= 0) return;

	filteredTickers.updateAll(tickers);

	filter.subscribe(() => {
		filteredTickers.filter();
		filteredTickers.sort();
	});
});
