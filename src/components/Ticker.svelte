<script>
    import { selectedTicker } from '../stores/selectedTicker';
    import { favorites } from '../stores/favorites';
    import Favorite from './Favorite.svelte';

    export let ticker;

    const selectTicker = ticker => {
        selectedTicker.set(ticker);
    };
</script>

<style>
    tr:nth-child(2n + 1) {
        background-color: #111;
    }

    td {
        padding: 0.5em;
    }

    a {
        color: #fff;
    }

    .exchanges ul {
        list-style: none;
        padding: 0;
    }

    .graph-img {
        margin: 0 4px 4px 0;
        vertical-align: middle;
    }

    .graph-img.positive {
        filter: hue-rotate(210deg);
    }

    .graph-img.negative {
        filter: hue-rotate(115deg);
    }
</style>

<tr>
    <td>
        {ticker.rank}
        <Favorite tickerSymbol={ticker.symbol} />
    </td>
    <td>
        <a href on:click|preventDefault={() => selectTicker(ticker)}>{ticker.symbol}</a>
    </td>
    <td>
        <a href on:click|preventDefault={() => selectTicker(ticker)}>{ticker.name}</a>
    </td>
    <td>${ticker.usd.price}</td>
    <td>${ticker.usd.marketCap}</td>
    <td>${ticker.usd.volume24h.toFixed(0)}</td>
    <td>{ticker.usd.change1h}%</td>
    <td>{ticker.usd.change12h}%</td>
    <td>{ticker.usd.change24h}%</td>
    <td>
        <img
            loading="lazy"
            class="graph-img"
            class:positive={ticker.usd.change7d >= 0}
            class:negative={ticker.usd.change7d < 0}
            width="120"
            height="23"
            src="https://graphs{Math.random() > 0.5 ? '2' : ''}.coinpaprika.com/currency/chart/{ticker.id}/7d/chart.svg"
            alt="" />
        {ticker.usd.change7d}%
    </td>
    <td>{ticker.usd.change30d}%</td>
    <td>{ticker.usd.fromAth}%</td>
    <td class="exchanges">
        {#if ticker.exchanges}
            <ul>
                {#each ticker.exchanges as exchange}
                    <li>{exchange}</li>
                {/each}
            </ul>
        {/if}
    </td>
</tr>
