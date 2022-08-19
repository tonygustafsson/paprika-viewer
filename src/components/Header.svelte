<script lang="ts">
	import GlobalMarket from '../components/GlobalMarket.svelte';
	import ChiliIcon from '../components/icons/Chili.svelte';
	import { page } from '$app/stores';

	export let isStartPage: boolean | undefined = undefined;
</script>

<GlobalMarket />

<div class="wrapper">
	{#if isStartPage}
		<h1>
			<a href="/" class="logo">
				<ChiliIcon width={35} height={35} /> Paprika Viewer
			</a>
		</h1>
	{/if}

	{#if !isStartPage}
		<a href="/" class="logo">
			<ChiliIcon width={35} height={35} /> Paprika Viewer
		</a>
	{/if}

	<nav>
		<ul>
			<li>
				<a href="/" class:active={$page.url.pathname === '/'}>Tickers</a>
			</li>
			<li>
				<a href="/news" class:active={$page.url.pathname === '/news'}>News</a>
			</li>
		</ul>
	</nav>
</div>

<style>
	.wrapper {
		display: flex;
		align-items: flex-end;
		gap: 48px;
		margin-block: 48px;
	}

	nav ul {
		display: flex;
		gap: 24px;
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	nav ul li {
		display: inline-block;
		font-size: 1.25rem;
	}

	nav ul li a.active {
		text-decoration: underline;
	}

	a {
		color: #fff;
		text-decoration: none;
	}

	h1 {
		margin: 0;
	}

	.logo {
		display: flex;
		align-items: flex-end;
		gap: 8px;
		font-size: 1.75rem;
		font-weight: bold;
	}
</style>
