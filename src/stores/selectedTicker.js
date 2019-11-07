import { writable } from 'svelte/store';

const initValue = null;

const selectedTickerStore = () => {
    const { subscribe, set } = writable(initValue);

    return {
        subscribe,
        set: ticker => {
            set(ticker);
        }
    };
};

export const selectedTicker = selectedTickerStore();
