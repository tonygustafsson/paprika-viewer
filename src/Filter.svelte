<script>
    import { tickers } from './stores/tickers';

    const filterExchange = e => {
        const chosenExchange = e.target.value;
        tickers.filterExchange(chosenExchange);
    };
</script>

<label for="filter-exchange">Exchange</label>
<select id="filter-exchange" name="filter-exchange" on:change={e => filterExchange(e)}>
    <option value="all">All</option>
    <option value="coinbasePro">Coinbase</option>
    <option value="binance">Binance</option>
    <option value="idex">IDEX</option>
</select>
