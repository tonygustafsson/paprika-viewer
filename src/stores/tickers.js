import { writable } from 'svelte/store';

const initValue = [];

const tickersStore = () => {
    const { subscribe, set } = writable(initValue);

    return {
        subscribe,
        updateAll: data => {
            set(data);
        }
    };
};

export const tickers = tickersStore();
