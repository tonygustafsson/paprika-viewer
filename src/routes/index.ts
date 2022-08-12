import Keyv from 'keyv';
import type { GlobalMarket } from 'src/types';

import { apiUrls } from '../constants';

const endpointCache = new Keyv({ namespace: 'tickers', ttl: 30000 });

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
	const cache = await endpointCache.get(params.endpoint);

	if (cache) {
		return cache;
	}

	const [globalData] = await Promise.all([getGlobalMarketFromApi()]);

	const output = { body: { globalData } };

	await endpointCache.set(params.endpoint, output);

	return output;
}
