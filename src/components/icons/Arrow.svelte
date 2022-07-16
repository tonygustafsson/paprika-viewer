<script lang="ts">
	export let width: number;
	export let height: number;
	export let direction: 'up' | 'down' | 'right' | 'left' = 'right';
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{height}
	{width}
	fill="none"
	stroke="currentColor"
	stroke-linecap="round"
	stroke-linejoin="round"
	stroke-width="2"
	class="feather feather-arrow-up"
	viewBox="0 0 24 24"
>
	{#if direction === 'up'}
		<path d="M12 19V5M5 12l7-7 7 7" />
	{/if}
	{#if direction === 'down'}
		<path d="M12 5v14M19 12l-7 7-7-7" />
	{/if}
	{#if direction === 'right'}
		<path d="M5 12h14M12 5l7 7-7 7" />
	{/if}
	{#if direction === 'left'}
		<path d="M19 12H5M12 19l-7-7 7-7" />
	{/if}
</svg>
