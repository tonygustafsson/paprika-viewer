<script lang="ts">
	import { marketCapToHuman } from '../utils/marketCapToHuman';
	import { volumeToHuman } from '../utils/number';
	import { filter } from '../stores/filter';
	import Chip from '../components/ui/Chip.svelte';
</script>

{#if $filter.exchange !== 'any' && $filter.exchange !== 'all'}
	<Chip on:click={() => filter.setExchange('any')}>Exchange: {$filter.exchange}</Chip>
{/if}

{#if $filter.volume !== 'all'}
	<Chip on:click={() => filter.setVolume('all')}>Volume: {volumeToHuman($filter.volume)}</Chip>
{/if}

{#if $filter.marketCap !== 'all'}
	<Chip on:click={() => filter.setMarketCap('all')}
		>MarketCap: {marketCapToHuman($filter.marketCap)}</Chip
	>
{/if}

{#if $filter.favorites}
	<Chip on:click={() => filter.setFavorites(false)}>Favorites only</Chip>
{/if}
