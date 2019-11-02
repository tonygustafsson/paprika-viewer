<script>
    export let ticker;
</script>

<style>
    tr:nth-child(2n + 1) {
        background: #111;
    }

    td {
        padding: 0.5em 0;
    }

    .exchanges ul {
        list-style: none;
        padding: 0;
    }
</style>

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
