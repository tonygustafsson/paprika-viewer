<script lang="ts">
	import { favorites } from '../stores/favorites';
	import Star from './icons/Star.svelte';

	export let tickerSymbol: string;

	const toggleFavorite = (symbol: string) => {
		favorites.toggle(symbol);
	};
</script>

<span on:click={() => toggleFavorite(tickerSymbol)} class="favorite">
	<Star width={20} height={20} filled={$favorites[tickerSymbol]} />
</span>

<style>
	.favorite {
		margin-left: 0.25em;
		margin-top: 2px;
		cursor: pointer;
	}
</style>
