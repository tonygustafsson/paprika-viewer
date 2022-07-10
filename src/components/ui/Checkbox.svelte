<script lang="ts">
	export let label: string;
	export let name: string;
	export let checked: boolean;
</script>

<label>
	{label}
	<input type="checkbox" {name} {checked} on:change />
</label>

<style>
	input {
		margin: 2px 0 0 0;
	}

	label {
		display: flex;
		align-items: center;
		gap: 8px;
	}
</style>
