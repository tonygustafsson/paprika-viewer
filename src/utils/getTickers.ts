import { settings } from '../stores/settings';
import { tickers } from '../stores/tickers';
import {
	apiUrls,
	minVolumeToView,
	minMarketCapToView,
	localStorageTickersTable
} from '../constants';
import { getFromStorage, saveToStorage } from '../utils/storage';
import type { Market, Ticker } from 'src/types';

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

const getExchangeNameFromUrl = (url: string) => {
	if (url.includes('binance')) return 'Binance';
	if (url.includes('coinbase')) return 'Coinbase';
	if (url.includes('kraken')) return 'Kraken';
	if (url.includes('kucoin')) return 'Kucoin';
	if (url.includes('okx')) return 'OKEx';
	return 'Unknown';
};

const fetchExchanges = async () =>
	(await Promise.all([
		(await fetch(apiUrls.markets.binance)).json(),
		(await fetch(apiUrls.markets.coinbasePro)).json(),
		(await fetch(apiUrls.markets.kraken)).json(),
		(await fetch(apiUrls.markets.kucoin)).json(),
		(await fetch(apiUrls.markets.okex)).json()
	])) as unknown as Market[][];

const addMarketsToTickers = (tickers: Ticker[], exchanges: Array<Market[]>) => {
	exchanges.forEach((exchange) => {
		exchange.forEach((market) => {
			const ticker = tickers.find((t) => t.id === market.base_currency_id);

			if (!ticker) return;

			if (!ticker.exchanges) ticker.exchanges = [];

			const exchangeName = getExchangeNameFromUrl(market.market_url);

			if (ticker.exchanges.includes(exchangeName)) return;

			ticker.exchanges.push(exchangeName);
		});
	});
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
			const exchanges = await fetchExchanges();
			addMarketsToTickers(tickersResponse, exchanges);

			tickers.save(tickersResponse);
			settings.isLoading(false);

			// Save the API data to localForage
			saveToStorage(localStorageTickersTable, tickersResponse);
		});
	}
};
