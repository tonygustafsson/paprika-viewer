<script>
    import { onMount } from 'svelte';
    import sort from 'fast-sort';

    const debugMode = false;

    const urls = {
        tickers: debugMode ? 'tickers.json' : 'https://api.coinpaprika.com/v1/tickers',
        markets: {
            binance: debugMode ? 'markets-binance.json' : 'https://api.coinpaprika.com/v1/exchanges/binance/markets',
            idex: debugMode ? 'markets-idex.json' : 'https://api.coinpaprika.com/v1/exchanges/idex/markets',
            idax: debugMode ? 'markets-idax.json' : 'https://api.coinpaprika.com/v1/exchanges/idax/markets',
            coinbasePro: debugMode
                ? 'markets-coinbase-pro.json'
                : 'https://api.coinpaprika.com/v1/exchanges/coinbase-pro/markets',
            kraken: debugMode ? 'markets-kraken.json' : 'https://api.coinpaprika.com/v1/exchanges/kraken/markets',
            kucoin: debugMode ? 'markets-kucoin.json' : 'https://api.coinpaprika.com/v1/exchanges/kucoin/markets',
            okex: debugMode ? 'markets-okex.json' : 'https://api.coinpaprika.com/v1/exchanges/okex/markets'
        }
    };

    let tickers = [];
    let sortOrder = 'marketcap';
    let sortOrderDirection = 'desc';

    const addMarketToTickers = async exchange => {
        const response = await fetch(urls.markets[exchange]);
        const markets = await response.json();

        markets.forEach(market => {
            const matchingTicker = tickers.find(x => x.id === market.base_currency_id);

            if (matchingTicker) {
                if (!matchingTicker.exchanges) matchingTicker.exchanges = {};
                matchingTicker.exchanges[exchange] = true;
            }
        });

        return tickers;
    };

    onMount(async () => {
        const tickersResponse = await fetch(urls.tickers);
        tickers = await tickersResponse.json();

        // Remove coins with too low volume
        tickers = tickers.filter(ticker => ticker.quotes.USD.volume_24h > 1000);

        addMarketToTickers('coinbasePro').then(result => (tickers = result));
        addMarketToTickers('binance').then(result => (tickers = result));
        addMarketToTickers('idex').then(result => (tickers = result));
        addMarketToTickers('idax').then(result => (tickers = result));
        addMarketToTickers('kraken').then(result => (tickers = result));
        addMarketToTickers('kucoin').then(result => (tickers = result));
        addMarketToTickers('okex').then(result => (tickers = result));

        orderTickers();
    });

    const changeSortOrder = sortArg => {
        if (sortArg === sortOrder) {
            sortOrderDirection = sortOrderDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortOrderDirection = 'desc';
        }

        sortOrder = sortArg;

        orderTickers();
    };

    const sortTickersByLambda = lambda => {
        if (sortOrderDirection === 'asc') {
            tickers = sort(tickers).asc(lambda);
        } else {
            tickers = sort(tickers).desc(lambda);
        }
    };

    const orderTickers = () => {
        switch (sortOrder) {
            case 'rank':
                sortTickersByLambda(x => x.rank);
                break;
            case 'symbol':
                sortTickersByLambda(x => x.symbol);
                break;
            case 'name':
                sortTickersByLambda(x => x.name);
                break;
            case 'price':
                sortTickersByLambda(x => x.quotes.USD.price);
                break;
            case 'volume_24h':
                sortTickersByLambda(x => x.quotes.USD.volume_24h);
                break;
            case '1h':
                sortTickersByLambda(x => x.quotes.USD.percent_change_1h);
                break;
            case '12h':
                sortTickersByLambda(x => x.quotes.USD.percent_change_12h);
                break;
            case '24h':
                sortTickersByLambda(x => x.quotes.USD.percent_change_24h);
                break;
            case '7d':
                sortTickersByLambda(x => x.quotes.USD.percent_change_7d);
                break;
            case '30d':
                sortTickersByLambda(x => x.quotes.USD.percent_change_30d);
                break;
            case 'ath':
                sortTickersByLambda(x => x.quotes.USD.percent_from_price_ath);
                break;
            default:
                sortTickersByLambda(x => x.quotes.USD.market_cap);
        }
    };
</script>

<style>
    .container {
        width: 80%;
        margin: 0 auto;
    }
    table {
        width: 100%;
    }
    th {
        text-align: left;
        cursor: pointer;
    }
    tr:nth-child(2n + 1) {
        background: #111;
    }
    th,
    td {
        padding: 0.5em 0;
    }
</style>

<div class="container">
    <h1>Paprika Viewer</h1>

    {#if tickers.length > 0}
        <table>
            <tr>
                <th on:click={() => changeSortOrder('rank')}>#</th>
                <th on:click={() => changeSortOrder('symbol')}>Symbol</th>
                <th on:click={() => changeSortOrder('name')}>Name</th>
                <th on:click={() => changeSortOrder('price')}>Price</th>
                <th on:click={() => changeSortOrder('marketcap')}>Marketcap</th>
                <th on:click={() => changeSortOrder('volume_24h')}>Volume 24h</th>
                <th on:click={() => changeSortOrder('1h')}>1h</th>
                <th on:click={() => changeSortOrder('12h')}>12h</th>
                <th on:click={() => changeSortOrder('24h')}>24h</th>
                <th on:click={() => changeSortOrder('7d')}>7d</th>
                <th on:click={() => changeSortOrder('30d')}>30d</th>
                <th on:click={() => changeSortOrder('ath')}>From ATH</th>
                <th>Exchanges</th>
            </tr>

            {#each tickers as ticker}
                <tr>
                    <td>{ticker.rank}</td>
                    <td>{ticker.symbol}</td>
                    <td>{ticker.name}</td>
                    <td>{ticker.quotes.USD.price.toFixed(2)} USD</td>
                    <td>{ticker.quotes.USD.market_cap} USD</td>
                    <td>{ticker.quotes.USD.volume_24h.toFixed(0)} USD</td>
                    <td>{ticker.quotes.USD.percent_change_1h}%</td>
                    <td>{ticker.quotes.USD.percent_change_12h}%</td>
                    <td>{ticker.quotes.USD.percent_change_24h}%</td>
                    <td>{ticker.quotes.USD.percent_change_7d}%</td>
                    <td>{ticker.quotes.USD.percent_change_30d}%</td>
                    <td>{ticker.quotes.USD.percent_from_price_ath}%</td>
                    <td>
                        {#if ticker.exchanges}{Object.keys(ticker.exchanges).join(',')}{/if}
                    </td>
                </tr>
            {/each}
        </table>
    {:else}
        <p>
            <em>Loading...</em>
        </p>
    {/if}
</div>
