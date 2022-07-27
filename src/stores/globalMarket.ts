import { writable } from 'svelte/store';

import type { GlobalMarket } from '../types';

const initValue: GlobalMarket = {
	market_cap_usd: 0,
	volume_24h_usd: 0,
	bitcoin_dominance_percentage: 0
};

const globalMarketStore = () => {
	const { subscribe, set } = writable(initValue);

	return {
		subscribe,
		save: (data: GlobalMarket) => set(data)
	};
};

export const globalMarket = globalMarketStore();
