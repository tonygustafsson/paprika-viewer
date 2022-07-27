import type { MarketCap } from '../types';

export const marketCapToHuman = (marketCap: MarketCap) => {
	switch (marketCap.toString()) {
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
