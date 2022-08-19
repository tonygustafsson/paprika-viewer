<script lang="ts">
	import '../theme.css';

	import { onMount } from 'svelte';

	import Header from '../components/Header.svelte';
	import type { GlobalMarket as GlobalMarketType, NewsItem } from 'src/types';
	import { globalMarket as globalMarketStore } from '../stores/globalMarket';
	import Chip from '../components/ui/Chip.svelte';
	import Button from '../components/ui/Button.svelte';

	// Fetched from endpoint index.ts
	export let globalData: GlobalMarketType;
	export let news: NewsItem[];

	onMount(() => {
		globalMarketStore.save(globalData);
	});
</script>

<div class="container">
	<Header />

	<h1>News</h1>

	{#if news.length === 0}
		<em>No news available</em>
	{/if}

	{#if news.length > 0}
		<div class="news">
			{#each news as newsItem}
				<div class="news-item">
					<h2>{newsItem.title}</h2>
					<p class="time">{newsItem.published_at}</p>
					<Button variant="primary" size="medium" href={newsItem.url}>Read more</Button>

					<div class="currencies">
						{#if newsItem.currencies.length === 0}
							<Chip variant="secondary">General</Chip>
						{/if}

						{#if newsItem.currencies.length > 0}
							{#each newsItem.currencies as currency}
								<Chip variant="secondary">{currency}</Chip>
							{/each}
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<p>
		A special thanks to <a class="link" href="https://cryptopanic.com/">CryptoPanic</a> for providing
		the API data needed to make this page a reality.
	</p>
</div>

<style>
	.container {
		width: 100%;
		margin: 0 auto;
	}

	h1 {
		font-size: 2rem;
		margin-block: 1em;
	}

	h2 {
		font-size: 1.25rem;
		margin-bottom: 0;
	}

	.time {
		color: var(--color-grey-25);
		font-size: 1rem;
	}

	.link {
		color: #fff;
	}

	.news {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
	}

	.news-item {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		background-color: var(--color-grey-100);
		padding: 16px;
		padding-bottom: 0px;
		border-radius: 4px;
	}

	.currencies {
		display: flex;
		gap: 8px;
		border-top: 1px solid var(--color-grey-50);
		margin-top: 24px;
		padding-block: 8px;
	}

	@media screen and (min-width: 1000px) {
		.container {
			width: 95%;
		}

		.news {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			gap: 16px;
		}
	}
</style>
