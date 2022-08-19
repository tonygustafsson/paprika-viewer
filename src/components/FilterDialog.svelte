<script lang="ts">
	import { filter } from '../stores/filter';
	import { tags } from '../stores/tags';
	import { columns } from '../stores/columns';
	import { sort } from '../stores/sort';
	import type { Exchange, MarketCap, Volume } from '../types';
	import { marketCapToHuman } from '../utils/marketCapToHuman';
	import { volumeToHuman } from '../utils/number';
	import Button from './ui/Button.svelte';
	import Dialog from './ui/Dialog.svelte';
	import Select from './ui/Select.svelte';

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

	const filterTag = (e: Event) => {
		filter.setTag((e.target as HTMLSelectElement).value as string);
	};

	const filterVolume = (e: Event) => {
		filter.setVolume(parseInt((e.target as HTMLSelectElement).value) as Volume);
	};

	const filterMarketCap = (e: Event) => {
		filter.setMarketCap(parseInt((e.target as HTMLSelectElement).value) as MarketCap);
	};

	const enableExchangeColumn = () => {
		columns.add('exchanges');
	};

	const enableTagsColumn = () => {
		columns.add('tags');
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
				on:change={filterExchange}
			>
				<option value="any">Any</option>

				{#if $columns.exchanges}
					<option value="Binance">Binance</option>
					<option value="Coinbase">Coinbase</option>
					<option value="Kraken">Kraken</option>
					<option value="Kucoin">Kucoin</option>
					<option value="OKEx">OKEx</option>
				{/if}
			</Select>

			{#if !$columns.exchanges}
				<em class="warning">
					You can only filter by exchange if column "Exchange" is enabled.
					<a href="/" on:click={enableExchangeColumn}>Enable</a>
				</em>
			{/if}
		</div>

		<div class="filter-item">
			<Select
				id="filter-tag"
				name="filter-tag"
				label="Tag"
				value={$filter.tag}
				on:change={filterTag}
			>
				<option value="any">Any</option>

				{#if $tags.list}
					{#each $tags.list as tag}
						<option value={tag}>{tag}</option>
					{/each}
				{/if}
			</Select>

			{#if !$columns.tags}
				<em class="warning">
					You can only filter by tag if column "Tags" is enabled.
					<a href="/" on:click={enableTagsColumn}>Enable</a>
				</em>
			{/if}
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
	</div>

	<div slot="actions" class="actions">
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

	.actions {
		display: flex;
		gap: 12px;
		margin-top: 12px;
	}

	.warning {
		display: block;
		margin: 8px 0;
	}

	.warning a {
		color: #fff;
		font-style: normal;
	}
</style>
