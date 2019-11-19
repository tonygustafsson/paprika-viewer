<script>
    import { favorites } from '../stores/favorites';

    export let tickerSymbol;

    const toggleFavorite = symbol => {
        favorites.toggle(symbol);
    };
</script>

<style>
    .favorite {
        font-size: 200%;
        margin: 0 auto;
        display: block;
        text-align: center;
        cursor: pointer;
    }

    @media screen and (min-width: 1000px) {
        .favorite {
            font-size: 250%;
            display: inline-block;
            vertical-align: sub;
            margin-left: 0.25em;
        }
    }
</style>

<span on:click={() => toggleFavorite(tickerSymbol)} class="favorite">
    {#if $favorites[tickerSymbol]}★{:else}☆{/if}
</span>
