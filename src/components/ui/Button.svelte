<script lang="ts">
</script>

<button on:click><slot /></button>

<style>
	button {
		padding: 0.5em 1em;
		margin: 1em 0.5em;
		background-color: var(--color-secondary);
		border-radius: var(--border-radius);
		color: #fff;
		border: 0;
		font-size: 100%;
		cursor: pointer;
		transition: background-color 150ms ease-in-out;
	}

	button:hover {
		background-color: var(--color-secondary-hover);
	}
</style>
