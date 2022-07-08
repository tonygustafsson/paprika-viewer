<script lang="ts">
	import { filteredTickers } from '../stores/filteredTickers';
	import { sort } from '../stores/sort';
	import Ticker from './Ticker.svelte';
	import type { SortBy } from 'src/types';

	const handleSort = (sortBy: SortBy) => {
		sort.set(sortBy);
		filteredTickers.sort();
	};

	$: orderSymbol = $sort.direction === 'desc' ? '↓' : '↑';
</script>

<p>Visible coins: {$filteredTickers.length}.</p>

{#if $filteredTickers.length > 0}
	<div class="table-responsive">
		<table>
			<tr>
				<th on:click={() => handleSort('rank')}>
					#
					{#if $sort.by === 'rank'}{orderSymbol}{/if}
				</th>
				<th on:click={() => handleSort('symbol')}>
					Symbol
					{#if $sort.by === 'symbol'}{orderSymbol}{/if}
				</th>
				<th on:click={() => handleSort('name')}>
					Name
					{#if $sort.by === 'name'}{orderSymbol}{/if}
				</th>
				<th on:click={() => handleSort('price')}>
					Price
					{#if $sort.by === 'price'}{orderSymbol}{/if}
				</th>
				<th on:click={() => handleSort('market_cap')}>
					Marketcap
					{#if $sort.by === 'market_cap'}{orderSymbol}{/if}
				</th>
				<th on:click={() => handleSort('volume_24h')}>
					Volume 24h
					{#if $sort.by === 'volume_24h'}{orderSymbol}{/if}
				</th>
				<th on:click={() => handleSort('percent_change_1h')}>
					1h
					{#if $sort.by === 'percent_change_1h'}{orderSymbol}{/if}
				</th>
				<th on:click={() => handleSort('percent_change_12h')}>
					12h
					{#if $sort.by === 'percent_change_12h'}{orderSymbol}{/if}
				</th>
				<th on:click={() => handleSort('percent_change_24h')}>
					24h
					{#if $sort.by === 'percent_change_24h'}{orderSymbol}{/if}
				</th>
				<th on:click={() => handleSort('percent_change_7d')}>
					7d
					{#if $sort.by === 'percent_change_7d'}{orderSymbol}{/if}
				</th>
				<th on:click={() => handleSort('percent_change_30d')}>
					30d
					{#if $sort.by === 'percent_change_30d'}{orderSymbol}{/if}
				</th>
				<th on:click={() => handleSort('percent_from_price_ath')}>
					From ATH
					{#if $sort.by === 'percent_from_price_ath'}{orderSymbol}{/if}
				</th>
				<th>Exchanges</th>
			</tr>

			{#each $filteredTickers as ticker}
				<Ticker {ticker} />
			{/each}
		</table>
	</div>
{:else}
	<p>
		<em>No matching coins...</em>
	</p>
{/if}

<style>
	.table-responsive {
		max-width: 100%;
		overflow: auto;
		height: 1100px;
	}
	.table-responsive::-webkit-scrollbar {
		width: 5px;
		background-color: #000;
	}
	.table-responsive::-webkit-scrollbar-thumb {
		width: 5px;
		background-color: #f10;
	}
	table {
		width: 100%;
	}
	th {
		position: sticky;
		top: 0;
		left: 0;
		background: #111;
		text-align: left;
		cursor: pointer;
		padding: 0.5em;
		z-index: 1;
	}
</style>
