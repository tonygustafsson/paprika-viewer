import { globalMarket } from '../stores/globalMarket';
import { apiUrls, localStorageGlobalMarketTable } from '../constants';
import { getFromStorage, saveToStorage } from '../utils/storage';
import type { GlobalMarket } from 'src/types';

const getGlobalMarketFromApi = async () => {
	const globalMarket = await fetch(apiUrls.globalMarket);
	const marketJson: GlobalMarket = await globalMarket.json();

	return marketJson;
};

export const getGlobalMarket = async () => {
	const globalMarketFromStorage = (await getFromStorage(
		localStorageGlobalMarketTable
	)) as GlobalMarket;

	if (globalMarketFromStorage) {
		// If global markets are saved in localForage, use that
		globalMarket.save(globalMarketFromStorage);
	} else {
		// If it's not stored, get the data from API
		console.log(`Fetching global markets from API.`);
		getGlobalMarketFromApi().then(async (globalMarketsResponse) => {
			globalMarket.save(globalMarketsResponse);

			// Save the API data to localForage
			saveToStorage(localStorageGlobalMarketTable, globalMarketsResponse);
		});
	}
};
