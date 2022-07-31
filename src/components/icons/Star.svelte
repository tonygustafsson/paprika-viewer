<script lang="ts">
	export let width: number;
	export let height: number;
	export let filled: boolean;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	xml:space="preserve"
	viewBox="0 0 24 24"
	fill={filled ? '#fff' : 'transparent'}
	stroke="currentColor"
	stroke-linecap="round"
	stroke-linejoin="round"
	stroke-width="2"
	{width}
	{height}
>
	<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" />
</svg>
