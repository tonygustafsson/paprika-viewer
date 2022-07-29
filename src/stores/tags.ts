import { writable } from 'svelte/store';

import type { Tags } from '../types';

const initValue: Tags = {
	tickers: {},
	list: []
};

const TagsStore = () => {
	const { subscribe, update } = writable(initValue);

	return {
		subscribe,
		saveTickerTags: (data: Tags['tickers']) => update((tags) => ({ ...tags, tickers: data })),
		saveList: (data: Tags['list']) => update((tags) => ({ ...tags, list: data }))
	};
};

export const tags = TagsStore();
