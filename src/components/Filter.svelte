<script>
    import { filteredTickers } from '../stores/filteredTickers';
    import { filter } from '../stores/filter';
    import { global } from '../stores/global';

    const filterExchange = e => {
        filter.setExchange(e.target.value);
    };

    const filterVolume = e => {
        filter.setVolume(e.target.value);
    };

    const filterMarketCap = e => {
        filter.setMarketCap(e.target.value);
    };

    const filterFavorites = e => {
        filter.setFavorites(e.target.checked);
    };

    const setReferenceCurrency = e => {
        global.setReferenceCurrency(e.target.value);
    };

    const resetFilters = () => {
        filter.reset();
    };
</script>

<div class="filters">
    <div class="filter-item">
        <label for="filter-exchange">Exchange:</label>
        <!-- svelte-ignore a11y-no-onchange -->
        <select id="filter-exchange" name="filter-exchange" value={$filter.exchange} on:change={e => filterExchange(e)}>
            <option value="all">All</option>
            <option value="any">Any</option>
            <option value="binance">Binance</option>
            <option value="coinbase">Coinbase</option>
            <option value="idex">IDEX</option>
            <option value="kraken">Kraken</option>
            <option value="kucoin">Kucoin</option>
            <option value="okex">OKEx</option>
            <option value="uniswap">UniSwap</option>
        </select>
    </div>

    <div class="filter-item">
        <label for="filter-marketcap">MarketCap:</label>
        <!-- svelte-ignore a11y-no-onchange -->
        <select
            id="filter-marketcap"
            name="filter-marketcap"
            value={$filter.marketCap}
            on:change={e => filterMarketCap(e)}
        >
            <option value="all">All</option>
            <option value="0">0 - 100k</option>
            <option value="100000">100k - 250k</option>
            <option value="250000">250k - 500k</option>
            <option value="500000">500k - 1m</option>
            <option value="1000000">1m - 5m</option>
            <option value="5000000">5m - 10m</option>
            <option value="10000000">10m - 20m</option>
            <option value="20000000">20m - 50m</option>
            <option value="50000000">50m+</option>
        </select>
    </div>

    <div class="filter-item">
        <label for="filter-volume">Volume:</label>
        <!-- svelte-ignore a11y-no-onchange -->
        <select id="filter-volume" name="filter-volume" value={$filter.volume} on:change={e => filterVolume(e)}>
            <option value="all">All</option>
            <option value="0">0 - 100k</option>
            <option value="100000">100k - 250k</option>
            <option value="250000">250k - 500k</option>
            <option value="500000">500k - 1m</option>
            <option value="1000000">1m - 5m</option>
            <option value="5000000">5m - 10m</option>
            <option value="10000000">10m - 20m</option>
            <option value="20000000">20m - 50m</option>
            <option value="50000000">50m+</option>
        </select>
    </div>

    <div class="filter-item">
        <label for="filter-favorites">Favs only:</label>
        <input
            type="checkbox"
            id="filter-favorites"
            name="filter-favorites"
            checked={$filter.favorites}
            on:blur={e => filterFavorites(e)}
        />
    </div>

    <div class="filter-item">
        <input type="radio" name="referenceCurrency" value="usd" checked on:change={e => setReferenceCurrency(e)} />
        USD
        <input type="radio" name="referenceCurrency" value="sek" on:change={e => setReferenceCurrency(e)} />
        SEK
        <input type="radio" name="referenceCurrency" value="btc" on:change={e => setReferenceCurrency(e)} />
        BTC
        <input type="radio" name="referenceCurrency" value="eth" on:change={e => setReferenceCurrency(e)} />
        ETH
    </div>

    <button on:click={resetFilters}>Reset</button>
</div>

<style>
    .filters {
        display: inline-flex;
        flex-wrap: wrap;
    }

    .filter-item {
        flex: 1 0 0;
        align-items: center;
        display: flex;
        margin: 0 12px;
    }

    select {
        padding: 0.2em 0.5em;
        margin: 0.2em 0.5em;
        background-color: #202020;
        color: #fff;
        font-size: 100%;
        border: 0;
        vertical-align: middle;
    }

    label {
        min-width: 5em;
        text-align: right;
    }

    input[type='checkbox'] {
        margin: 0.2em 0.5em;
        background-color: #202020;
        color: #fff;
        font-size: 100%;
        vertical-align: middle;
    }

    input[type='radio']:nth-child(2) {
        margin-left: 1em;
    }

    button {
        padding: 0.2em 0.5em;
        margin: 1em 0.5em;
        background-color: #202020;
        color: #fff;
        border: 0;
        font-size: 100%;
        vertical-align: middle;
        cursor: pointer;
    }
</style>
