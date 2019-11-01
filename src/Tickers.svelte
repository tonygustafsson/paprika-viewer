<script>
    import { filteredTickers } from './stores/filteredTickers';
    import { order } from './stores/order';

    const sort = sortBy => {
        order.setOrderBy(sortBy);
        filteredTickers.order();
    };
</script>

<style>
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

    .exchanges ul {
        list-style: none;
        padding: 0;
    }
</style>

{#if $filteredTickers.length > 0}
    <table>
        <tr>
            <th on:click={() => sort('rank')}>#</th>
            <th on:click={() => sort('symbol')}>Symbol</th>
            <th on:click={() => sort('name')}>Name</th>
            <th on:click={() => sort('price')}>Price</th>
            <th on:click={() => sort('marketcap')}>Marketcap</th>
            <th on:click={() => sort('volume_24h')}>Volume 24h</th>
            <th on:click={() => sort('1h')}>1h</th>
            <th on:click={() => sort('12h')}>12h</th>
            <th on:click={() => sort('24h')}>24h</th>
            <th on:click={() => sort('7d')}>7d</th>
            <th on:click={() => sort('30d')}>30d</th>
            <th on:click={() => sort('ath')}>From ATH</th>
            <th>Exchanges</th>
        </tr>

        {#each $filteredTickers as ticker}
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
        {/each}
    </table>
{:else}
    <p>
        <em>No matching coins...</em>
    </p>
{/if}
