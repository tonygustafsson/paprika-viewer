<script>
    import { filteredTickers } from '../stores/filteredTickers';

    const filterExchange = e => {
        const chosenExchange = e.target.value;
        filteredTickers.filterExchange(chosenExchange);
    };
</script>

<style>
    .filter {
        padding-bottom: 1em;
    }

    select {
        padding: 0.2em;
        margin: 1em;
        font-size: 100%;
    }
</style>

<div class="filter">
    <label for="filter-exchange">Exchange:</label>
    <select id="filter-exchange" name="filter-exchange" on:change={e => filterExchange(e)}>
        <option value="all">All</option>
        <option value="binance">Binance</option>
        <option value="coinbase">Coinbase</option>
        <option value="idax">IDAX</option>
        <option value="idex">IDEX</option>
        <option value="kraken">Kraken</option>
        <option value="kucoin">Kucoin</option>
        <option value="okex">OKEx</option>
    </select>
</div>
