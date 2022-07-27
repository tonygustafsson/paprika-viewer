import { exchanges } from '../stores/exchanges';
import { apiUrls, localStorageExchangesTable } from '../constants';
import type { Exchanges, Market } from 'src/types';
import { get } from 'svelte/store';
import { getFromStorage } from './storage';

const getExchangeNameFromUrl = (url: string) => {
	if (url.includes('binance')) return 'Binance';
	if (url.includes('coinbase')) return 'Coinbase';
	if (url.includes('kraken')) return 'Kraken';
	if (url.includes('kucoin')) return 'Kucoin';
	if (url.includes('okx')) return 'OKEx';
	return 'Unknown';
};

const addExchangeData = async (url: string) => {
	const data = (await (await fetch(url)).json()) as unknown as Market[];

	if (!data || data.length === 0) {
		return;
	}

	const $exchanges = get(exchanges);
	const output = { ...$exchanges } as Exchanges;
	const exchangeName = getExchangeNameFromUrl(data[0].market_url);

	data.forEach((market) => {
		if (!output[market.base_currency_id]) {
			output[market.base_currency_id] = [];
		}

		if (output[market.base_currency_id].includes(exchangeName)) {
			return;
		}

		output[market.base_currency_id].push(exchangeName);
	});

	exchanges.save(output);
};

export const getExchanges = async () => {
	const exchangesFromStorage = (await getFromStorage(localStorageExchangesTable)) as Exchanges;

	if (exchangesFromStorage) {
		return exchanges.save(exchangesFromStorage);
	}

	addExchangeData(apiUrls.markets.binance);
	addExchangeData(apiUrls.markets.coinbasePro);
	addExchangeData(apiUrls.markets.kraken);
	addExchangeData(apiUrls.markets.kucoin);
	addExchangeData(apiUrls.markets.okex);
};
