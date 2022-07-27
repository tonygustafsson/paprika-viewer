<script lang="ts">
	import ColumnsDialog from './ColumnsDialog.svelte';
	import FilterDialog from './FilterDialog.svelte';
	import ColumnsIcon from './icons/Columns.svelte';
	import FilterIcon from './icons/Filter.svelte';
	import Button from './ui/Button.svelte';

	$: filterDialogOpen = false;
	$: columnsDialogOpen = false;
</script>

<div class="filters">
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
	</div>
</div>

<FilterDialog open={filterDialogOpen} onClose={() => (filterDialogOpen = false)} />
<ColumnsDialog open={columnsDialogOpen} onClose={() => (columnsDialogOpen = false)} />

<style>
	.filters {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
	}

	.filter-buttons {
		display: flex;
		align-items: center;
		margin: 8px 0;
	}

	.icon {
		display: flex;
		align-items: center;
	}
</style>
