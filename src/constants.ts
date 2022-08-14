export const apiUrls = {
	tickers: 'https://api.coinpaprika.com/v1/tickers',
	tags: 'https://api.coinpaprika.com/v1/tags?additional_fields=coins',
	globalMarket: 'https://api.coinpaprika.com/v1/global',
	markets: {
		binance: 'https://api.coinpaprika.com/v1/exchanges/binance/markets',
		coinbasePro: 'https://api.coinpaprika.com/v1/exchanges/coinbase-pro/markets',
		kraken: 'https://api.coinpaprika.com/v1/exchanges/kraken/markets',
		kucoin: 'https://api.coinpaprika.com/v1/exchanges/kucoin/markets',
		okex: 'https://api.coinpaprika.com/v1/exchanges/okex/markets'
	}
};

export const localStorageDatabaseName = 'paprika-viewer';
export const localStorageTickersTable = 'tickers';
export const localStorageExchangesTable = 'exchanges';
export const localStorageGlobalMarketTable = 'globalMarket';
export const localStorageTagsTable = 'tags';
export const localStorageFavoritesTable = 'favorites';
export const localStorageColumnsTable = 'columns';
export const localStorageFetchTimeTable = 'fetchTime';

export const localStorageCacheTimeout = {
	tickers: 5 * 60 * 1000, // 5 minutes,
	exchanges: 4 * 60 * 60 * 1000, // 4 hours,
	globalMarket: 60 * 60 * 1000, // 1 hour,
	tags: 24 * 60 * 60 * 1000, // 24 hours,
	favorites: 0,
	columns: 0
};
