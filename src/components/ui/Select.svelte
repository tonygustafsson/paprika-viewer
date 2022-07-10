<script lang="ts">
	export let id: string;
	export let name: string;
	export let value: string;
</script>

<select {id} {name} {value} on:change><slot /></select>

<style>
	select {
		padding: 0.5em 1em;
		margin: 0.2em 0.5em;
		background-color: var(--color-primary);
		border-radius: var(--border-radius);
		color: #fff;
		font-size: 100%;
		border: 0;
		vertical-align: middle;
		transition: background-color 150ms ease-in-out;
	}

	select:hover {
		background-color: var(--color-primary-hover);
	}
</style>
