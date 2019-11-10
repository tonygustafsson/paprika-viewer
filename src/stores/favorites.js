import { writable } from 'svelte/store';
import { localStorageFavoritesTable } from '../constants';
import { getFromStorage, saveToStorage } from '../utils/storage';

const initValue = {};

const favoritesStore = () => {
    const { subscribe, set, update } = writable(initValue);

    return {
        subscribe,
        updateAll: data => {
            set(data);
        },
        toggle: symbol => {
            update(favorites => {
                let newFavs = { ...favorites };

                if (newFavs[symbol]) {
                    delete newFavs[symbol];
                } else {
                    newFavs[symbol] = true;
                }

                return newFavs;
            });
        }
    };
};

export const favorites = favoritesStore();

const getFavoritesFromStorage = async () => {
    const favs = await getFromStorage(localStorageFavoritesTable);

    if (favs) {
        favorites.updateAll(favs);
    }
};

getFavoritesFromStorage().then(() => {
    // Auto save changes to storage
    favorites.subscribe(favs => {
        saveToStorage(localStorageFavoritesTable, favs);
    });
});
