import { writable } from 'svelte/store';

import { localStorageColumnsTable } from '../constants';
import { getFromStorage, saveToStorage } from '../utils/storage';

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
	| 'beta'
	| 'created'
	| 'exchanges'
	| 'tags';

type Columns = Record<Column, boolean>;

const initValue: Columns = {
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
	beta: false,
	created: false,
	tags: false,
	exchanges: true
};

const columnsStore = () => {
	const { subscribe, update, set } = writable(initValue);

	return {
		subscribe,
		set: (columns: Columns) => set(columns),
		toggle: (column: Column) => update((columns) => ({ ...columns, [column]: !columns[column] })),
		add: (column: Column) => update((columns) => ({ ...columns, [column]: true })),
		remove: (column: Column) => update((columns) => ({ ...columns, [column]: false })),
		reset: () => set(initValue)
	};
};

export const columns = columnsStore();

const getColumnsFromStorage = async () => {
	const columnsFromLocaleStorage = (await getFromStorage(localStorageColumnsTable)) as Columns;

	if (columnsFromLocaleStorage) {
		columns.set(columnsFromLocaleStorage);
	}
};

getColumnsFromStorage().then(() => {
	// Auto save changes to storage
	columns.subscribe((columns) => {
		saveToStorage(localStorageColumnsTable, columns);
	});
});
