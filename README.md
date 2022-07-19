# Paprika Viewer

Showing off all cryptocurrencies, their tickers and which exchange they can be traded at. The latter is really hard to find, so that was the original idea behind this project. Sometimes you just want to see statistics of coins that you actually can trade on your favorite exchange.

Another unusual feature of this site is the ability to see all coins in one single table. The table is sortable, filterable and really fast! No more scrolling to the bottom and going to page 14. You can also select your favorites and filter by them, all without registering on the page.

A special thanks to [CoinPaprika](https://coinpaprika.com/) for providing us with the data.

## Live site / demo

[https://paprika-viewer.vercel.app/](https://paprika-viewer.vercel.app/)

## Features

- Show all coins in one table, without pagination and in a performant way.
- Filtering on exchanges (Binance, CoinBase, Kraken, KuCoin, OKEX), market cap, volume, favorites.
- Choosing a reference currency, USD, BTC or SEK.
- Selectable columns.
- Sorting on rank, symbol, name, price, marketcap, volume, market value change or all time high (ATH).
- Graphs for 24h, 7d, 30d and 1y.
- Global market cap, Bitcoin dominance and total 24h volume.
- Add your favorites and filter for those only.
- Clicking a coin and get more info.
- Mobile support.
- Go directly to CoinPaprika for even each coin for more info.

## Screenshot

![Paprika Viewer](paprika-viewer.png 'Paprika Viewer')

## Tech

Built with [SvelteKit](https://kit.svelte.dev/) and TypeScript. Fetching live data from CoinPaprika with client AJAX calls.
Cache the API data in localForage to avoid adding too much load on CoinPaprika.
Using only public API so no key is needed.

## Get started

```
git clone https://github.com/tonygustafsson/paprika-viewer.git
cd paprika-viewer
npm install
npm run dev
```
