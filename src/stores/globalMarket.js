import { writable } from 'svelte/store';

const initValue = {
    marketCap: '?',
    volume24h: '?',
    btcDominance: '?'
};

const globalMarketStore = () => {
    const { subscribe, set } = writable(initValue);

    return {
        subscribe,
        save: data => {
            const newData = {
                marketCap: data.market_cap_usd,
                volume24h: data.volume_24h_usd,
                btcDominance: data.bitcoin_dominance_percentage
            };

            set(newData);
        }
    };
};

export const globalMarket = globalMarketStore();
