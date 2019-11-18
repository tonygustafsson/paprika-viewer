import { writable } from 'svelte/store';

const initValue = {
    exchange: 'any',
    volume: 'all',
    marketCap: 'all',
    favorites: false
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
        setFavorites: filter => {
            update(filters => {
                let newFilter = { ...filters };
                newFilter.favorites = filter;
                return newFilter;
            });
        },
        reset: () => {
            set(initValue);
        }
    };
};

export const filter = filterStore();
