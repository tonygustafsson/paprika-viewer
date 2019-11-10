import { writable } from 'svelte/store';

const initValue = {};

const favoritesStore = () => {
    const { subscribe, set, update } = writable(initValue);

    return {
        subscribe,
        toggle: symbol => {
            update(favorites => {
                let newFavs = { ...favorites };
                newFavs[symbol] = !newFavs[symbol];
                return newFavs;
            });
        }
    };
};

export const favorites = favoritesStore();
