<script lang="ts">
	import Button from './ui/Button.svelte';

	export let scrollTable: HTMLDivElement;

	const scrollToTop = () => {
		scrollTable.scrollTo({ top: 0, behavior: 'smooth' });
	};
</script>

<div class="scroll-to-top">
	<Button on:click={scrollToTop}>Top ↑</Button>
</div>

<style>
	.scroll-to-top {
		position: fixed;
		bottom: 20px;
		right: 20px;
	}
</style>
