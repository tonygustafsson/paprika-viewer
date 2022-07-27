<script lang="ts">
	import Chip from '../components/ui/Chip.svelte';
	import { filter } from '../stores/filter';
	import { marketCapToHuman } from '../utils/marketCapToHuman';
	import { volumeToHuman } from '../utils/number';
</script>

{#if $filter.exchange !== 'any'}
	<Chip on:click={() => filter.setExchange('any')}>Exchange: {$filter.exchange}</Chip>
{/if}

{#if $filter.volume !== -1}
	<Chip on:click={() => filter.setVolume(-1)}>Volume: {volumeToHuman($filter.volume)}</Chip>
{/if}

{#if $filter.marketCap !== -1}
	<Chip on:click={() => filter.setMarketCap(-1)}
		>MarketCap: {marketCapToHuman($filter.marketCap)}</Chip
	>
{/if}

{#if $filter.favorites}
	<Chip on:click={() => filter.setFavorites(false)}>Favorites only</Chip>
{/if}
