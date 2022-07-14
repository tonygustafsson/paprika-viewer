<script lang="ts">
	import type { Currency, Exchange } from 'src/types';

	import { filter } from '../stores/filter';
	import { sort } from '../stores/sort';
	import { settings } from '../stores/settings';
	import Button from './ui/Button.svelte';
	import Select from './ui/Select.svelte';
	import Switch from './ui/Switch.svelte';
	import Dialog from './ui/Dialog.svelte';
	import RadioGroup from './ui/RadioGroup.svelte';
	import FilterIcon from './icons/Filter.svelte';

	$: filterDialogOpen = false;

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
		filterDialogOpen = false;
	};
</script>

<div class="filters">
	<div class="filter-item">
		<Button size="medium" on:click={() => (filterDialogOpen = true)}>
			<div slot="icon">
				<FilterIcon width={14} height={14} />
			</div>
			Filter</Button
		>
	</div>

	<Dialog title="Filter" open={filterDialogOpen} onClose={() => (filterDialogOpen = false)}>
		<div class="filters">
			<div class="filter-item">
				<Select
					id="filter-exchange"
					name="filter-exchange"
					label="Exchange"
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
				<Select
					id="filter-marketcap"
					name="filter-marketcap"
					label="Market cap"
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
				<Select
					label="Volume"
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

			<div class="filter-item extra-margin">
				<Switch
					label="Favorites only"
					name="filter-favorites"
					checked={$filter.favorites}
					on:change={(e) => filterFavorites(e)}
				/>
			</div>

			<div class="filter-item">
				<RadioGroup
					name="referenceCurrency"
					label="Reference currency"
					on:change={(e) => setReferenceCurrency(e)}
					items={[
						{ label: 'USD', value: 'USD', checked: true },
						{ label: 'BTC', value: 'BTC' },
						{ label: 'SEK', value: 'SEK' }
					]}
				/>
			</div>
		</div>

		<div slot="actions">
			<Button size="medium" on:click={reset}>Reset</Button>
			<Button variant="primary" size="medium" on:click={() => (filterDialogOpen = false)}
				>Show results</Button
			>
		</div>
	</Dialog>
</div>

<style>
	.filters {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
	}

	.filter-item {
		flex: 1 0 0;
		align-items: center;
		margin: 8px 0;
	}

	.extra-margin {
		margin: 16px 0;
	}
</style>
