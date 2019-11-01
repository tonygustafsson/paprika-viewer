<script>
    import { global } from './stores/global';
    import Filter from './Filter.svelte';
    import Tickers from './Tickers.svelte';
</script>

<style>
    .container {
        width: 80%;
        margin: 0 auto;
    }
</style>

<div class="container">
    <h1>🌶️ Paprika Viewer</h1>

    {#if $global.loading}
        <p>
            <em>Loading...</em>
        </p>
    {/if}

    {#if !$global.loading}
        <Filter />

        <Tickers />
    {/if}
</div>
