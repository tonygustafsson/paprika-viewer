import { writable } from 'svelte/store';

const initValue = {
    exchange: 'all',
    volume: 'all',
    marketCap: 'all'
};

const filterStore = () => {
    const { subscribe, set, update } = writable(initValue);

    return {
        subscribe,
        update: filter => {
            update(filters => {
                let newFilter = { ...filters };
                newFilter.exchange = filter;
                return newFilter;
            });
        },
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
        },
        setMarketCap: filter => {
            update(filters => {
                let newFilter = { ...filters };
                newFilter.marketCap = filter;
                return newFilter;
            });
        },
        reset: () => {
            set(initValue);
        }
    };
};

export const filter = filterStore();
