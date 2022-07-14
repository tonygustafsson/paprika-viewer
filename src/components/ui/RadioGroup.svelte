<script lang="ts">
	export let name: string;
	export let label: string;
	export let items: {
		label: string;
		value: string;
		checked?: boolean;
	}[];
</script>

{#if label}
	<p>{label}</p>
{/if}

<div class="wrapper">
	{#each items as item}
		<label>
			<input type="radio" {name} value={item.value} checked={item.checked} on:change />
			{item.label}
		</label>
	{/each}
</div>

<style>
	.wrapper {
		display: flex;
		gap: 12px;
	}

	input {
		margin: 2px 0 0 0;
		width: 16px;
		height: 16px;
	}

	label {
		display: flex;
		align-items: flex-end;
		gap: 4px;
	}
</style>
