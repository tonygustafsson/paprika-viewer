import localforage from 'localforage';
import { localStorageDatabaseName, localStorageFetchTimeTablePrefix, localStorageCacheTimeout } from '../constants';

localforage.config({
    name: localStorageDatabaseName,
    storeName: localStorageDatabaseName
});

export const getFromStorage = async table => {
    if (localStorageCacheTimeout[table] && localStorageCacheTimeout[table] > 0) {
        const fetchTime = await localforage.getItem(`${localStorageFetchTimeTablePrefix}_${table}`);

        if (fetchTime && Date.now() - fetchTime > localStorageCacheTimeout[table]) {
            // Expire the cache if it's too old
            console.log(`Cache expired for ${table}.`);
            return null;
        }
    }

    console.log(`Fetching ${table} from local storage`);
    const data = await localforage.getItem(table);

    return data;
};

export const saveToStorage = async (table, data) => {
    if (localStorageCacheTimeout[table] && localStorageCacheTimeout[table] > 0) {
        // Set the last time data were saved to storage
        localforage.setItem(`${localStorageFetchTimeTablePrefix}_${table}`, Date.now());
    }

    console.log(`Saving ${table} to local storage`);

    // Set the data to storage
    localforage.setItem(table, data);
};
