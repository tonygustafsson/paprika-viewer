import {
	apiUrls,
	localStorageTickersTable,
	minMarketCapToView,
	minVolumeToView
} from '../constants';
import { settings } from '../stores/settings';
import { tickers } from '../stores/tickers';
import type { Ticker } from '../types';
import { getFromStorage, saveToStorage } from '../utils/storage';

const getTickersFromApi = async () => {
	const tickersResponse = await fetch(apiUrls.tickers);
	let tickersJson: Ticker[] = await tickersResponse.json();

	// Remove coins with too low volume
	tickersJson = tickersJson.filter(
		(ticker: Ticker) => ticker.quotes.USD.volume_24h > minVolumeToView
	);

	// Remove coins with too low marketcap
	tickersJson = tickersJson.filter(
		(ticker: Ticker) => ticker.quotes.USD.market_cap > minMarketCapToView
	);

	return tickersJson;
};

export const getTickers = async () => {
	const tickersFromStorage = (await getFromStorage(localStorageTickersTable)) as Ticker[];

	if (tickersFromStorage) {
		// If tickers are saved in localForage, use that
		tickers.save(tickersFromStorage);
		settings.isLoading(false);
	} else {
		// If it's not stored, get the data from API
		console.log(`Fetching tickers from API.`);

		getTickersFromApi().then(async (tickersResponse) => {
			tickers.save(tickersResponse);
			settings.isLoading(false);

			// Save the API data to localForage
			saveToStorage(localStorageTickersTable, tickersResponse);
		});
	}
};
