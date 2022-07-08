export const apiUrls = {
	tickers: 'https://api.coinpaprika.com/v1/tickers?quotes=USD,SEK,BTC',
	globalMarket: 'https://api.coinpaprika.com/v1/global',
	markets: {
		binance: 'https://api.coinpaprika.com/v1/exchanges/binance/markets',
		idex: 'https://api.coinpaprika.com/v1/exchanges/idex/markets',
		coinbasePro: 'https://api.coinpaprika.com/v1/exchanges/coinbase-pro/markets',
		kraken: 'https://api.coinpaprika.com/v1/exchanges/kraken/markets',
		kucoin: 'https://api.coinpaprika.com/v1/exchanges/kucoin/markets',
		okex: 'https://api.coinpaprika.com/v1/exchanges/okex/markets',
		uniswap: 'https://api.coinpaprika.com/v1/exchanges/uniswap/markets'
	}
};

export const minVolumeToView = 100; // USD
export const minMarketCapToView = 1000; // USD
export const localStorageDatabaseName = 'paprika-viewer';
export const localStorageTickersTable = 'tickers';
export const localStorageGlobalMarketTable = 'globalMarket';
export const localStorageFavoritesTable = 'favorites';
export const localStorageFetchTimeTablePrefix = 'fetchTime';

export const localStorageCacheTimeout = {
	tickers: 5 * 60 * 1000, // 5 minutes,
	globalMarket: 5 * 60 * 1000, // 5 minutes,
	favorites: 0
};
