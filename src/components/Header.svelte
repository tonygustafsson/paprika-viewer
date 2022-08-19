<script lang="ts">
	import GlobalMarket from '../components/GlobalMarket.svelte';
	import ChiliIcon from '../components/icons/Chili.svelte';

	export let isStartPage: boolean | undefined = undefined;
</script>

<GlobalMarket />

{#if isStartPage}
	<h1>
		<a href="/">
			<ChiliIcon width={35} height={35} /> Paprika Viewer
		</a>
	</h1>
{/if}

{#if !isStartPage}
	<span class="logo">
		<a href="/">
			<ChiliIcon width={35} height={35} /> Paprika Viewer
		</a>
	</span>
{/if}

<style>
	h1 {
		display: flex;
		align-items: flex-end;
		gap: 8px;
		font-size: 1.75rem;
		margin-block: 0.75em;
	}

	a {
		color: #fff;
		text-decoration: none;
	}

	.logo {
		display: flex;
		align-items: flex-end;
		gap: 8px;
		margin-block: 0.75em;
		font-size: 1.75rem;
		font-weight: bold;
	}
</style>
