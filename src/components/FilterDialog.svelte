<script lang="ts">
	import { filter } from '../stores/filter';
	import { settings } from '../stores/settings';
	import { sort } from '../stores/sort';
	import type { Currency, Exchange, MarketCap, Volume } from '../types';
	import { marketCapToHuman } from '../utils/marketCapToHuman';
	import { volumeToHuman } from '../utils/number';
	import Button from './ui/Button.svelte';
	import Dialog from './ui/Dialog.svelte';
	import RadioGroup from './ui/RadioGroup.svelte';
	import Select from './ui/Select.svelte';
	import Switch from './ui/Switch.svelte';
	import Textfield from './ui/Textfield.svelte';

	export let open: boolean;
	export let onClose: () => void;

	const filterItems: Volume[] = [
		-1, 0, 100000, 250000, 500000, 1000000, 5000000, 10000000, 20000000, 50000000
	];

	const marketCapItems: MarketCap[] = [
		-1, 0, 100000, 250000, 500000, 1000000, 5000000, 10000000, 20000000, 50000000
	];

	const filterExchange = (e: Event) => {
		filter.setExchange((e.target as HTMLSelectElement).value as Exchange);
	};

	const filterVolume = (e: Event) => {
		filter.setVolume(parseInt((e.target as HTMLSelectElement).value) as Volume);
	};

	const filterMarketCap = (e: Event) => {
		filter.setMarketCap(parseInt((e.target as HTMLSelectElement).value) as MarketCap);
	};

	const filterFavorites = (e: Event) => {
		filter.setFavorites((e.target as HTMLInputElement).checked);
	};

	const search = (e: Event) => {
		filter.setSearch((e.target as HTMLInputElement).value);
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
			<Textfield
				label="Search"
				id="filter-search"
				name="filter-search"
				value={$filter.search}
				on:change={search}
			/>
		</div>

		<div class="filter-item">
			<Select
				id="filter-exchange"
				name="filter-exchange"
				label="Exchange"
				value={$filter.exchange}
				on:change={filterExchange}
			>
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
				on:change={filterMarketCap}
			>
				{#each marketCapItems as item}
					<option value={item}>{marketCapToHuman(item)}</option>
				{/each}
			</Select>
		</div>

		<div class="filter-item">
			<Select
				label="Volume"
				id="filter-volume"
				name="filter-volume"
				value={$filter.volume}
				on:change={filterVolume}
			>
				{#each filterItems as item}
					<option value={item}>{volumeToHuman(item)}</option>
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
