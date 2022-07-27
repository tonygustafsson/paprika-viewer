<script>
	import { onMount } from 'svelte';
	import { settings } from '../stores/settings';
	import { getTickers } from '../utils/getTickers';
	import { getExchanges } from '../utils/getExchanges';
	import GlobalMarket from '../components/GlobalMarket.svelte';
	import Filter from '../components/Filter.svelte';
	import SelectedFilters from '../components/SelectedFilters.svelte';
	import Tickers from '../components/Tickers.svelte';
	import Loader from '../components/Loader.svelte';
	import ChiliIcon from '../components/icons/Chili.svelte';
	import TickerInfoDialog from '../components/TickerInfoDialog.svelte';
	import '../theme.css';

	onMount(() => {
		getTickers();
		getExchanges();
	});
</script>

<Loader />

<div class="container">
	<GlobalMarket loading={$settings.loading} />

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
