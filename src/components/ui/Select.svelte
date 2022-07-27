<script lang="ts">
	export let id: string;
	export let name: string;
	export let value: string | number;
	export let label: string;
</script>

<label for={id}> {label}</label>
<select {id} {name} {value} on:change><slot /></select>

<style>
	select {
		width: 100%;
		font-family: var(--font-family);
		padding: 0.5em 0.5em;
		margin: 0.5em 0;
		background-color: var(--color-secondary);
		border-radius: var(--border-radius);
		color: #fff;
		font-size: 100%;
		border: 0;
		vertical-align: middle;
		transition: background-color 150ms ease-in-out;
	}

	select:hover {
		background-color: var(--color-secondary-hover);
	}

	label {
		display: block;
	}
</style>
