<script lang="ts">
	import { volumeToHuman } from './../utils/number';
	import { marketCapToHuman } from './../utils/marketCapToHuman';
	import type { Currency, Exchange, MarketCap, Volume } from 'src/types';

	import { filter } from '../stores/filter';
	import { sort } from '../stores/sort';
	import { settings } from '../stores/settings';
	import Button from './ui/Button.svelte';
	import Select from './ui/Select.svelte';
	import Switch from './ui/Switch.svelte';
	import Dialog from './ui/Dialog.svelte';
	import RadioGroup from './ui/RadioGroup.svelte';

	export let open: boolean;
	export let onClose: () => void;

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
		onClose();
	};
</script>

<Dialog title="Filter" {open} {onClose}>
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
		<Button variant="primary" size="medium" on:click={onClose}>Show results</Button>
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

	.extra-margin {
		margin: 16px 0;
	}
</style>
