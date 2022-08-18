<script lang="ts">
	import '../theme.css';

	import { onMount } from 'svelte';

	import GlobalMarket from '../components/GlobalMarket.svelte';
	import ChiliIcon from '../components/icons/Chili.svelte';
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
	<GlobalMarket />

	<h1><ChiliIcon width={35} height={35} /> Paprika Viewer</h1>

	<h2>News</h2>

	{#if news.length === 0}
		<em>No news available</em>
	{/if}

	{#if news.length > 0}
		<div class="news">
			{#each news as newsItem}
				<div class="news-item">
					<h2>{newsItem.title}</h2>
					<p>{newsItem.published_at}</p>
					<Button variant="primary" href={newsItem.url}>Read more</Button>

					{#each newsItem.currencies as currency}
						<Chip variant="secondary">{currency}</Chip>
					{/each}
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
		display: flex;
		align-items: flex-end;
		gap: 8px;
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
		background-color: var(--color-grey-100);
		padding: 16px;
		border-radius: 4px;
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
