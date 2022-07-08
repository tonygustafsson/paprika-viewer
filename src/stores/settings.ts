import { writable } from 'svelte/store';
import type { Currency, Settings } from 'src/types';

const initValue: Settings = {
	loading: true,
	referenceCurrency: 'USD',
	currencySymbol: '$'
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

				let currencySymbol = '';

				switch (currency) {
					case 'SEK':
						currencySymbol = 'kr';
						break;
					case 'BTC':
						currencySymbol = '₿';
						break;
					default:
						currencySymbol = '$';
				}

				newGlobal.currencySymbol = currencySymbol;
				return newGlobal;
			});
		}
	};
};

export const settings = settingsStore();
