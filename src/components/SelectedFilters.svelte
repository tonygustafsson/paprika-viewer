<script lang="ts">
	import Chip from '../components/ui/Chip.svelte';
	import { filter } from '../stores/filter';
	import { marketCapToHuman } from '../utils/marketCapToHuman';
	import { volumeToHuman } from '../utils/number';
</script>

<div class="selected-filters">
	{#if $filter.exchange !== 'any'}
		<Chip showCloseIcon on:click={() => filter.setExchange('any')}
			>Exchange: {$filter.exchange}</Chip
		>
	{/if}

	{#if $filter.tag !== 'any'}
		<Chip showCloseIcon on:click={() => filter.setTag('any')}>Tag: {$filter.tag}</Chip>
	{/if}

	{#if $filter.volume !== -1}
		<Chip showCloseIcon on:click={() => filter.setVolume(-1)}
			>Volume: {volumeToHuman($filter.volume)}</Chip
		>
	{/if}

	{#if $filter.marketCap !== -1}
		<Chip showCloseIcon on:click={() => filter.setMarketCap(-1)}
			>MarketCap: {marketCapToHuman($filter.marketCap)}</Chip
		>
	{/if}

	{#if $filter.search}
		<div class="search">
			<Chip showCloseIcon on:click={() => filter.setSearch('')}>Search: {$filter.search}</Chip>
		</div>
	{/if}

	{#if $filter.favorites}
		<div class="favorites-only">
			<Chip showCloseIcon on:click={() => filter.setFavorites(false)}>Favorites only</Chip>
		</div>
	{/if}
</div>

<style>
	.selected-filters {
		margin-top: 12px;
	}

	@media screen and (min-width: 1000px) {
		.search {
			display: none;
		}

		.favorites-only {
			display: none;
		}
	}
</style>
