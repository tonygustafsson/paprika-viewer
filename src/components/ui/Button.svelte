<script lang="ts">
	export let variant: 'primary' | 'secondary' = 'secondary';
	export let size: 'small' | 'medium' = 'small';
</script>

<button on:click class:medium={size === 'medium'} class:primary={variant === 'primary'}>
	<div class="icon">
		<slot name="icon" />
	</div>

	<slot />
</button>

<style>
	button {
		display: flex;
		align-items: center;
		gap: 0.5em;
		font-family: var(--font-family);
		padding: 0.5em 1em;
		margin: 0.5em 0.25em;
		background-color: var(--color-secondary);
		border-radius: var(--border-radius);
		color: #fff;
		border: 0;
		font-size: 100%;
		cursor: pointer;
		transition: background-color 150ms ease-in-out;
	}

	button.primary {
		background-color: var(--color-red-500);
	}

	button.medium {
		font-size: 0.85rem;
		padding: 0.5em 1em;
	}

	@media screen and (min-width: 1000px) {
		button {
			margin: 1em 0.5em;
		}

		button.medium {
			font-size: 1rem;
			padding: 0.75em 1.5em;
		}
	}

	button:hover {
		background-color: var(--color-secondary-hover);
	}

	button.primary:hover {
		background-color: var(--color-red-600);
	}

	.icon {
		display: flex;
		color: white;
		align-items: center;
	}
</style>
