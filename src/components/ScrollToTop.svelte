<script lang="ts">
	import Arrow from './icons/Arrow.svelte';
	import Button from './ui/Button.svelte';

	export let scrollTable: HTMLDivElement;

	const scrollToTop = () => {
		scrollTable.scrollTo({ top: 0, behavior: 'smooth' });
	};
</script>

<div class="scroll-to-top">
	<Button on:click={scrollToTop}>
		Top
		<div slot="icon" class="icon">
			<Arrow width={16} height={16} direction="up" />
		</div>
	</Button>
</div>

<style>
	.scroll-to-top {
		position: fixed;
		bottom: 20px;
		right: 20px;
	}

	.icon {
		display: flex;
		align-items: center;
	}
</style>
