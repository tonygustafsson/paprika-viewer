import { global } from '../stores/global';
import { globalMarket } from '../stores/globalMarket';
import {
    apiUrls,
    minVolumeToView,
    minMarketCapToView,
    localStorageExpireTimeoutMs,
    localStorageDatabaseName,
    localStorageGlobalMarketTable,
    localStorageFetchTimeTable
} from '../constants';
import localforage from 'localforage';

localforage.config({
    name: localStorageDatabaseName,
    storeName: localStorageDatabaseName
});

const getGlobalMarketFromApi = async () => {
    const globalMarket = await fetch(apiUrls.globalMarket);
    let marketJson = await globalMarket.json();

    return marketJson;
};

export const getGlobalMarket = () => {
    localforage
        .getItem(localStorageGlobalMarketTable)
        .then(localGlobalMarket => {
            if (localGlobalMarket) {
                // If global markets are saved in localForage, use that
                console.log('Fetching global markets from local storage.');
                globalMarket.updateAll(localGlobalMarket);
            } else {
                // If it's not stored, get the data from API
                console.log(`Fetching global markets from API.`);
                getGlobalMarketFromApi().then(async globalMarketsRes => {
                    globalMarket.updateAll(globalMarketsRes);

                    // Save the API data to localForage
                    localforage.setItem(localStorageGlobalMarketTable, globalMarketsRes);
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
};
