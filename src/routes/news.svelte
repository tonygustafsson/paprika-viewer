<script lang="ts">
	import '../theme.css';

	import { onMount } from 'svelte';

	import Header from '../components/Header.svelte';
	import type { GlobalMarket as GlobalMarketType, NewsItem } from 'src/types';
	import { globalMarket as globalMarketStore } from '../stores/globalMarket';
	import Chip from '../components/ui/Chip.svelte';
	import Button from '../components/ui/Button.svelte';
	import BookIcon from '../components/icons/Book.svelte';
	import SpeechBubbleIcon from '../components/icons/SpeechBubble.svelte';

	// Fetched from endpoint index.ts
	export let globalData: GlobalMarketType;
	export let news: NewsItem[];

	onMount(() => {
		globalMarketStore.save(globalData);
	});
</script>

<svelte:head>
	<title>News - Paprika Viewer</title>
</svelte:head>

<div class="container">
	<Header />

	<h1 class="hidden">News</h1>

	{#if news.length === 0}
		<em>No news available</em>
	{/if}

	{#if news.length > 0}
		<div class="news">
			{#each news as newsItem}
				<div class="news-item">
					<h2><a target="_blank" href={newsItem.url}>{newsItem.title}</a></h2>

					<div class="button-wrapper">
						<Button target="_blank" variant="primary" href={newsItem.url}>
							<div slot="icon" class="icon">
								<BookIcon width={16} height={16} />
							</div>
							Read more
						</Button>

						<Button target="_blank" variant="secondary" href={newsItem.url}>
							<div slot="icon" class="icon">
								<SpeechBubbleIcon width={16} height={16} />
							</div>
							Discuss on CryptoPanic
						</Button>
					</div>

					<div class="info-bar">
						{#if newsItem.currencies.length === 0}
							<Chip variant="secondary">General</Chip>
						{/if}

						{#if newsItem.currencies.length > 0}
							{#each newsItem.currencies as currency}
								<Chip variant="secondary">{currency}</Chip>
							{/each}
						{/if}

						<time class="time">{newsItem.published_at}</time>
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
		font-size: 1.1rem;
	}

	h2 a {
		color: inherit;
		text-decoration: none;
	}

	.hidden {
		display: none;
	}

	.button-wrapper {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.time {
		color: var(--color-grey-25);
		font-size: 1rem;
		margin-left: auto;
	}

	.link {
		color: #fff;
	}

	.icon {
		display: flex;
		align-items: center;
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
		background-color: var(--color-grey-500);
		padding: 16px;
		padding-bottom: 0px;
		border: 1px solid var(--color-grey-200);
		border-radius: 4px;
	}

	.info-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
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

		.button-wrapper {
			flex-direction: row;
			align-items: center;
		}

		h2 {
			font-size: 1.25rem;
		}
	}
</style>
