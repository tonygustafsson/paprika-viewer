import { writable } from 'svelte/store';

const initValue = {
    market_cap_usd: '?',
    volume_24h_usd: '?',
    bitcoin_dominance_percentage: '?'
};

const globalMarketStore = () => {
    const { subscribe, set } = writable(initValue);

    return {
        subscribe,
        updateAll: data => {
            set(data);
        }
    };
};

export const globalMarket = globalMarketStore();
