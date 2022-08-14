import { tags as tagsStore } from '../stores/tags';

export const getTags = async () => {
	const tags = await (await fetch(`/tags`)).json();

	tagsStore.saveTickerTags(tags.tickers);
	tagsStore.saveList(tags.list);
};
