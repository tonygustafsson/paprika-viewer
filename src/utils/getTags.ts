import { apiUrls, localStorageTagsTable } from '../constants';
import { tags } from '../stores/tags';
import type { ApiTag, Tags } from '../types';
import { getFromStorage, saveToStorage } from './storage';

const getTagsFromApi = async () => {
	const tags = await fetch(apiUrls.tags);
	const tagsJson: ApiTag[] = await tags.json();

	return tagsJson;
};

export const getTags = async () => {
	const tagsFromStorage = (await getFromStorage(localStorageTagsTable)) as Tags;

	if (tagsFromStorage) {
		// If global markets are saved in localForage, use that
		tags.saveTickerTags(tagsFromStorage.tickers);
		tags.saveList(tagsFromStorage.list);
	} else {
		// If it's not stored, get the data from API
		console.log(`Fetching tags from API.`);
		getTagsFromApi().then(async (tagsResponse) => {
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

			tags.saveTickerTags(tickersOutput);
			tags.saveList(listOutput);

			// Save the API data to localForage
			saveToStorage(localStorageTagsTable, { tickers: tickersOutput, list: listOutput });
		});
	}
};
