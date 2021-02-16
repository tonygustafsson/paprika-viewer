<script>
    import { filteredTickers } from '../stores/filteredTickers';
    import { order } from '../stores/order';
    import Ticker from './Ticker.svelte';

    const sort = sortBy => {
        order.setOrderBy(sortBy);
        filteredTickers.order();
    };

    $: orderSymbol = $order.direction === 'desc' ? '↓' : '↑';
</script>

<p>Visible coins: {$filteredTickers.length}.</p>

{#if $filteredTickers.length > 0}
    <div class="table-responsive">
        <table>
            <tr>
                <th on:click={() => sort('rank')}>
                    #
                    {#if $order.by === 'rank'}{orderSymbol}{/if}
                </th>
                <th on:click={() => sort('symbol')}>
                    Symbol
                    {#if $order.by === 'symbol'}{orderSymbol}{/if}
                </th>
                <th on:click={() => sort('name')}>
                    Name
                    {#if $order.by === 'name'}{orderSymbol}{/if}
                </th>
                <th on:click={() => sort('price')}>
                    Price
                    {#if $order.by === 'price'}{orderSymbol}{/if}
                </th>
                <th on:click={() => sort('marketcap')}>
                    Marketcap
                    {#if $order.by === 'marketcap'}{orderSymbol}{/if}
                </th>
                <th on:click={() => sort('volume_24h')}>
                    Volume 24h
                    {#if $order.by === 'volume_24h'}{orderSymbol}{/if}
                </th>
                <th on:click={() => sort('1h')}>
                    1h
                    {#if $order.by === '1h'}{orderSymbol}{/if}
                </th>
                <th on:click={() => sort('12h')}>
                    12h
                    {#if $order.by === '12h'}{orderSymbol}{/if}
                </th>
                <th on:click={() => sort('24h')}>
                    24h
                    {#if $order.by === '24h'}{orderSymbol}{/if}
                </th>
                <th on:click={() => sort('7d')}>
                    7d
                    {#if $order.by === '7d'}{orderSymbol}{/if}
                </th>
                <th on:click={() => sort('30d')}>
                    30d
                    {#if $order.by === '30d'}{orderSymbol}{/if}
                </th>
                <th on:click={() => sort('ath')}>
                    From ATH
                    {#if $order.by === 'ath'}{orderSymbol}{/if}
                </th>
                <th>Exchanges</th>
            </tr>

            {#each $filteredTickers as ticker}
                <Ticker {ticker} />
            {/each}
        </table>
    </div>
{:else}
    <p>
        <em>No matching coins...</em>
    </p>
{/if}

<style>
    .table-responsive {
        max-width: 100%;
        overflow: auto;
        height: 1100px;
    }
    .table-responsive::-webkit-scrollbar {
        width: 5px;
        background-color: #000;
    }
    .table-responsive::-webkit-scrollbar-thumb {
        width: 5px;
        background-color: #f10;
    }
    table {
        width: 100%;
    }
    th {
        position: sticky;
        top: 0;
        left: 0;
        background: #111;
        text-align: left;
        cursor: pointer;
        padding: 0.5em;
        z-index: 1;
    }
</style>
