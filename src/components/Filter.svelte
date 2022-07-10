<script lang="ts">
	import type { Currency, Exchange } from 'src/types';

	import { filter } from '../stores/filter';
	import { sort } from '../stores/sort';
	import { settings } from '../stores/settings';
	import Button from './ui/Button.svelte';
	import Select from './ui/Select.svelte';
	import Switch from './ui/Switch.svelte';
	import RadioGroup from './ui/RadioGroup.svelte';

	const filterExchange = (e: Event) => {
		filter.setExchange((e.target as HTMLSelectElement).value as Exchange);
	};

	const filterVolume = (e: Event) => {
		filter.setVolume((e.target as HTMLSelectElement).value);
	};

	const filterMarketCap = (e: Event) => {
		filter.setMarketCap((e.target as HTMLSelectElement).value);
	};

	const filterFavorites = (e: Event) => {
		filter.setFavorites((e.target as HTMLInputElement).checked);
	};

	const setReferenceCurrency = (e: Event) => {
		settings.setReferenceCurrency((e.target as HTMLInputElement).value as Currency);
	};

	const reset = () => {
		sort.reset();
		filter.reset();
	};
</script>

<div class="filters">
	<div class="filter-item">
		<label for="filter-exchange">Exchange:</label>
		<!-- svelte-ignore a11y-no-onchange -->
		<Select
			id="filter-exchange"
			name="filter-exchange"
			value={$filter.exchange}
			on:change={(e) => filterExchange(e)}
		>
			<option value="all">All</option>
			<option value="any">Any</option>
			<option value="Binance">Binance</option>
			<option value="Coinbase">Coinbase</option>
			<option value="Kraken">Kraken</option>
			<option value="Kucoin">Kucoin</option>
			<option value="OKEx">OKEx</option>
		</Select>
	</div>

	<div class="filter-item">
		<label for="filter-marketcap">MarketCap:</label>
		<!-- svelte-ignore a11y-no-onchange -->
		<Select
			id="filter-marketcap"
			name="filter-marketcap"
			value={$filter.marketCap}
			on:change={(e) => filterMarketCap(e)}
		>
			<option value="all">All</option>
			<option value="0">0 - 100k</option>
			<option value="100000">100k - 250k</option>
			<option value="250000">250k - 500k</option>
			<option value="500000">500k - 1m</option>
			<option value="1000000">1m - 5m</option>
			<option value="5000000">5m - 10m</option>
			<option value="10000000">10m - 20m</option>
			<option value="20000000">20m - 50m</option>
			<option value="50000000">50m+</option>
		</Select>
	</div>

	<div class="filter-item">
		<label for="filter-volume">Volume:</label>
		<!-- svelte-ignore a11y-no-onchange -->
		<Select
			id="filter-volume"
			name="filter-volume"
			value={$filter.volume}
			on:change={(e) => filterVolume(e)}
		>
			<option value="all">All</option>
			<option value="0">0 - 100k</option>
			<option value="100000">100k - 250k</option>
			<option value="250000">250k - 500k</option>
			<option value="500000">500k - 1m</option>
			<option value="1000000">1m - 5m</option>
			<option value="5000000">5m - 10m</option>
			<option value="10000000">10m - 20m</option>
			<option value="20000000">20m - 50m</option>
			<option value="50000000">50m+</option>
		</Select>
	</div>

	<div class="filter-item">
		<Switch
			label="Favs only"
			name="filter-favorites"
			checked={$filter.favorites}
			on:change={(e) => filterFavorites(e)}
		/>
	</div>

	<div class="filter-item">
		<RadioGroup
			name="referenceCurrency"
			on:change={(e) => setReferenceCurrency(e)}
			items={[
				{ label: 'USD', value: 'USD', checked: true },
				{ label: 'BTC', value: 'BTC' },
				{ label: 'SEK', value: 'SEK' }
			]}
		/>
	</div>

	<Button on:click={reset}>Reset</Button>
</div>

<style>
	.filters {
		display: inline-flex;
		flex-wrap: wrap;
	}

	.filter-item {
		flex: 1 0 0;
		align-items: center;
		display: flex;
		margin: 0 12px;
	}
</style>
