import type { Ticker } from 'src/types';
import { writable } from 'svelte/store';

const initValue = null;

const selectedTickerStore = () => {
	const { subscribe, set } = writable<Ticker | null>(initValue);

	return {
		subscribe,
		set: (ticker: Ticker | null) => set(ticker)
	};
};

export const selectedTicker = selectedTickerStore();
