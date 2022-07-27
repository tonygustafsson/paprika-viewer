import { orderBy } from 'lodash-es';
import { get, writable } from 'svelte/store';

import type { Ticker } from '../types';
import { exchanges } from './exchanges';
import { favorites } from './favorites';
import { filter } from './filter';
import { settings } from './settings';
import { sort } from './sort';
import { tickers } from './tickers';

const initValue: Ticker[] = [];

const sortVolumeMap = {
	0: { min: 0, max: 100000 },
	100000: { min: 100000, max: 250000 },
	250000: { min: 250000, max: 500000 },
	500000: { min: 500000, max: 1000000 },
	1000000: { min: 1000000, max: 5000000 },
	5000000: { min: 5000000, max: 10000000 },
	10000000: { min: 10000000, max: 20000000 },
	20000000: { min: 20000000, max: 50000000 },
	50000000: { min: 50000000, max: Infinity }
};

const sortMarketCapMap = {
	0: { min: 0, max: 100000 },
	100000: { min: 100000, max: 250000 },
	250000: { min: 250000, max: 500000 },
	500000: { min: 500000, max: 1000000 },
	1000000: { min: 1000000, max: 5000000 },
	5000000: { min: 5000000, max: 10000000 },
	10000000: { min: 10000000, max: 20000000 },
	20000000: { min: 20000000, max: 50000000 },
	50000000: { min: 50000000, max: Infinity }
};

// eslint-disable-next-line no-unused-vars
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
				const $exchanges = get(exchanges);
				const $filter = get(filter);
				const $settings = get(settings);

				let newTickers = [...$tickers];

				if ($filter.favorites === true) {
					const $favorites = get(favorites);
					newTickers = newTickers.filter((ticker) =>
						Object.prototype.hasOwnProperty.call($favorites, ticker.symbol)
					);
				}

				if ($filter.exchange !== 'any') {
					newTickers = newTickers.filter((ticker) =>
						($exchanges[ticker.id] || []).includes($filter.exchange)
					);
				}

				if ($filter.volume !== -1) {
					const volumeMinMax = sortVolumeMap[$filter.volume];

					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].volume_24h >= volumeMinMax.min &&
							ticker.quotes[$settings.referenceCurrency].volume_24h <= volumeMinMax.max
					);
				}

				if ($filter.marketCap !== -1) {
					const marketCapMinMax = sortMarketCapMap[$filter.marketCap];

					newTickers = newTickers.filter(
						(ticker) =>
							ticker.quotes[$settings.referenceCurrency].market_cap >= marketCapMinMax.min &&
							ticker.quotes[$settings.referenceCurrency].market_cap <= marketCapMinMax.max
					);
				}

				return newTickers;
			});
		},
		sort: () => {
			update((tickers) => sortTickers(tickers));
		}
	};
};

export const filteredTickers = filteredTickersStore();

tickers.subscribe((tickers) => {
	if (tickers.length <= 0) return;

	filteredTickers.updateAll(tickers);
});

filter.subscribe(() => {
	filteredTickers.filter();
	filteredTickers.sort();
});
