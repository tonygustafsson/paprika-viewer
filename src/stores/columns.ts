import { writable } from 'svelte/store';
import type { SortBy } from 'src/types';

type Column =
	| 'rank'
	| 'symbol'
	| 'name'
	| 'price'
	| 'marketcap'
	| 'volume_24h'
	| 'change_1h'
	| 'change_12h'
	| 'change_24h'
	| 'change_7d'
	| 'change_30d'
	| 'change_1y'
	| 'ath'
	| 'exchanges';

const initValue: Record<Column, boolean> = {
	rank: true,
	symbol: true,
	name: true,
	price: true,
	marketcap: true,
	volume_24h: true,
	change_1h: false,
	change_12h: false,
	change_24h: true,
	change_7d: true,
	change_30d: true,
	change_1y: false,
	ath: false,
	exchanges: true
};

const columnsStore = () => {
	const { subscribe, update, set } = writable(initValue);

	return {
		subscribe,
		toggle: (column: Column) => update((columns) => ({ ...columns, [column]: !columns[column] })),
		add: (column: Column) => update((columns) => ({ ...columns, [column]: true })),
		remove: (column: Column) => update((columns) => ({ ...columns, [column]: false })),
		reset: () => set(initValue)
	};
};

export const columns = columnsStore();
