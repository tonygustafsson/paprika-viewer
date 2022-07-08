<script lang="ts">
	import { favorites } from '../stores/favorites';

	export let tickerSymbol: string;

	const toggleFavorite = (symbol: string) => {
		favorites.toggle(symbol);
	};
</script>

<span on:click={() => toggleFavorite(tickerSymbol)} class="favorite">
	{#if $favorites[tickerSymbol]}★{:else}☆{/if}
</span>

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
