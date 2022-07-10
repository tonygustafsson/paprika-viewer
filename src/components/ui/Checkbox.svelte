<script lang="ts">
	export let name: string;
	export let id: string;
	export let checked: boolean;
</script>

<label for="filter-favorites">
	Favs only:
	<input type="checkbox" {id} {name} {checked} on:change />
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
