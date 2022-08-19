import Keyv from 'keyv';
import type { ApiNewsItem, GlobalMarket, NewsItem } from 'src/types';

import { apiUrls } from '../constants';

const ttl = 600000; // 10 minutes
const tagsCache = new Keyv({ namespace: 'news', ttl });

const getNewsFromApi = async () => {
	const news = await fetch(apiUrls.news);
	const newsResponse: ApiNewsItem = await news.json();

	const output: NewsItem[] = (newsResponse.results || []).map((newsItem) => ({
		title: newsItem.title,
		published_at: new Date(newsItem.published_at).toLocaleString('sv-SE', {
			month: '2-digit',
			day: '2-digit',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		}),
		currencies: (newsItem.currencies || []).map((currency) => currency.title),
		url: newsItem.url
	}));

	return output;
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
	const cacheKey = params.endpoint;

	const cache = await tagsCache.get(cacheKey);

	if (cache) {
		return {
			headers: {
				'x-cached': true
			},
			...cache
		};
	}

	let globalData: GlobalMarket | null = null;
	let news: NewsItem[] = [];

	try {
		[news, globalData] = await Promise.all([getNewsFromApi(), getGlobalMarketFromApi()]);
	} catch (error) {
		return {
			message: 'Could not fetch data from CoinPaprika API',
			error
		};
	}

	const output = { body: { news, globalData } };

	await tagsCache.set(cacheKey, output);

	return output;
}
