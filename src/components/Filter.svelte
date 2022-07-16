<script lang="ts">
	import { volumeToHuman } from './../utils/number';
	import { marketCapToHuman } from './../utils/marketCapToHuman';
	import type { Currency, Exchange, MarketCap, Volume } from 'src/types';

	import { filter } from '../stores/filter';
	import { columns } from '../stores/columns';
	import { sort } from '../stores/sort';
	import { settings } from '../stores/settings';
	import Button from './ui/Button.svelte';
	import Select from './ui/Select.svelte';
	import Switch from './ui/Switch.svelte';
	import Dialog from './ui/Dialog.svelte';
	import RadioGroup from './ui/RadioGroup.svelte';
	import FilterIcon from './icons/Filter.svelte';

	$: filterDialogOpen = false;
	$: columnsDialogOpen = false;

	const filterItems: Volume[] = [
		'all',
		0,
		100000,
		250000,
		500000,
		1000000,
		5000000,
		10000000,
		20000000,
		50000000
	];

	const marketCapItems: MarketCap[] = [
		'all',
		0,
		100000,
		250000,
		500000,
		1000000,
		5000000,
		10000000,
		20000000,
		50000000
	];

	$: volumeFilter = $filter.volume !== 'all' ? ($filter.volume as Volume) : (0 as Volume);

	const filterExchange = (e: Event) => {
		filter.setExchange((e.target as HTMLSelectElement).value as Exchange);
	};

	const filterVolume = (e: Event) => {
		filter.setVolume((e.target as HTMLSelectElement).value as Volume);
	};

	const filterMarketCap = (e: Event) => {
		filter.setMarketCap((e.target as HTMLSelectElement).value as MarketCap);
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
	<div class="filter-buttons">
		<Button size="medium" on:click={() => (filterDialogOpen = true)}>
			<div slot="icon">
				<FilterIcon width={14} height={14} />
			</div>
			Filters
		</Button>

		<Button size="medium" on:click={() => (columnsDialogOpen = true)}>
			<div slot="icon">
				<FilterIcon width={14} height={14} />
			</div>
			Columns
		</Button>
	</div>
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
				value={$filter.marketCap.toString()}
				on:change={(e) => filterMarketCap(e)}
			>
				{#each marketCapItems as item}
					<option value={item.toString()}>{marketCapToHuman(item)}</option>
				{/each}
			</Select>
		</div>

		<div class="filter-item">
			<Select
				label="Volume"
				id="filter-volume"
				name="filter-volume"
				value={$filter.volume.toString()}
				on:change={(e) => filterVolume(e)}
			>
				{#each filterItems as item}
					<option value={item.toString()}>{volumeToHuman(item)}</option>
				{/each}
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

<Dialog title="Columns" open={columnsDialogOpen} onClose={() => (columnsDialogOpen = false)}>
	<div class="column-switches">
		<div class="column-switch">
			<Switch
				label="Rank"
				name="rank"
				checked={$columns.rank}
				on:change={() => columns.toggle('rank')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Symbol"
				name="symbol"
				checked={$columns.symbol}
				on:change={() => columns.toggle('symbol')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Name"
				name="name"
				checked={$columns.name}
				on:change={() => columns.toggle('name')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Price"
				name="price"
				checked={$columns.price}
				on:change={() => columns.toggle('price')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="MarketCap"
				name="marketcap"
				checked={$columns.marketcap}
				on:change={() => columns.toggle('marketcap')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Volume 24h"
				name="volume_24h"
				checked={$columns.volume_24h}
				on:change={() => columns.toggle('volume_24h')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Change 1h"
				name="change-1h"
				checked={$columns.change_1h}
				on:change={() => columns.toggle('change_1h')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Change 12h"
				name="change-12h"
				checked={$columns.change_12h}
				on:change={() => columns.toggle('change_12h')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Change 24h"
				name="change-24h"
				checked={$columns.change_24h}
				on:change={() => columns.toggle('change_24h')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Change 7d"
				name="change-7d"
				checked={$columns.change_7d}
				on:change={() => columns.toggle('change_7d')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Change 30d"
				name="change-30d"
				checked={$columns.change_30d}
				on:change={() => columns.toggle('change_30d')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Change 1y"
				name="change-1y"
				checked={$columns.change_1y}
				on:change={() => columns.toggle('change_1y')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="All time high"
				name="change-ath"
				checked={$columns.ath}
				on:change={() => columns.toggle('ath')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Exchanges"
				name="exchanges"
				checked={$columns.exchanges}
				on:change={() => columns.toggle('exchanges')}
			/>
		</div>
	</div>
</Dialog>

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

	.filter-buttons {
		display: flex;
		align-items: center;
		margin: 8px 0;
	}

	.extra-margin {
		margin: 16px 0;
	}

	.column-switches {
		display: flex;
		flex-wrap: wrap;
	}

	.column-switch {
		width: 50%;
		margin-bottom: 12px;
	}
</style>
