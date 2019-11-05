<script>
    import { onMount } from 'svelte';
    import { global } from './stores/global';
    import { getTickers } from './utils/getTickers';
    import Filter from './components/Filter.svelte';
    import Tickers from './components/Tickers.svelte';
    import Loader from './components/Loader.svelte';

    onMount(() => {
        getTickers();
    });
</script>

<style>
    .container {
        width: 80%;
        margin: 0 auto;
    }
</style>

<Loader />

<div class="container">
    <h1>🌶️ Paprika Viewer</h1>

    {#if !$global.loading}
        <Filter />

        <Tickers />
    {/if}
</div>
