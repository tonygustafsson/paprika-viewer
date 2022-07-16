<script lang="ts">
	import { filteredTickers } from '../stores/filteredTickers';
	import { sort } from '../stores/sort';
	import { columns } from '../stores/columns';
	import Ticker from './Ticker.svelte';
	import type { SortBy } from 'src/types';
	import ScrollToTop from './ScrollToTop.svelte';

	let scrollTable: HTMLDivElement;

	const handleSort = (sortBy: SortBy) => {
		sort.set(sortBy);
		filteredTickers.sort();
	};

	$: orderSymbol = $sort.direction === 'desc' ? '↓' : '↑';
</script>

<p>Visible coins: {$filteredTickers.length}.</p>

{#if $filteredTickers.length > 0}
	<div class="table-responsive" bind:this={scrollTable}>
		<table>
			<tr>
				{#if $columns.rank}
					<th on:click={() => handleSort('rank')}>
						#
						{#if $sort.by === 'rank'}{orderSymbol}{/if}
					</th>
				{/if}

				{#if $columns.symbol}
					<th on:click={() => handleSort('symbol')}>
						Symbol
						{#if $sort.by === 'symbol'}{orderSymbol}{/if}
					</th>
				{/if}

				{#if $columns.name}
					<th on:click={() => handleSort('name')}>
						Name
						{#if $sort.by === 'name'}{orderSymbol}{/if}
					</th>
				{/if}

				{#if $columns.price}
					<th on:click={() => handleSort('price')}>
						Price
						{#if $sort.by === 'price'}{orderSymbol}{/if}
					</th>
				{/if}

				{#if $columns.marketcap}
					<th on:click={() => handleSort('market_cap')}>
						Marketcap
						{#if $sort.by === 'market_cap'}{orderSymbol}{/if}
					</th>
				{/if}

				{#if $columns.volume_24h}
					<th on:click={() => handleSort('volume_24h')}>
						Volume 24h
						{#if $sort.by === 'volume_24h'}{orderSymbol}{/if}
					</th>
				{/if}

				{#if $columns.change_1h}
					<th on:click={() => handleSort('percent_change_1h')}>
						1h
						{#if $sort.by === 'percent_change_1h'}{orderSymbol}{/if}
					</th>
				{/if}

				{#if $columns.change_12h}
					<th on:click={() => handleSort('percent_change_12h')}>
						12h
						{#if $sort.by === 'percent_change_12h'}{orderSymbol}{/if}
					</th>
				{/if}

				{#if $columns.change_24h}
					<th on:click={() => handleSort('percent_change_24h')}>
						24h
						{#if $sort.by === 'percent_change_24h'}{orderSymbol}{/if}
					</th>
				{/if}

				{#if $columns.change_7d}
					<th on:click={() => handleSort('percent_change_7d')}>
						7d
						{#if $sort.by === 'percent_change_7d'}{orderSymbol}{/if}
					</th>
				{/if}

				{#if $columns.change_30d}
					<th on:click={() => handleSort('percent_change_30d')}>
						30d
						{#if $sort.by === 'percent_change_30d'}{orderSymbol}{/if}
					</th>
				{/if}

				{#if $columns.change_1y}
					<th on:click={() => handleSort('percent_change_1y')}>
						1y
						{#if $sort.by === 'percent_change_1y'}{orderSymbol}{/if}
					</th>
				{/if}

				{#if $columns.ath}
					<th on:click={() => handleSort('percent_from_price_ath')}>
						From ATH
						{#if $sort.by === 'percent_from_price_ath'}{orderSymbol}{/if}
					</th>
				{/if}

				{#if $columns.exchanges}
					<th>Exchanges</th>
				{/if}
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

<ScrollToTop {scrollTable} />

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
		background-color: var(--color-red-500);
	}
	table {
		table-layout: fixed;
	}

	@media screen and (min-width: 1000px) {
		table {
			width: 100%;
		}
	}

	th {
		position: sticky;
		top: 0;
		left: 0;
		background-color: var(--color-grey-500);
		text-align: left;
		cursor: pointer;
		padding: 0.5em;
		z-index: 1;
		white-space: nowrap;
	}

	th:nth-child(1) {
		width: 50px;
	}
</style>
