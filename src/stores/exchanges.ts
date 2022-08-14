import { writable } from 'svelte/store';

import type { Exchanges } from '../types';

const initValue: Exchanges = {};

const exchangesStore = () => {
	const { subscribe, set } = writable(initValue);

	return {
		subscribe,
		save: (data: Exchanges) => set(data)
	};
};

export const exchanges = exchangesStore();
