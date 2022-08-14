<script lang="ts">
	import '../theme.css';

	import { onMount } from 'svelte';

	import Filter from '../components/Filter.svelte';
	import GlobalMarket from '../components/GlobalMarket.svelte';
	import ChiliIcon from '../components/icons/Chili.svelte';
	import Loader from '../components/Loader.svelte';
	import SelectedFilters from '../components/SelectedFilters.svelte';
	import TickerInfoDialog from '../components/TickerInfoDialog.svelte';
	import Tickers from '../components/Tickers.svelte';
	import { columns } from '../stores/columns';
	import { settings } from '../stores/settings';
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

		getTickers($settings.referenceCurrency).then(() => {
			settings.subscribe(($newSettings) => {
				if ($newSettings.referenceCurrency !== referenceCurrency) {
					getTickers($newSettings.referenceCurrency);
				}

				referenceCurrency = $newSettings.referenceCurrency;
			});
		});
	});

	$: if (!$settings.loading && $columns.tags) {
		getTags();
	}
</script>

<Loader />

<div class="container">
	<GlobalMarket />

	<h1><ChiliIcon width={35} height={35} /> Paprika Viewer</h1>

	{#if !$settings.loading}
		<Filter />
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

	h1 {
		display: flex;
		align-items: flex-end;
		gap: 8px;
	}

	@media screen and (min-width: 1000px) {
		.container {
			width: 95%;
		}
	}
</style>
