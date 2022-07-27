import { writable } from 'svelte/store';

import type { Ticker } from '../types';

const initValue: Ticker[] = [];

const tickersStore = () => {
	const { subscribe, set } = writable(initValue);

	return {
		subscribe,
		save: (data: Ticker[]) => set(data)
	};
};

export const tickers = tickersStore();
