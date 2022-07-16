<script lang="ts">
	import { selectedTicker } from '../stores/selectedTicker';
	import { settings } from '../stores/settings';
	import Favorite from './Favorite.svelte';
	import type { Ticker } from 'src/types';
	import { onMount } from 'svelte';
	import { getDecimalsForPrice, priceToHuman } from 'src/utils/number';

	export let ticker: Ticker;

	let ref: HTMLTableRowElement;

	$: quote = ticker.quotes[$settings.referenceCurrency];
	$: visible = false;

	const selectTicker = (ticker: Ticker) => {
		selectedTicker.set(ticker);
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
		<td>
			{ticker.rank}
			<Favorite tickerSymbol={ticker.symbol} />
		</td>
		<td>
			<img
				width="16"
				height="16"
				class="ticker-icon"
				loading="lazy"
				src="https://cryptologos.cc/logos/thumbs/{ticker.name.toLowerCase()}.png"
				alt=""
			/>

			<a href="/" on:click|preventDefault={() => selectTicker(ticker)}>
				{ticker.symbol}
			</a>
		</td>
		<td>
			<a href="/" on:click|preventDefault={() => selectTicker(ticker)}>{ticker.name}</a>
		</td>
		<td>{$settings.currencySymbol}{getDecimalsForPrice(quote.price)}</td>
		<td>{$settings.currencySymbol}{priceToHuman(quote.market_cap)}</td>
		<td>{$settings.currencySymbol}{priceToHuman(quote.volume_24h)}</td>
		<td>{quote.percent_change_1h}%</td>
		<td>{quote.percent_change_12h}%</td>
		<td>
			<img
				loading="lazy"
				class="graph-img"
				class:positive={quote.percent_change_24h >= 0}
				class:negative={quote.percent_change_24h < 0}
				width="120"
				height="23"
				src="https://graphs.coinpaprika.com/currency/chart/{ticker.id}/24h/chart.svg"
				alt=""
			/>
			{quote.percent_change_24h}%
		</td>
		<td>
			<img
				loading="lazy"
				class="graph-img"
				class:positive={quote.percent_change_7d >= 0}
				class:negative={quote.percent_change_7d < 0}
				width="120"
				height="23"
				src="https://graphs.coinpaprika.com/currency/chart/{ticker.id}/7d/chart.svg"
				alt=""
			/>
			{quote.percent_change_7d}%
		</td>
		<td>
			<img
				loading="lazy"
				class="graph-img"
				class:positive={quote.percent_change_30d >= 0}
				class:negative={quote.percent_change_30d < 0}
				width="120"
				height="23"
				src="https://graphs.coinpaprika.com/currency/chart/{ticker.id}/24h/chart.svg"
				alt=""
			/>

			{quote.percent_change_30d}%
		</td>
		<td>{quote.percent_from_price_ath}%</td>
		<td class="exchanges">
			{#if ticker.exchanges}
				<ul>
					{#each ticker.exchanges as exchange}
						<li>{exchange}</li>
					{/each}
				</ul>
			{/if}
		</td>
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
	}

	a {
		color: #fff;
	}

	.exchanges ul {
		list-style: none;
		padding: 0;
	}

	.ticker-icon {
		width: 16px;
		height: 16px;
		vertical-align: middle;
	}

	.graph-img {
		margin: 0 4px 4px 0;
		vertical-align: middle;
	}

	.graph-img.positive {
		filter: hue-rotate(230deg);
	}

	.graph-img.negative {
		filter: hue-rotate(115deg);
	}
</style>
