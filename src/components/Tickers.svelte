<script lang="ts">
	import { columns } from '../stores/columns';
	import { filteredTickers } from '../stores/filteredTickers';
	import { sort } from '../stores/sort';
	import type { SortBy } from '../types';
	import Arrow from './icons/Arrow.svelte';
	import ScrollToTop from './ScrollToTop.svelte';
	import Ticker from './Ticker.svelte';

	let scrollTable: HTMLDivElement;

	const handleSort = (sortBy: SortBy) => {
		sort.set(sortBy);
		filteredTickers.sort();
	};
</script>

<p>Visible coins: {$filteredTickers.length}.</p>

{#if $filteredTickers.length > 0}
	<div class="table-responsive" bind:this={scrollTable}>
		<table>
			<tr>
				{#if $columns.rank}
					<th on:click={() => handleSort('rank')}>
						<div class="table-header-column">
							#
							{#if $sort.by === 'rank'}
								<Arrow
									direction={$sort.direction === 'desc' ? 'down' : 'up'}
									width={16}
									height={16}
								/>
							{/if}
						</div>
					</th>
				{/if}

				{#if $columns.symbol}
					<th on:click={() => handleSort('symbol')}>
						<div class="table-header-column">
							Symbol
							{#if $sort.by === 'symbol'}
								<Arrow
									direction={$sort.direction === 'desc' ? 'down' : 'up'}
									width={16}
									height={16}
								/>
							{/if}
						</div>
					</th>
				{/if}

				{#if $columns.name}
					<th on:click={() => handleSort('name')}>
						<div class="table-header-column">
							Name
							{#if $sort.by === 'name'}
								<Arrow
									direction={$sort.direction === 'desc' ? 'down' : 'up'}
									width={16}
									height={16}
								/>
							{/if}
						</div>
					</th>
				{/if}

				{#if $columns.price}
					<th on:click={() => handleSort('price')}>
						<div class="table-header-column">
							Price
							{#if $sort.by === 'price'}
								<Arrow
									direction={$sort.direction === 'desc' ? 'down' : 'up'}
									width={16}
									height={16}
								/>
							{/if}
						</div>
					</th>
				{/if}

				{#if $columns.marketcap}
					<th on:click={() => handleSort('market_cap')}>
						<div class="table-header-column">
							Marketcap
							{#if $sort.by === 'market_cap'}
								<Arrow
									direction={$sort.direction === 'desc' ? 'down' : 'up'}
									width={16}
									height={16}
								/>
							{/if}
						</div>
					</th>
				{/if}

				{#if $columns.volume_24h}
					<th on:click={() => handleSort('volume_24h')}>
						<div class="table-header-column">
							Volume 24h
							{#if $sort.by === 'volume_24h'}
								<Arrow
									direction={$sort.direction === 'desc' ? 'down' : 'up'}
									width={16}
									height={16}
								/>
							{/if}
						</div>
					</th>
				{/if}

				{#if $columns.change_1h}
					<th on:click={() => handleSort('percent_change_1h')}>
						<div class="table-header-column">
							1h
							{#if $sort.by === 'percent_change_1h'}
								<Arrow
									direction={$sort.direction === 'desc' ? 'down' : 'up'}
									width={16}
									height={16}
								/>
							{/if}
						</div>
					</th>
				{/if}

				{#if $columns.change_12h}
					<th on:click={() => handleSort('percent_change_12h')}>
						<div class="table-header-column">
							12h
							{#if $sort.by === 'percent_change_12h'}
								<Arrow
									direction={$sort.direction === 'desc' ? 'down' : 'up'}
									width={16}
									height={16}
								/>
							{/if}
						</div>
					</th>
				{/if}

				{#if $columns.change_24h}
					<th on:click={() => handleSort('percent_change_24h')}>
						<div class="table-header-column">
							24h
							{#if $sort.by === 'percent_change_24h'}
								<Arrow
									direction={$sort.direction === 'desc' ? 'down' : 'up'}
									width={16}
									height={16}
								/>
							{/if}
						</div>
					</th>
				{/if}

				{#if $columns.change_7d}
					<th on:click={() => handleSort('percent_change_7d')}>
						<div class="table-header-column">
							7d
							{#if $sort.by === 'percent_change_7d'}
								<Arrow
									direction={$sort.direction === 'desc' ? 'down' : 'up'}
									width={16}
									height={16}
								/>
							{/if}
						</div>
					</th>
				{/if}

				{#if $columns.change_30d}
					<th on:click={() => handleSort('percent_change_30d')}>
						<div class="table-header-column">
							30d
							{#if $sort.by === 'percent_change_30d'}
								<Arrow
									direction={$sort.direction === 'desc' ? 'down' : 'up'}
									width={16}
									height={16}
								/>
							{/if}
						</div>
					</th>
				{/if}

				{#if $columns.change_1y}
					<th on:click={() => handleSort('percent_change_1y')}>
						<div class="table-header-column">
							1y
							{#if $sort.by === 'percent_change_1y'}
								<Arrow
									direction={$sort.direction === 'desc' ? 'down' : 'up'}
									width={16}
									height={16}
								/>
							{/if}
						</div>
					</th>
				{/if}

				{#if $columns.ath}
					<th on:click={() => handleSort('percent_from_price_ath')}>
						<div class="table-header-column">
							From ATH
							{#if $sort.by === 'percent_from_price_ath'}
								<Arrow
									direction={$sort.direction === 'desc' ? 'down' : 'up'}
									width={16}
									height={16}
								/>
							{/if}
						</div>
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

	.table-header-column {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	th:nth-child(1) {
		width: 50px;
	}
</style>
