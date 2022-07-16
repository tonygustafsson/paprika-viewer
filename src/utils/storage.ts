import localforage from 'localforage';
import {
	localStorageDatabaseName,
	localStorageFetchTimeTablePrefix,
	localStorageCacheTimeout
} from '../constants';
import type { GlobalMarket, Favorites, Ticker } from 'src/types';

localforage.config({
	name: localStorageDatabaseName,
	storeName: localStorageDatabaseName
});

export const getFromStorage = async (
	table: 'tickers' | 'globalMarket' | 'favorites' | 'columns'
) => {
	if (localStorageCacheTimeout[table] && localStorageCacheTimeout[table] > 0) {
		const fetchTime = (await localforage
			.getItem(`${localStorageFetchTimeTablePrefix}_${table}`)
			.catch(() => {
				// Happens on load when localForage is not ready yet
			})) as number;

		if (fetchTime && Date.now() - fetchTime > localStorageCacheTimeout[table]) {
			// Expire the cache if it's too old
			console.log(`Cache expired for ${table}.`);
			return null;
		}
	}

	console.log(`Fetching ${table} from local storage`);
	const data = await localforage.getItem(table).catch(() => {
		// Happens on load when localForage is not ready yet
	});

	return data;
};

export const saveToStorage = async (
	table: 'tickers' | 'globalMarket' | 'favorites' | 'columns',
	data: Ticker[] | GlobalMarket | Favorites
) => {
	try {
		if (localStorageCacheTimeout[table] && localStorageCacheTimeout[table] > 0) {
			// Set the last time data were saved to storage
			localforage.setItem(`${localStorageFetchTimeTablePrefix}_${table}`, Date.now()).catch(() => {
				// Happens on load when localForage is not ready yet
			});
		}

		console.log(`Saving ${table} to local storage`);

		// Set the data to storage
		localforage.setItem(table, data).catch(() => {
			// Happens on load when localForage is not ready yet
		});
	} catch (error) {
		console.warn(error);
	}
};
