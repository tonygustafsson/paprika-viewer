import { writable } from 'svelte/store';
import type { Currency, Settings } from 'src/types';

const initValue: Settings = {
	loading: true,
	referenceCurrency: 'USD',
	currencyPrefix: '$',
	currencySuffix: undefined
};

const settingsStore = () => {
	const { subscribe, update } = writable(initValue);

	return {
		subscribe,
		isLoading: (isLoading: boolean) => {
			update((global) => {
				const newGlobal = { ...global };
				newGlobal.loading = isLoading;
				return newGlobal;
			});
		},
		setReferenceCurrency: (currency: Currency) => {
			if (currency !== 'USD' && currency !== 'SEK' && currency !== 'BTC') {
				return;
			}

			update((global) => {
				const newGlobal = { ...global };
				newGlobal.referenceCurrency = currency;

				let currencyPrefix: Settings['currencyPrefix'] = undefined;
				let currencySuffix: Settings['currencySuffix'] = undefined;

				switch (currency) {
					case 'SEK':
						currencySuffix = 'kr';
						break;
					case 'BTC':
						currencyPrefix = '₿';
						break;
					default:
						currencyPrefix = '$';
				}

				newGlobal.currencyPrefix = currencyPrefix;
				newGlobal.currencySuffix = currencySuffix;
				return newGlobal;
			});
		}
	};
};

export const settings = settingsStore();
