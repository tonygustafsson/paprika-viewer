import type { Exchange, MarketCap, Volume } from 'src/types';
import { writable } from 'svelte/store';

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
		setExchange: (filter: Exchange) => {
			update((filters) => {
				const newFilter = { ...filters };
				newFilter.exchange = filter;
				return newFilter;
			});
		},
		setVolume: (filter: Volume) => {
			update((filters) => {
				const newFilter = { ...filters };
				newFilter.volume = filter;
				return newFilter;
			});
		},
		setMarketCap: (filter: MarketCap) => {
			update((filters) => {
				const newFilter = { ...filters };
				newFilter.marketCap = filter;
				return newFilter;
			});
		},
		setFavorites: (filter: boolean) => {
			update((filters) => {
				const newFilter = { ...filters };
				newFilter.favorites = filter;
				return newFilter;
			});
		},
		reset: () => {
			set(initValue);
		}
	};
};

export const filter = filterStore();
