<script lang="ts">
	import { onMount } from 'svelte';

	export let open = false;
	export let onClose: (e: MouseEvent | KeyboardEvent) => void;
	export let title: string;
	export let iconUrl: string;

	let dialog: HTMLDialogElement;

	const escapeListener = (e: KeyboardEvent) => {
		if (e.code === 'Escape') {
			onClose(e);
		}
	};

	onMount(() => {
		dialog.addEventListener('keydown', escapeListener);

		return () => {
			dialog.removeEventListener('keydown', escapeListener);
		};
	});

	$: if (open && dialog) {
		dialog.showModal();
	} else if (dialog) {
		dialog.close();
	}
</script>

<dialog bind:this={dialog}>
	<button on:click={onClose}>&#x2715</button>

	{#if title}
		<p class="title">
			{#if iconUrl}
				<img width="24" height="24" src={iconUrl} class="icon" alt="" />
			{/if}

			{title}
		</p>
	{/if}

	<slot />

	<div class="actions">
		<slot name="actions" />
	</div>
</dialog>

<style>
	dialog {
		position: relative;
		width: 600px;
		max-width: 85vw;
		border-radius: 2px;
		color: white;
		background-color: var(--color-grey-500);
		padding: 16px;
		border: none;
		box-shadow: 0 0 0px 4px #2b2a2a9c;
		overflow-y: auto;
	}

	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.8);
	}

	.title {
		display: flex;
		margin-top: 0;
		padding-bottom: 0.5em;
		font-size: 1.25rem;
		border-bottom: 1px #3b3b3b solid;
		margin-bottom: 24px;
	}

	.title img {
		margin-right: 0.5em;
	}

	button {
		position: absolute;
		top: 12px;
		right: 10px;
		background-color: transparent;
		border: none;
		color: white;
		cursor: pointer;
		font-size: 1.5rem;
	}

	:global(.actions > div) {
		display: flex;
		justify-content: flex-end;
	}
</style>
