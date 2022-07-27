import { writable } from 'svelte/store';

import type { SortBy } from '../types';

type Sort = {
	by: SortBy;
	direction: 'asc' | 'desc';
};

const initValue: Sort = {
	by: 'rank',
	direction: 'asc'
};

const sortStore = () => {
	const { subscribe, update, set } = writable(initValue);

	return {
		subscribe,
		set: (sortBy: SortBy) =>
			update((sort) => ({
				by: sortBy,
				direction: sort.direction === 'asc' ? 'desc' : 'asc'
			})),
		reset: () => set(initValue)
	};
};

export const sort = sortStore();
