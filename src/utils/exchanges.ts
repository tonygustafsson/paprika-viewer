export const getExchangeNameFromUrl = (url: string) => {
	if (url.includes('binance')) return 'Binance';
	if (url.includes('coinbase')) return 'Coinbase';
	if (url.includes('kraken')) return 'Kraken';
	if (url.includes('kucoin')) return 'Kucoin';
	if (url.includes('okx')) return 'OKEx';
	return 'Unknown';
};
