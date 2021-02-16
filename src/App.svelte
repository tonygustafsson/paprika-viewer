<script>
    import { onMount } from 'svelte';
    import { global } from './stores/global';
    import { getTickers } from './utils/getTickers';
    import GlobalMarket from './components/GlobalMarket.svelte';
    import Filter from './components/Filter.svelte';
    import Tickers from './components/Tickers.svelte';
    import Loader from './components/Loader.svelte';
    import TickerInfoBar from './components/TickerInfoBar.svelte';

    onMount(() => {
        getTickers();
    });
</script>

<Loader />

<div class="container">
    {#if !$global.loading}
        <GlobalMarket />
    {/if}

    <h1>
        <a class="logo-link" href="index.html">🌶️ Paprika Viewer</a>
    </h1>

    {#if !$global.loading}
        <TickerInfoBar />

        <Filter />

        <Tickers />
    {/if}
</div>

<style>
    .container {
        width: 100%;
        margin: 0 auto;
    }

    .logo-link {
        color: #fff;
        text-decoration: none;
    }

    @media screen and (min-width: 1000px) {
        .container {
            width: 95%;
        }
    }
</style>
