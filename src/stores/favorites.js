import { writable } from 'svelte/store';

const initValue = [];

const favoritesStore = () => {
    const { subscribe, set, update } = writable(initValue);

    return {
        subscribe,
        add: symbol => {
            update(favorites => {
                let newFavs = { ...favorites };
                newFavs.push(symbol);
                return newFavs;
            });
        }
    };
};

export const favorites = favoritesStore();
