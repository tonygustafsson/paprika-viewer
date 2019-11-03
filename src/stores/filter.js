import { writable } from 'svelte/store';

const initValue = {
    exchange: 'all',
    volume: 'all'
};

const filterStore = () => {
    const { subscribe, update } = writable(initValue);

    return {
        subscribe,
        setExchange: filter => {
            update(filters => {
                let newFilter = { ...filters };
                newFilter.exchange = filter;
                return newFilter;
            });
        },
        setVolume: filter => {
            update(filters => {
                let newFilter = { ...filters };
                newFilter.volume = filter;
                return newFilter;
            });
        }
    };
};

export const filter = filterStore();
