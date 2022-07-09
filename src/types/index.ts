export type Quote = {
	percent_from_price_ath: number;
	market_cap: number;
	market_cap_change_24h: number;
	percent_change_1h: number;
	percent_change_6h?: number;
	percent_change_12h: number;
	percent_change_24h: number;
	percent_change_7d: number;
	percent_change_30d: number;
	percent_change_1y: number;
	price: number;
	volume_24h: number;
};

export type QuoteSimple = {
	price: number;
	volume_24h: number;
};

export type Ticker = {
	circulating_supply?: number;
	id: string;
	exchanges?: string[];
	max_supply?: number;
	name: string;
	symbol: string;
	rank: number;
	volume_24h?: number;
	volume_24_change?: number;
	quotes: Record<'BTC' | 'SEK' | 'USD', Quote>;
};

export type Market = {
	base_currency_id: string;
	base_currency_name: string;
	category: string;
	fee_type: string;
	last_updated: string;
	market_url: string;
	outlier: boolean;
	pair: string;
	quote_currency_id: string;
	quote_currency_name: string;
	quotes: Record<'USD' | 'BTC' | 'SEK', QuoteSimple>;
	reported_volume_24h_share: number;
	trust_score: 'high' | 'medium' | 'low';
};

export type GlobalMarket = {
	bitcoin_dominance_percentage: number;
	cryptocurrencies_number?: number;
	last_updated?: number;
	market_cap_ath_date?: string;
	market_cap_ath_value?: number;
	market_cap_change_24h?: number;
	market_cap_usd: number;
	volume_24h_ath_date?: string;
	volume_24h_ath_value?: number;
	volume_24h_change_24h?: number;
	volume_24h_percent_from_ath?: number;
	volume_24h_percent_to_ath?: number;
	volume_24h_usd: number;
};

export type Exchange = 'binance' | 'coinbasePro' | 'kraken' | 'kucoin' | 'okex';

export type Favorites = Record<string, boolean>;

export type Storage = {
	favorites: Favorites;
	fetchTime_globalMarket: number;
	fetchTime_tickers: number;
	globalMarket: GlobalMarket;
	tickers: Ticker[];
};

export type Currency = 'USD' | 'BTC' | 'SEK';

export type Settings = {
	loading: boolean;
	referenceCurrency: Currency;
	currencySymbol: string;
};

export type SortBy =
	| 'rank'
	| 'name'
	| 'symbol'
	| 'price'
	| 'volume_24h'
	| 'market_cap'
	| 'percent_change_1h'
	| 'percent_change_12h'
	| 'percent_change_24h'
	| 'percent_change_7d'
	| 'percent_change_30d'
	| 'percent_change_1y'
	| 'percent_from_price_ath';
