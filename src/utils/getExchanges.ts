import { exchanges } from '../stores/exchanges';
import { apiUrls, localStorageExchangesTable } from '../constants';
import type { Exchanges, Market } from 'src/types';
import { getFromStorage, saveToStorage } from './storage';

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

export const getExchanges = async () => {
	const exchangesFromStorage = (await getFromStorage(localStorageExchangesTable)) as Exchanges;

	if (exchangesFromStorage) {
		return exchanges.save(exchangesFromStorage);
	}

	const exchangesResponse = await fetchExchanges();
	const simpleExchanges: Exchanges = {};

	exchangesResponse.forEach((exchange) => {
		if (!exchange || exchange.length === 0) {
			return;
		}

		exchange.forEach((market) => {
			const exchangeName = getExchangeNameFromUrl(market.market_url);

			if (!simpleExchanges[market.base_currency_id]) {
				simpleExchanges[market.base_currency_id] = [];
			}

			if (simpleExchanges[market.base_currency_id].includes(exchangeName)) {
				return;
			}

			simpleExchanges[market.base_currency_id].push(exchangeName);
		});
	});

	exchanges.save(simpleExchanges);
	saveToStorage(localStorageExchangesTable, simpleExchanges);
};
