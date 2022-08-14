import type { Currency } from 'src/types';

import { settings } from '../stores/settings';
import { tickers as tickersStore } from '../stores/tickers';

export const getTickers = async (currency: Currency) => {
	const tickers = await (await fetch(`/tickers?currency=${currency}`)).json();

	tickersStore.save(tickers);
	settings.isLoading(false);
};
