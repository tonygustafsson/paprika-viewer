import Keyv from 'keyv';
import type { Currency, Ticker, TickerApi } from 'src/types';

import { apiUrls } from '../constants';

const tickersCache = new Keyv({ namespace: 'tickers', ttl: 30000 });

export const getTickersFromApi = async (currency: Currency) => {
	const tickersResponse = await fetch(`${apiUrls.tickers}?quotes=${currency}`);
	const tickersJson: TickerApi[] = await tickersResponse.json();

	const output: Ticker[] = tickersJson.map((ticker) => ({
		beta: parseFloat(ticker.beta_value.toFixed(2)),
		supply: ticker.circulating_supply || 0,
		created: ticker.first_data_at,
		id: ticker.id,
		max_supply: ticker.max_supply || 0,
		name: ticker.name,
		rank: ticker.rank,
		symbol: ticker.symbol,
		mcap: ticker.quotes[currency].market_cap,
		change_12h: ticker.quotes[currency].percent_change_12h,
		change_1h: ticker.quotes[currency].percent_change_1h,
		change_1y: ticker.quotes[currency].percent_change_1y,
		change_24h: ticker.quotes[currency].percent_change_24h,
		change_30d: ticker.quotes[currency].percent_change_30d,
		change_7d: ticker.quotes[currency].percent_change_7d,
		from_ath: ticker.quotes[currency].percent_from_price_ath,
		price: parseFloat(ticker.quotes[currency].price.toFixed(6)),
		volume_24h: parseInt(ticker.quotes[currency].volume_24h.toFixed(0))
	}));

	return output;
};

export async function GET({ params, url }: import('@sveltejs/kit').RequestEvent) {
	const searchParams = new URLSearchParams(url.search);
	const currency = searchParams.get('currency') || 'USD';
	const cacheKey = `${params.endpoint}_${currency}`;

	const cache = await tickersCache.get(cacheKey);

	if (cache) {
		return cache;
	}

	const tickers = await getTickersFromApi(currency as Currency);

	const output = { body: tickers };

	await tickersCache.set(cacheKey, output);

	return output;
}
