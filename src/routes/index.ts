import Keyv from 'keyv';
import type { Exchanges, GlobalMarket, Market } from 'src/types';

import { apiUrls } from '../constants';
import { getExchangeNameFromUrl } from '../utils/exchanges';

const globalMarketCache = new Keyv({ namespace: 'globalMarket', ttl: 30000 });
const exchangesCache = new Keyv({ namespace: 'exchanges', ttl: 30000 });

const addExchangeData = async (url: string, existingData: Exchanges | undefined = {}) => {
	const data = (await (await fetch(url)).json()) as unknown as Market[];

	if (!data || data.length === 0) {
		return;
	}

	const output = { ...existingData } as Exchanges;
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

	return output;
};

export const getExchangesFromApi = async (endpoint: string) => {
	const cache = await exchangesCache.get(endpoint);

	if (cache) {
		return cache;
	}

	let exchanges: Exchanges = {};

	exchanges = (await addExchangeData(apiUrls.markets.binance, exchanges)) || exchanges;
	exchanges = (await addExchangeData(apiUrls.markets.coinbasePro, exchanges)) || exchanges;
	exchanges = (await addExchangeData(apiUrls.markets.kraken, exchanges)) || exchanges;
	exchanges = (await addExchangeData(apiUrls.markets.kucoin, exchanges)) || exchanges;
	exchanges = (await addExchangeData(apiUrls.markets.okex, exchanges)) || exchanges;

	return exchanges;
};

const getGlobalMarketFromApi = async () => {
	const globalMarket = await fetch(apiUrls.globalMarket);
	const marketJson: GlobalMarket = await globalMarket.json();

	return {
		market_cap_usd: marketJson.market_cap_usd,
		volume_24h_usd: marketJson.volume_24h_usd,
		bitcoin_dominance_percentage: marketJson.bitcoin_dominance_percentage
	};
};

export async function GET({ params }: import('@sveltejs/kit').RequestEvent) {
	const cache = await globalMarketCache.get(params.endpoint);

	if (cache) {
		return cache;
	}

	const [exchanges, globalData] = await Promise.all([
		getExchangesFromApi(params.endpoint),
		getGlobalMarketFromApi()
	]);

	const output = { body: { exchanges, globalData } };

	await globalMarketCache.set(params.endpoint, output);

	return output;
}
