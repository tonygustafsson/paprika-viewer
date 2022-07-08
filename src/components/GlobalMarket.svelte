<script lang="ts">
	import { onMount } from 'svelte';
	import { globalMarket } from '../stores/globalMarket';
	import { getGlobalMarket } from '../utils/getGlobalMarket';

	onMount(async () => {
		getGlobalMarket();
	});
</script>

<ul>
	<li>Total marketcap: ${$globalMarket.market_cap_usd}</li>
	<li>Total 24h volume: ${$globalMarket.volume_24h_usd}</li>
	<li>BTC Dominance: {$globalMarket.bitcoin_dominance_percentage}%</li>
</ul>

<style>
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		text-align: right;
	}

	li {
		display: block;
		color: #8b8b8b;
	}

	@media screen and (min-width: 1000px) {
		li {
			display: inline-block;
			margin-right: 2em;
		}
		li:last-child {
			margin-right: 0;
		}
	}
</style>
