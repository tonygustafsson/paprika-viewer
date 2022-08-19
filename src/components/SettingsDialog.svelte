<script lang="ts">
	import { filter } from '../stores/filter';
	import { settings } from '../stores/settings';
	import { sort } from '../stores/sort';
	import type { Currency } from '../types';
	import Button from './ui/Button.svelte';
	import Dialog from './ui/Dialog.svelte';
	import RadioGroup from './ui/RadioGroup.svelte';
	import Switch from './ui/Switch.svelte';

	export let open: boolean;
	export let onClose: () => void;

	const filterFavorites = (e: Event) => {
		filter.setFavorites((e.target as HTMLInputElement).checked);
	};

	const setReferenceCurrency = (e: Event) => {
		settings.setReferenceCurrency((e.target as HTMLInputElement).value as Currency);
	};

	const reset = () => {
		sort.reset();
		filter.reset();
		onClose();
	};
</script>

<Dialog title="Settings" {open} {onClose}>
	<div class="filters">
		<div class="filter-item">
			<Switch
				label="Favorites only"
				name="filter-favorites"
				checked={$filter.favorites}
				on:change={(e) => filterFavorites(e)}
			/>
		</div>

		<div class="filter-item">
			<RadioGroup
				name="referenceCurrency"
				label="Reference currency"
				on:change={(e) => setReferenceCurrency(e)}
				items={[
					{ label: 'USD', value: 'USD', checked: $settings.referenceCurrency === 'USD' },
					{ label: 'BTC', value: 'BTC', checked: $settings.referenceCurrency === 'BTC' },
					{ label: 'SEK', value: 'SEK', checked: $settings.referenceCurrency === 'SEK' }
				]}
			/>
		</div>
	</div>

	<div slot="actions" class="actions">
		<Button size="medium" on:click={reset}>Reset</Button>
		<Button variant="primary" size="medium" on:click={onClose}>Show results</Button>
	</div>
</Dialog>

<style>
	.filters {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
	}

	.filter-item {
		flex: 1 0 0;
		align-items: center;
		margin: 8px 0;
	}

	.actions {
		display: flex;
		gap: 12px;
		margin-top: 12px;
	}
</style>
