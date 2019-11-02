export const apiUrls = {
    tickers: 'https://api.coinpaprika.com/v1/tickers',
    markets: {
        binance: 'https://api.coinpaprika.com/v1/exchanges/binance/markets',
        idex: 'https://api.coinpaprika.com/v1/exchanges/idex/markets',
        idax: 'https://api.coinpaprika.com/v1/exchanges/idax/markets',
        coinbasePro: 'https://api.coinpaprika.com/v1/exchanges/coinbase-pro/markets',
        kraken: 'https://api.coinpaprika.com/v1/exchanges/kraken/markets',
        kucoin: 'https://api.coinpaprika.com/v1/exchanges/kucoin/markets',
        okex: 'https://api.coinpaprika.com/v1/exchanges/okex/markets'
    }
};

export const minVolumeToView = 1000; // USD
export const minMarketCapToView = 100000; // USD
export const localStorageExpireTimeoutMs = 5 * 60 * 1000; // 5 minutes
export const localStorageDatabaseName = 'paprika-viewer';
export const localStorageTickersTable = 'tickers';
export const localStorageFetchTimeTable = 'fetchTime';
