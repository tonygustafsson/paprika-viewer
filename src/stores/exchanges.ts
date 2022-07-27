import { localStorageExchangesTable } from '../constants';
import type { Exchanges } from 'src/types';
import { saveToStorage } from '../utils/storage';
import { writable } from 'svelte/store';

const initValue: Exchanges = {};

const exchangesStore = () => {
	const { subscribe, set } = writable(initValue);

	return {
		subscribe,
		save: (data: Exchanges) => set(data)
	};
};

export const exchanges = exchangesStore();

exchanges.subscribe((exchanges) => {
	if (!exchanges || Object.keys(exchanges).length === 0) {
		return;
	}

	saveToStorage(localStorageExchangesTable, exchanges);
});
