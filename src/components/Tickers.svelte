<script>
    import { filteredTickers } from '../stores/filteredTickers';
    import { order } from '../stores/order';
    import Ticker from './Ticker.svelte';

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
        background: #111;
        text-align: left;
        cursor: pointer;
    }
    th {
        padding: 0.5em 0;
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
            <Ticker {ticker} />
        {/each}
    </table>
{:else}
    <p>
        <em>No matching coins...</em>
    </p>
{/if}
