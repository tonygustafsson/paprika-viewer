<script>
    import { selectedTicker } from '../stores/selectedTicker';
    import { favorites } from '../stores/favorites';

    export let ticker;

    const selectTicker = ticker => {
        selectedTicker.set(ticker);
    };

    const toggleFavorite = symbol => {
        favorites.toggle(symbol);
    };
</script>

<style>
    tr:nth-child(2n + 1) {
        background: #111;
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

    .favorite {
        font-size: 250%;
        margin: 0 auto;
        display: block;
        text-align: center;
        cursor: pointer;
    }

    @media screen and (min-width: 1000px) {
        .favorite {
            display: inline-block;
            vertical-align: sub;
            margin-left: 0.25em;
        }
    }
</style>

<tr>
    <td>
        {ticker.rank}
        <span on:click={() => toggleFavorite(ticker.symbol)} class="favorite">
            {#if $favorites[ticker.symbol]}★{:else}☆{/if}
        </span>
    </td>
    <td>
        <a href on:click|preventDefault={() => selectTicker(ticker)}>{ticker.symbol}</a>
    </td>
    <td>
        <a href on:click|preventDefault={() => selectTicker(ticker)}>{ticker.name}</a>
    </td>
    <td>${ticker.quotes.USD.price.toFixed(2)}</td>
    <td>${ticker.quotes.USD.market_cap}</td>
    <td>${ticker.quotes.USD.volume_24h.toFixed(0)}</td>
    <td>{ticker.quotes.USD.percent_change_1h}%</td>
    <td>{ticker.quotes.USD.percent_change_12h}%</td>
    <td>{ticker.quotes.USD.percent_change_24h}%</td>
    <td>
        <img
            loading="lazy"
            class="graph-img"
            class:positive={ticker.quotes.USD.percent_change_7d >= 0}
            class:negative={ticker.quotes.USD.percent_change_7d < 0}
            width="120"
            height="23"
            src="https://graphs{Math.random() > 0.5 ? '2' : ''}.coinpaprika.com/currency/chart/{ticker.id}/7d/chart.svg"
            alt="" />
        {ticker.quotes.USD.percent_change_7d}%
    </td>
    <td>{ticker.quotes.USD.percent_change_30d}%</td>
    <td>{ticker.quotes.USD.percent_from_price_ath}%</td>
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
