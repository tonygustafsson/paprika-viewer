<script lang="ts">
	import '../theme.css';

	import { onMount } from 'svelte';

	import Header from '../components/Header.svelte';
	import Toolbar from '../components/Toolbar.svelte';
	import Loader from '../components/Loader.svelte';
	import SelectedFilters from '../components/SelectedFilters.svelte';
	import TickerInfoDialog from '../components/TickerInfoDialog.svelte';
	import Tickers from '../components/Tickers.svelte';
	import { columns } from '../stores/columns';
	import { settings } from '../stores/settings';
	import { filteredTickers } from '../stores/filteredTickers';
	import { getTickers } from '../utils/getTickers';
	import { getTags } from '../utils/getTags';
	import type { Exchanges, GlobalMarket as GlobalMarketType } from 'src/types';
	import { globalMarket as globalMarketStore } from '../stores/globalMarket';
	import { exchanges as exchangesStore } from '../stores/exchanges';

	// Fetched from endpoint index.ts
	export let globalData: GlobalMarketType;
	export let exchanges: Exchanges;

	$: referenceCurrency = 'USD';

	onMount(() => {
		globalMarketStore.save(globalData);
		exchangesStore.save(exchanges);

		if ($filteredTickers.length === 0) {
			// Avoid refetching tickers if they are already in the store
			getTickers($settings.referenceCurrency).then(() => {
				settings.subscribe(($newSettings) => {
					if ($newSettings.referenceCurrency !== referenceCurrency) {
						getTickers($newSettings.referenceCurrency);
					}

					referenceCurrency = $newSettings.referenceCurrency;
				});
			});
		}
	});

	$: if (!$settings.loading && $columns.tags) {
		getTags();
	}
</script>

<svelte:head>
	<title>Tickers - Paprika Viewer</title>
</svelte:head>

<Loader />

<div class="container">
	<Header isStartPage />

	{#if !$settings.loading}
		<Toolbar />
		<SelectedFilters />

		<Tickers />

		<TickerInfoDialog />
	{/if}
</div>

<style>
	.container {
		width: 100%;
		margin: 0 auto;
	}

	@media screen and (min-width: 1000px) {
		.container {
			width: 95%;
		}
	}
</style>
