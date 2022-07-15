<script lang="ts">
</script>

<div class="chip" on:click>
	<slot />

	<div class="icon">&times;</div>
</div>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		background-color: var(--color-red-500);
		color: #fff;
		padding: 0.5rem;
		border-radius: 8px;
		cursor: pointer;
		margin-bottom: 12px;
		margin-right: 8px;
	}

	.chip:hover {
		background-color: var(--color-red-600);
	}

	.icon {
		margin-left: 8px;
	}
</style>
