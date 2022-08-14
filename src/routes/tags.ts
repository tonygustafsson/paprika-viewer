import Keyv from 'keyv';
import type { ApiTag, Tags } from 'src/types';

import { apiUrls } from '../constants';

const tagsCache = new Keyv({ namespace: 'tags', ttl: 30000 });

const getTagsFromApi = async () => {
	const tags = await fetch(apiUrls.tags);
	const tagsResponse: ApiTag[] = await tags.json();

	const tickersOutput = {} as Tags['tickers'];
	const listOutput = [] as Tags['list'];

	tagsResponse.forEach((tag) => {
		listOutput.push(tag.name);

		(tag.coins || []).forEach((coin) => {
			if (!tickersOutput[coin]) {
				tickersOutput[coin] = [];
			}

			if (tickersOutput[coin].includes(tag.name)) {
				return;
			}

			tickersOutput[coin].push(tag.name);
		});
	});

	return { list: listOutput, tickers: tickersOutput };
};

export async function GET({ params }: import('@sveltejs/kit').RequestEvent) {
	const cacheKey = params.endpoint;

	const cache = await tagsCache.get(cacheKey);

	if (cache) {
		return cache;
	}

	const { list, tickers } = await getTagsFromApi();

	const output = { body: { list, tickers } };

	await tagsCache.set(cacheKey, output);

	return output;
}
