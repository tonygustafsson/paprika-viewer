import type { Volume } from '../types';

export const volumeToHuman = (volume: Volume) => {
	switch (volume.toString()) {
		case '0': {
			return '0 - 100k';
		}
		case '100000': {
			return '100k - 250k';
		}
		case '250000': {
			return '250k - 500k';
		}
		case '500000': {
			return '500k - 1m';
		}
		case '1000000': {
			return '1m - 5m';
		}
		case '5000000': {
			return '5m - 10m';
		}
		case '10000000': {
			return '10m - 20m';
		}
		case '20000000': {
			return '20m - 50m';
		}
		case '50000000': {
			return '50m+';
		}
		default: {
			return 'All';
		}
	}
};

export const getDecimalsForPrice = (price: number | string) => {
	if (price > 1) return Number(price).toFixed(2);
	if (price < 0.001) return Number(price).toFixed(8);

	return Number(price).toFixed(6);
};

export const priceToHuman = (price: number = 0) => {
	if (price > 1_000_000_000_000) {
		return `${(price / 1_000_000_000_000).toFixed(2)} T`;
	}
	if (price > 1_000_000_000) {
		return `${(price / 1_000_000_000).toFixed(2)} B`;
	}
	if (price > 1_000_000) {
		return `${(price / 1_000_000).toFixed(2)} M`;
	}
	return price.toLocaleString();
};
