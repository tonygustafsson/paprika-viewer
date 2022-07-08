import type { Ticker } from 'src/types';
import { writable, get } from 'svelte/store';
import { settings } from './settings';

const initValue: Ticker[] = [];

const $settings = get(settings);
const refCurrency = $settings.referenceCurrency;

const getDecimalsForPrice = (price: number) => {
	if (price > 1) return price.toFixed(2);
	if (price < 0.001) return price.toFixed(8);

	return price.toFixed(6);
};

const getQuotes = (ticker: Ticker) => {
	return {
		...ticker,
		quotes: {
			...ticker.quotes,
			[refCurrency]: {
				...ticker.quotes[refCurrency],
				price: getDecimalsForPrice(ticker.quotes[refCurrency].price)
			}
		}
	};
};

const tickersStore = () => {
	const { subscribe, set } = writable(initValue);

	return {
		subscribe,
		save: (data: Ticker[]) => {
			set(data.map(getQuotes));
		}
	};
};

export const tickers = tickersStore();
