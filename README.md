# Paprika Viewer

Not for use in production. I do have a usecase though where this tool is helpful.

Fetches all cryptocurrencies and their tickers. Also showing which coins are listing on what exchange. Using the fastest sorting algoritm I could find.

I couldn't find any coin helpers out there that could show me all coins and made them sortable while still being able to filter out stupid small projects.

## Tech

Built with svelte.js and is fetching live data from CoinPaprika with client AJAX calls.
Is using only public API so no key is needed.

## Upcoming

-   Making the exchanges info none ugly
-   Cache info in localStorage for some minutes
-   Filtering on market cap and volume

## Get started

```
git clone https://github.com/tonygustafsson/paprika-viewer.git
cd paprika-viewer
npm install
npm run dev
```
