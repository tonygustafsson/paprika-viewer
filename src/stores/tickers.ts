import type { Ticker } from 'src/types';
import { writable } from 'svelte/store';

const initValue: Ticker[] = [];

const tickersStore = () => {
	const { subscribe, set } = writable(initValue);

	return {
		subscribe,
		save: (data: Ticker[]) => {
			set(data);
		}
	};
};

export const tickers = tickersStore();
