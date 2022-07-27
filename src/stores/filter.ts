import { writable } from 'svelte/store';

import type { Exchange, MarketCap, Volume } from '../types';

type Filter = {
	exchange: Exchange;
	volume: Volume;
	marketCap: MarketCap;
	favorites: boolean;
};

const initValue: Filter = {
	exchange: 'any',
	volume: -1,
	marketCap: -1,
	favorites: false
};

const filterStore = () => {
	const { subscribe, set, update } = writable(initValue);

	return {
		subscribe,
		setExchange: (filter: Exchange) => update((filters) => ({ ...filters, exchange: filter })),
		setVolume: (filter: Volume) => update((filters) => ({ ...filters, volume: filter })),
		setMarketCap: (filter: MarketCap) => update((filters) => ({ ...filters, marketCap: filter })),
		setFavorites: (filter: boolean) => update((filters) => ({ ...filters, favorites: filter })),
		reset: () => set(initValue)
	};
};

export const filter = filterStore();
