<script>
    export let ticker;
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
</style>

<tr>
    <td>{ticker.rank}</td>
    <td>
        <a href="https://coinpaprika.com/coin/{ticker.id}">{ticker.symbol}</a>
    </td>
    <td>{ticker.name}</td>
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
