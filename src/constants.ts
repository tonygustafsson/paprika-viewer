export const apiUrls = {
	tickers: 'https://api.coinpaprika.com/v1/tickers',
	tags: 'https://api.coinpaprika.com/v1/tags?additional_fields=coins',
	globalMarket: 'https://api.coinpaprika.com/v1/global',
	news: `https://cryptopanic.com/api/v1/posts/?auth_token=${
		import.meta.env.VITE_CRYPTO_PANIC_API_KEY
	}&public=true&filter=hot`,
	markets: {
		binance: 'https://api.coinpaprika.com/v1/exchanges/binance/markets',
		coinbasePro: 'https://api.coinpaprika.com/v1/exchanges/coinbase-pro/markets',
		kraken: 'https://api.coinpaprika.com/v1/exchanges/kraken/markets',
		kucoin: 'https://api.coinpaprika.com/v1/exchanges/kucoin/markets',
		okex: 'https://api.coinpaprika.com/v1/exchanges/okex/markets'
	}
};

export const localStorageDatabaseName = 'paprika-viewer';
export const localStorageFavoritesTable = 'favorites';
export const localStorageColumnsTable = 'columns';
export const localStorageFetchTimeTable = 'fetchTime';

export const localStorageCacheTimeout = {
	favorites: 0,
	columns: 0
};
