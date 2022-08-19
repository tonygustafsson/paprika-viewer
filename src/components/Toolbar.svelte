<script lang="ts">
	import type { Currency } from 'src/types';
	import { filter } from '../stores/filter';
	import { settings } from '../stores/settings';
	import ColumnsDialog from './ColumnsDialog.svelte';
	import FilterDialog from './FilterDialog.svelte';
	import ColumnsIcon from './icons/Columns.svelte';
	import FilterIcon from './icons/Filter.svelte';
	import SearchIcon from './icons/Search.svelte';
	import SettingsIcon from './icons/Settings.svelte';
	import SettingsDialog from './SettingsDialog.svelte';
	import Button from './ui/Button.svelte';
	import RadioGroup from './ui/RadioGroup.svelte';
	import Switch from './ui/Switch.svelte';
	import Textfield from './ui/Textfield.svelte';

	$: filterDialogOpen = false;
	$: columnsDialogOpen = false;
	$: settingsDialogOpen = false;
	$: mobileSearchOpen = false;

	const filterFavorites = (e: Event) => {
		filter.setFavorites((e.target as HTMLInputElement).checked);
	};

	const setReferenceCurrency = (e: Event) => {
		settings.setReferenceCurrency((e.target as HTMLInputElement).value as Currency);
	};

	const search = (e: Event) => {
		filter.setSearch((e.target as HTMLInputElement).value);
	};
</script>

<div class="toolbar">
	<div class="filter-buttons">
		<Button size="medium" on:click={() => (filterDialogOpen = true)}>
			<div slot="icon" class="icon">
				<FilterIcon width={16} height={16} />
			</div>
			Filters
		</Button>

		<Button size="medium" on:click={() => (columnsDialogOpen = true)}>
			<div slot="icon" class="icon">
				<ColumnsIcon width={16} height={16} />
			</div>
			Columns
		</Button>

		<div class="mobile-buttons">
			<Button size="medium" on:click={() => (settingsDialogOpen = true)}>
				<div slot="icon" class="icon">
					<SettingsIcon width={16} height={16} />
				</div>
			</Button>

			<Button size="medium" on:click={() => (mobileSearchOpen = !mobileSearchOpen)}>
				<div slot="icon" class="icon">
					<SearchIcon width={16} height={16} />
				</div>
			</Button>
		</div>
	</div>

	<div class="desktop-filters">
		<div>
			<Switch
				label="Favorites only"
				name="filter-favorites"
				checked={$filter.favorites}
				on:change={(e) => filterFavorites(e)}
			/>
		</div>

		<div>
			<RadioGroup
				name="dashboardReferenceCurrency"
				on:change={(e) => setReferenceCurrency(e)}
				items={[
					{ label: 'USD', value: 'USD', checked: $settings.referenceCurrency === 'USD' },
					{ label: 'BTC', value: 'BTC', checked: $settings.referenceCurrency === 'BTC' },
					{ label: 'SEK', value: 'SEK', checked: $settings.referenceCurrency === 'SEK' }
				]}
			/>
		</div>

		<div class="margin-left-auto">
			<Textfield
				label="Search"
				id="filter-search"
				name="filter-search"
				value={$filter.search}
				on:change={search}
				on:click={() => alert('OKi')}
			/>
		</div>
	</div>
</div>

{#if mobileSearchOpen}
	<div class="mobile-search">
		<Textfield
			label="Search"
			id="filter-search"
			name="filter-search"
			value={$filter.search}
			on:change={search}
		/>
	</div>
{/if}

<FilterDialog open={filterDialogOpen} onClose={() => (filterDialogOpen = false)} />
<ColumnsDialog open={columnsDialogOpen} onClose={() => (columnsDialogOpen = false)} />
<SettingsDialog open={settingsDialogOpen} onClose={() => (settingsDialogOpen = false)} />

<style>
	.toolbar {
		display: flex;
		align-items: center;
	}

	.filter-buttons {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.mobile-buttons {
		display: flex;
		align-items: center;
		width: 100%;
		gap: 8px;
	}

	.mobile-search {
		width: 100%;
		margin-top: 12px;
	}

	.margin-left-auto {
		margin-left: auto;
	}

	.desktop-filters {
		display: none;
	}

	.icon {
		display: flex;
		align-items: center;
	}

	@media screen and (min-width: 1000px) {
		.toolbar {
			gap: 32px;
		}

		.mobile-buttons {
			display: none;
		}

		.mobile-search {
			display: none;
		}

		.desktop-filters {
			display: flex;
			align-items: center;
			gap: 24px;
			width: 100%;
		}
	}
</style>
