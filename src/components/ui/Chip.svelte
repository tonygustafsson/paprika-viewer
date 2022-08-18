<script lang="ts">
	export let variant: 'primary' | 'secondary' = 'primary';
	export let showCloseIcon: boolean = false;
</script>

<div
	class="chip"
	class:primary={variant === 'primary'}
	class:chip-closable={showCloseIcon}
	on:click
>
	<slot />

	{#if showCloseIcon}
		<div class="icon">&times;</div>
	{/if}
</div>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		background-color: var(--color-grey-500);
		color: #fff;
		padding: 0.5rem;
		border-radius: 8px;
		margin-bottom: 12px;
		margin-right: 8px;
	}

	.primary {
		background-color: var(--color-red-500);
	}

	.chip-closable {
		cursor: pointer;
	}

	.chip-closable:hover {
		background-color: var(--color-red-600);
	}

	.icon {
		margin-left: 8px;
	}
</style>
