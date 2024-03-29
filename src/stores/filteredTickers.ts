import { orderBy } from 'lodash-es';
import { get, writable } from 'svelte/store';

import type { Ticker } from '../types';
import { exchanges } from './exchanges';
import { favorites } from './favorites';
import { filter } from './filter';
import { sort } from './sort';
import { tags } from './tags';
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

const sortTickers = (tickersData: Ticker[]) => {
	let newTickers = [...tickersData];
	const $sort = get(sort);

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
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.price);
			break;
		case 'volume_24h':
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.volume_24h);
			break;
		case 'percent_change_1h':
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.change_1h);
			break;
		case 'percent_change_12h':
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.change_12h);
			break;
		case 'percent_change_24h':
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.change_24h);
			break;
		case 'percent_change_7d':
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.change_7d);
			break;
		case 'percent_change_30d':
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.change_30d);
			break;
		case 'percent_change_1y':
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.change_1y);
			break;
		case 'from_ath':
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.from_ath);
			break;
		case 'beta':
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.beta);
			break;
		case 'created':
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.created);
			break;
		default:
			newTickers = sortTickersByLambda(newTickers, (ticker: Ticker) => ticker.mcap);
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
				const $tags = get(tags);
				const $filter = get(filter);

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

				if ($filter.tag !== 'any') {
					newTickers = newTickers.filter((ticker) =>
						($tags.tickers[ticker.id] || []).includes($filter.tag)
					);
				}

				if ($filter.volume !== -1) {
					const volumeMinMax = sortVolumeMap[$filter.volume];

					newTickers = newTickers.filter(
						(ticker) =>
							ticker.volume_24h >= volumeMinMax.min && ticker.volume_24h <= volumeMinMax.max
					);
				}

				if ($filter.marketCap !== -1) {
					const marketCapMinMax = sortMarketCapMap[$filter.marketCap];

					newTickers = newTickers.filter(
						(ticker) => ticker.mcap >= marketCapMinMax.min && ticker.mcap <= marketCapMinMax.max
					);
				}

				if ($filter.search) {
					newTickers = newTickers.filter(
						(ticker) =>
							ticker.name.toLowerCase().includes($filter.search.toLowerCase()) ||
							ticker.symbol.toLowerCase().includes($filter.search.toLowerCase())
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

tickers.subscribe((tickersData) => {
	if (tickersData.length <= 0) return;

	filteredTickers.updateAll(tickersData);
	filteredTickers.filter();
	filteredTickers.sort();
});

filter.subscribe(() => {
	filteredTickers.filter();
	filteredTickers.sort();
});
