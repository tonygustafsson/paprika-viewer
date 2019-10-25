<script>
    import { onMount } from 'svelte';
    import sort from 'fast-sort';
    import { debugMode, apiUrls, debugApiUrls } from './constants';
    import { addMarketToTickers } from './marketsMap';

    const urls = debugMode ? debugApiUrls : apiUrls;

    let tickers = [];
    let sortOrder = 'marketcap';
    let sortOrderDirection = 'desc';

    onMount(async () => {
        const tickersResponse = await fetch(urls.tickers);
        tickers = await tickersResponse.json();

        // Remove coins with too low volume
        tickers = tickers.filter(ticker => ticker.quotes.USD.volume_24h > 1000);

        addMarketToTickers(tickers, 'coinbasePro').then(result => (tickers = result));
        addMarketToTickers(tickers, 'binance').then(result => (tickers = result));
        addMarketToTickers(tickers, 'idex').then(result => (tickers = result));
        addMarketToTickers(tickers, 'idax').then(result => (tickers = result));
        addMarketToTickers(tickers, 'kraken').then(result => (tickers = result));
        addMarketToTickers(tickers, 'kucoin').then(result => (tickers = result));
        addMarketToTickers(tickers, 'okex').then(result => (tickers = result));

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
