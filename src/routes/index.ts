import Keyv from 'keyv';
import type { GlobalMarket, Ticker } from 'src/types';

import { apiUrls } from '../constants';

const endpointCache = new Keyv({ namespace: 'tickers', ttl: 30000 });

const getTickersFromApi = async () => {
	const tickersResponse = await fetch(apiUrls.tickers);
	const tickersJson: Ticker[] = await tickersResponse.json();

	return tickersJson;
};

const getGlobalMarketFromApi = async () => {
	const globalMarket = await fetch(apiUrls.globalMarket);
	const marketJson: GlobalMarket = await globalMarket.json();

	return marketJson;
};

export async function GET({ params }: import('@sveltejs/kit').RequestEvent) {
	const cache = await endpointCache.get(params.endpoint);

	if (cache) {
		return cache;
	}

	const [tickers, globalData] = await Promise.all([getTickersFromApi(), getGlobalMarketFromApi()]);

	const output = { body: { tickers, globalData: globalData } };

	await endpointCache.set(params.endpoint, output);

	return output;
}
