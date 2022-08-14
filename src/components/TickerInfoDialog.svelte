<script lang="ts">
	import { columns } from '../stores/columns';
	import { exchanges } from '../stores/exchanges';
	import { tags } from '../stores/tags';
	import { selectedTicker } from '../stores/selectedTicker';
	import { settings } from '../stores/settings';
	import { priceToHuman } from '../utils/number';
	import Button from './ui/Button.svelte';
	import Dialog from './ui/Dialog.svelte';

	const viewOnCoinPaprika = () => {
		if (!$selectedTicker) return;

		const url = `https://coinpaprika.com/coin/${$selectedTicker.id}`;
		window.open(url, '_blank');
	};

	const enableExchangeColumn = () => {
		columns.add('exchanges');
	};

	const enableTagsColumn = () => {
		columns.add('tags');
	};
</script>

{#if $selectedTicker}
	<Dialog
		title={`${$selectedTicker.name} (#${$selectedTicker.rank})`}
		iconUrl={`/img/currencies/${$selectedTicker.symbol.toLowerCase()}.svg`}
		open={!!selectedTicker}
		onClose={() => selectedTicker.set(null)}
	>
		<div class="wrapper">
			<p class="name">
				Price:
				{#if $settings.currencyPrefix}
					{$settings.currencyPrefix}
				{/if}
				{$selectedTicker.price}
				{#if $settings.currencySuffix}
					{$settings.currencySuffix}
				{/if}
			</p>

			<div class="graphs">
				<div>
					<span class="graph-label">24h ({$selectedTicker.change_24h}%):</span>

					<img
						loading="lazy"
						class="graph-img"
						class:positive={$selectedTicker.change_24h >= 0}
						class:negative={$selectedTicker.change_24h < 0}
						width="120"
						height="23"
						src="https://graphs.coinpaprika.com/currency/chart/{$selectedTicker.id}/24h/chart.svg"
						alt=""
					/>
				</div>

				<div>
					<span class="graph-label">7d ({$selectedTicker.change_7d}%):</span>

					<img
						loading="lazy"
						class="graph-img"
						class:positive={$selectedTicker.change_7d >= 0}
						class:negative={$selectedTicker.change_7d < 0}
						width="120"
						height="23"
						src="https://graphs.coinpaprika.com/currency/chart/{$selectedTicker.id}/7d/chart.svg"
						alt=""
					/>
				</div>

				<div>
					<span class="graph-label">30d ({$selectedTicker.change_30d}%):</span>

					<img
						loading="lazy"
						class="graph-img"
						class:positive={$selectedTicker.change_30d >= 0}
						class:negative={$selectedTicker.change_30d < 0}
						width="120"
						height="23"
						src="https://graphs.coinpaprika.com/currency/chart/{$selectedTicker.id}/30d/chart.svg"
						alt=""
					/>
				</div>

				<div>
					<span class="graph-label">
						1y ({$selectedTicker.change_1y}%):
					</span>

					<img
						loading="lazy"
						class="graph-img"
						class:positive={$selectedTicker.change_1y >= 0}
						class:negative={$selectedTicker.change_1y < 0}
						width="120"
						height="23"
						src="https://graphs.coinpaprika.com/currency/chart/{$selectedTicker.id}/1y/chart.svg"
						alt=""
					/>
				</div>
			</div>

			<div>
				<strong>Exchanges:</strong>
				{#if $exchanges[$selectedTicker.id] && $exchanges[$selectedTicker.id].length > 0}
					{$exchanges[$selectedTicker.id].join(', ')}.
				{:else if !$columns.exchanges}
					<span class="warning">
						Column "Exchanges" is not enabled.
						<a href="/" on:click={enableExchangeColumn}>Enable</a>
					</span>
				{:else}
					No known exchanges.
				{/if}
			</div>

			<div>
				<strong>Tags:</strong>
				{#if $tags.tickers[$selectedTicker.id] && $tags.tickers[$selectedTicker.id].length > 0}
					{$tags.tickers[$selectedTicker.id].join(', ')}.
				{:else if !$columns.tags}
					<span class="warning">
						Column "Tags" is not enabled.
						<a href="/" on:click={enableTagsColumn}>Enable</a>
					</span>
				{:else}
					No known tags.
				{/if}
			</div>

			<div>
				<strong>Circulating supply:</strong>
				{$selectedTicker.supply}.
			</div>

			<div>
				<strong>Max supply:</strong>
				{$selectedTicker.max_supply}.
			</div>

			<div class="coinpaprika-link">
				<Button size="medium" on:click={viewOnCoinPaprika}>View on CoinPaprika</Button>
			</div>
		</div>
	</Dialog>
{/if}

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.name {
		font-size: 150%;
		margin: 0 0 0.5em 0;
	}

	.coinpaprika-link {
		padding-top: 1em;
	}

	.graphs {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 15px;
	}

	.graph-label {
		display: block;
		margin-bottom: 1em;
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

	.warning a {
		color: #fff;
	}
</style>
