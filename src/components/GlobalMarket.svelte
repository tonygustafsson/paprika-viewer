<script lang="ts">
	import { globalMarket } from '../stores/globalMarket';
	import { priceToHuman } from '../utils/number';
</script>

<ul>
	<li>Total marketcap: ${priceToHuman($globalMarket.market_cap_usd)}</li>
	<li>Total 24h volume: ${priceToHuman($globalMarket.volume_24h_usd)}</li>
	<li>BTC Dominance: {priceToHuman($globalMarket.bitcoin_dominance_percentage)}%</li>
</ul>

<style>
	ul {
		display: flex;
		max-width: 100%;
		height: 16px;
		overflow-x: auto;
		list-style: none;
		padding: 0;
		margin: 0;
		color: #fff;
		white-space: nowrap;
		gap: 15px;
	}

	ul::-webkit-scrollbar {
		display: none;
	}

	@media screen and (min-width: 1000px) {
		ul {
			justify-content: flex-end;
		}
	}
</style>
