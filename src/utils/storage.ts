import localforage from 'localforage';

import {
	localStorageCacheTimeout,
	localStorageDatabaseName,
	localStorageFetchTimeTable
} from '../constants';
import type { Exchanges, Favorites, GlobalMarket, Storage, Tags, Ticker } from '../types';

localforage.config({
	name: localStorageDatabaseName,
	storeName: localStorageDatabaseName
});

type LocalStorageTables = 'favorites' | 'columns';

export const getFromStorage = async (table: LocalStorageTables) => {
	if (localStorageCacheTimeout[table] && localStorageCacheTimeout[table] > 0) {
		const fetchTimes = (await localforage.getItem(localStorageFetchTimeTable).catch(() => {
			// Happens on load when localForage is not ready yet
		})) as Storage['fetchTimes'];

		if (
			!fetchTimes ||
			!fetchTimes[table] ||
			Date.now() - fetchTimes[table] > localStorageCacheTimeout[table]
		) {
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
	table: LocalStorageTables,
	data: Ticker[] | Exchanges | GlobalMarket | Favorites | Tags
) => {
	try {
		const fetchTimes = (await localforage.getItem(localStorageFetchTimeTable).catch(() => {
			// Happens on load when localForage is not ready yet
		})) as Storage['fetchTimes'];

		if (localStorageCacheTimeout[table] && localStorageCacheTimeout[table] > 0) {
			// Set the last time data were saved to storage
			localforage
				.setItem(localStorageFetchTimeTable, { ...fetchTimes, [table]: Date.now() })
				.catch(() => {
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
