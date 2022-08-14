<script lang="ts">
	import { onMount } from 'svelte';

	import { columns } from '../stores/columns';
	import { exchanges } from '../stores/exchanges';
	import { tags } from '../stores/tags';
	import { selectedTicker } from '../stores/selectedTicker';
	import { settings } from '../stores/settings';
	import type { Ticker } from '../types';
	import { getDecimalsForPrice, priceToHuman } from '../utils/number';
	import Favorite from './Favorite.svelte';

	export let ticker: Ticker;

	let ref: HTMLTableRowElement;

	$: visible = false;

	const selectTicker = (ticker: Ticker) => {
		selectedTicker.set(ticker);
	};

	const handleImageError = (e: Event) => {
		const img = e.target as HTMLImageElement;
		if (img) {
			img.src = '/img/currencies/placeholder.svg';
		}
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			visible = entry.isIntersecting;
		});
	});

	onMount(() => {
		observer.observe(ref);
	});
</script>

<tr bind:this={ref}>
	{#if visible}
		{#if $columns.rank}
			<td>
				<div class="rank">
					{ticker.rank}
					<Favorite tickerSymbol={ticker.symbol} />
				</div>
			</td>
		{/if}

		{#if $columns.symbol}
			<td>
				<div class="symbol">
					<img
						width="24"
						height="24"
						class="ticker-icon"
						loading="lazy"
						src="/img/currencies/{ticker.symbol.toLowerCase()}.svg"
						on:error={handleImageError}
						alt=""
					/>

					<a href="/" on:click|preventDefault={() => selectTicker(ticker)}>
						{ticker.symbol}
					</a>
				</div>
			</td>
		{/if}

		{#if $columns.name}
			<td>
				<a href="/" on:click|preventDefault={() => selectTicker(ticker)}>{ticker.name}</a>
			</td>
		{/if}

		{#if $columns.price}
			<td>
				{#if $settings.currencyPrefix}
					{$settings.currencyPrefix}
				{/if}
				{getDecimalsForPrice(ticker.price)}
				{#if $settings.currencySuffix}
					{$settings.currencySuffix}
				{/if}
			</td>
		{/if}

		{#if $columns.marketcap}
			<td>
				{#if $settings.currencyPrefix}
					{$settings.currencyPrefix}
				{/if}
				{priceToHuman(ticker.mcap)}
				{#if $settings.currencySuffix}
					{$settings.currencySuffix}
				{/if}
			</td>
		{/if}

		{#if $columns.volume_24h}
			<td>
				{#if $settings.currencyPrefix}
					{$settings.currencyPrefix}
				{/if}
				{priceToHuman(ticker.volume_24h)}
				{#if $settings.currencySuffix}
					{$settings.currencySuffix}
				{/if}
			</td>
		{/if}

		{#if $columns.change_1h}
			<td>
				{ticker.change_1h}%
			</td>
		{/if}

		{#if $columns.change_12h}
			<td>
				<img
					loading="lazy"
					class="graph-img"
					class:positive={ticker.change_24h >= 0}
					class:negative={ticker.change_24h < 0}
					width="120"
					height="23"
					src="https://graphs.coinpaprika.com/currency/chart/{ticker.id}/12h/chart.svg"
					alt=""
				/>
				{ticker.change_12h}%
			</td>
		{/if}

		{#if $columns.change_24h}
			<td>
				<img
					loading="lazy"
					class="graph-img"
					class:positive={ticker.change_24h >= 0}
					class:negative={ticker.change_24h < 0}
					width="120"
					height="23"
					src="https://graphs.coinpaprika.com/currency/chart/{ticker.id}/24h/chart.svg"
					alt=""
				/>
				{ticker.change_24h}%
			</td>
		{/if}

		{#if $columns.change_7d}
			<td>
				<img
					loading="lazy"
					class="graph-img"
					class:positive={ticker.change_7d >= 0}
					class:negative={ticker.change_7d < 0}
					width="120"
					height="23"
					src="https://graphs.coinpaprika.com/currency/chart/{ticker.id}/7d/chart.svg"
					alt=""
				/>
				{ticker.change_7d}%
			</td>
		{/if}

		{#if $columns.change_30d}
			<td>
				<img
					loading="lazy"
					class="graph-img"
					class:positive={ticker.change_30d >= 0}
					class:negative={ticker.change_30d < 0}
					width="120"
					height="23"
					src="https://graphs.coinpaprika.com/currency/chart/{ticker.id}/24h/chart.svg"
					alt=""
				/>

				{ticker.change_30d}%
			</td>
		{/if}

		{#if $columns.change_1y}
			<td>
				<img
					loading="lazy"
					class="graph-img"
					class:positive={ticker.change_1y >= 0}
					class:negative={ticker.change_1y < 0}
					width="120"
					height="23"
					src="https://graphs.coinpaprika.com/currency/chart/{ticker.id}/1y/chart.svg"
					alt=""
				/>

				{ticker.change_1y}%
			</td>
		{/if}

		{#if $columns.beta}
			<td>{ticker.beta}</td>
		{/if}

		{#if $columns.created}
			<td>{new Date(ticker.created).toLocaleDateString('sv-SE')}</td>
		{/if}

		{#if $columns.ath}
			<td>{ticker.from_ath}%</td>
		{/if}

		{#if $columns.tags}
			<td class="list">
				{#if Object.keys($tags.tickers || {}).includes(ticker.id)}
					<ul>
						{#each $tags.tickers[ticker.id] as tag}
							<li>{tag}</li>
						{/each}
					</ul>
				{/if}
			</td>
		{/if}

		{#if $columns.exchanges}
			<td class="list">
				{#if Object.keys($exchanges).includes(ticker.id)}
					<ul>
						{#each $exchanges[ticker.id] as exchange}
							<li>{exchange}</li>
						{/each}
					</ul>
				{/if}
			</td>
		{/if}
	{/if}
</tr>

<style>
	tr {
		height: 122px;
		overflow: hidden;
	}

	tr:nth-child(odd) {
		background-color: var(--color-grey-500);
	}

	td {
		padding: 0.5em;
		white-space: nowrap;
	}

	.rank {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.symbol {
		display: flex;
		align-items: center;
		height: 100%;
	}

	a {
		color: #fff;
	}

	.list {
		white-space: normal;
	}

	.list ul {
		list-style: none;
		padding: 0;
	}

	.ticker-icon {
		width: 24px;
		height: 24px;
		margin-right: 0.5em;
		background: #fff;
		border-radius: 50%;
		border-color: #000;
		padding: 1px;
	}

	.graph-img {
		display: block;
		width: 100%;
		min-width: 120px;
		margin-bottom: 12px;
	}

	.graph-img.positive {
		filter: hue-rotate(230deg);
	}

	.graph-img.negative {
		filter: hue-rotate(115deg);
	}
</style>
