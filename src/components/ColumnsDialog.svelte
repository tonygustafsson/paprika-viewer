<script lang="ts">
	import { columns } from '../stores/columns';
	import Button from './ui/Button.svelte';
	import Dialog from './ui/Dialog.svelte';
	import Switch from './ui/Switch.svelte';

	export let open: boolean;
	export let onClose: () => void;

	const reset = () => {
		columns.reset();
		onClose();
	};
</script>

<Dialog title="Columns" {open} {onClose}>
	<div class="column-switches">
		<div class="column-switch">
			<Switch
				label="Rank"
				name="rank"
				checked={$columns.rank}
				on:change={() => columns.toggle('rank')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Symbol"
				name="symbol"
				checked={$columns.symbol}
				on:change={() => columns.toggle('symbol')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Name"
				name="name"
				checked={$columns.name}
				on:change={() => columns.toggle('name')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Price"
				name="price"
				checked={$columns.price}
				on:change={() => columns.toggle('price')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="MarketCap"
				name="marketcap"
				checked={$columns.marketcap}
				on:change={() => columns.toggle('marketcap')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Volume 24h"
				name="volume_24h"
				checked={$columns.volume_24h}
				on:change={() => columns.toggle('volume_24h')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Beta value"
				name="beta_value"
				checked={$columns.beta_value}
				on:change={() => columns.toggle('beta_value')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Creation date"
				name="first_data_at"
				checked={$columns.first_data_at}
				on:change={() => columns.toggle('first_data_at')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Change 1h"
				name="change-1h"
				checked={$columns.change_1h}
				on:change={() => columns.toggle('change_1h')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Change 12h"
				name="change-12h"
				checked={$columns.change_12h}
				on:change={() => columns.toggle('change_12h')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Change 24h"
				name="change-24h"
				checked={$columns.change_24h}
				on:change={() => columns.toggle('change_24h')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Change 7d"
				name="change-7d"
				checked={$columns.change_7d}
				on:change={() => columns.toggle('change_7d')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Change 30d"
				name="change-30d"
				checked={$columns.change_30d}
				on:change={() => columns.toggle('change_30d')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Change 1y"
				name="change-1y"
				checked={$columns.change_1y}
				on:change={() => columns.toggle('change_1y')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="All time high"
				name="change-ath"
				checked={$columns.ath}
				on:change={() => columns.toggle('ath')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Tags"
				name="tags"
				checked={$columns.tags}
				on:change={() => columns.toggle('tags')}
			/>
		</div>
		<div class="column-switch">
			<Switch
				label="Exchanges"
				name="exchanges"
				checked={$columns.exchanges}
				on:change={() => columns.toggle('exchanges')}
			/>
		</div>
	</div>

	<div slot="actions">
		<Button size="medium" on:click={reset}>Reset</Button>
		<Button variant="primary" size="medium" on:click={onClose}>Show results</Button>
	</div>
</Dialog>

<style>
	.column-switches {
		display: flex;
		flex-wrap: wrap;
	}

	.column-switch {
		width: 50%;
		margin-bottom: 12px;
	}
</style>
