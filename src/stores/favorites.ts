import { writable } from 'svelte/store';
import { localStorageFavoritesTable } from '../constants';
import { getFromStorage, saveToStorage } from '../utils/storage';
import type { Favorites } from 'src/types';

const initValue: Favorites = {};

const favoritesStore = () => {
	const { subscribe, set, update } = writable(initValue);

	return {
		subscribe,
		updateAll: (data: Favorites) => {
			set(data);
		},
		toggle: (symbol: string) => {
			update((favorites) => {
				const newFavs: Favorites = { ...favorites };

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
	const favs = (await getFromStorage(localStorageFavoritesTable)) as Favorites;

	if (favs) {
		favorites.updateAll(favs);
	}
};

getFavoritesFromStorage().then(() => {
	// Auto save changes to storage
	favorites.subscribe((favs) => {
		saveToStorage(localStorageFavoritesTable, favs);
	});
});
