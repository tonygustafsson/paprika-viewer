<script>
    import { filteredTickers } from '../stores/filteredTickers';
    import { filter } from '../stores/filter';

    const filterExchange = e => {
        const chosenExchange = e.target.value;
        filter.setExchange(chosenExchange);
        filteredTickers.filter();
    };

    const filterVolume = e => {
        const chosenVolume = e.target.value;
        filter.setVolume(chosenVolume);
        filteredTickers.filter();
    };
</script>

<style>
    select {
        padding: 0.2em 0.5em;
        margin: 1em 0.5em;
        background-color: #202020;
        color: #fff;
        font-size: 100%;
        border: 0;
        vertical-align: middle;
    }
</style>

<div class="filter">
    <label for="filter-exchange">Exchange:</label>
    <select id="filter-exchange" name="filter-exchange" on:change={e => filterExchange(e)}>
        <option value="all">All</option>
        <option value="any">Any</option>
        <option value="binance">Binance</option>
        <option value="coinbase">Coinbase</option>
        <option value="idax">IDAX</option>
        <option value="idex">IDEX</option>
        <option value="kraken">Kraken</option>
        <option value="kucoin">Kucoin</option>
        <option value="okex">OKEx</option>
    </select>

    <label for="filter-exchange">Volume:</label>
    <select id="filter-exchange" name="filter-exchange" on:change={e => filterVolume(e)}>
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
