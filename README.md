# Paprika Viewer

Fetches all cryptocurrencies and their tickers. Also showing which coins are listing on what exchange in the same view. This is useful since no other coin trackers are giving this ability. I often try to find coins that has gone +25% or -25% in a day, but I'm not interested in coins I cannot buy or coins with a volume that is too low.

IDEX for instance is nice, but don't give us the ability to see winners and loosers over a week. Also most of their markets has such low volume that it's often a bad buy.

Since all coins are listed in one table, it takes a second or two to sort them. I'm using the fastest sorting algoritm I could find, but I will try to improve on this.

This project is in a really early stage, Please use it as you wish, but there are no hosted site yet.

## Tech

Built with svelte.js and is fetching live data from CoinPaprika with client AJAX calls.
Cache the API data in localForage to avoid adding too much load on CoinPaprika.
Using only public API so no key is needed.

## Screenshot

![Paprika Viewer](paprika-viewer.png 'Paprika Viewer')

## Features

-   Show all coins in one view
-   Filtering on exchanges, market cap, volume
-   Sorting on rank, symbol, name, price, marketcap, volume, market value change or all time high (ATH)
-   Listing which exchanges provide each coin on all coins at the same time
-   Graphs for 7d. Clicking on coins gives graphs for 24h, 7d and 30d
-   Global market cap, Bitcoin dominance and total 24h volume
-   Add your favorites and filter for those only
-   Go directly to CoinPaprika for each coin for more info

## Get started

```
git clone https://github.com/tonygustafsson/paprika-viewer.git
cd paprika-viewer
npm install
npm run dev
```
