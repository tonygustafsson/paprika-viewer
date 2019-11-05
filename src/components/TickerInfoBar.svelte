<script>
    import { selectedTicker } from '../stores/selectedTicker';

    const closeBar = () => {
        selectedTicker.set(null);
    };
</script>

<style>
    .coin-info-bar {
        position: fixed;
        left: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 100px;
        background-color: #111;
        border-top: 1px #383838 solid;
        z-index: 2;
    }

    .content {
        width: 80%;
        margin: 0 10%;
    }

    .name {
        font-size: 150%;
        margin: 0 0 0.5em 0;
    }

    a {
        color: #fff;
    }

    .close-button {
        position: absolute;
        top: 0;
        right: 10px;
        text-decoration: none;
        font-size: 200%;
    }

    .graph-img {
        margin: 0 4px 4px 0;
        vertical-align: middle;
    }

    .graph-img.positive {
        filter: hue-rotate(210deg);
    }

    .graph-img.negative {
        filter: hue-rotate(115deg);
    }
</style>

{#if $selectedTicker}
    <div class="coin-info-bar">
        <div class="content">
            <p class="name">
                <a target="_blank" href="https://coinpaprika.com/coin/{$selectedTicker.id}">{$selectedTicker.name}</a>
                ${$selectedTicker.quotes.USD.price.toFixed(2)}
            </p>
            24h ({$selectedTicker.quotes.USD.percent_change_24h}%):
            <img
                loading="lazy"
                class="graph-img"
                class:positive={$selectedTicker.quotes.USD.percent_change_24h >= 0}
                class:negative={$selectedTicker.quotes.USD.percent_change_24h < 0}
                width="120"
                height="23"
                src="https://graphs{Math.random() > 0.5 ? '2' : ''}.coinpaprika.com/currency/chart/{$selectedTicker.id}/24h/chart.svg"
                alt="" />
            7d ({$selectedTicker.quotes.USD.percent_change_7d}%):
            <img
                loading="lazy"
                class="graph-img"
                class:positive={$selectedTicker.quotes.USD.percent_change_7d >= 0}
                class:negative={$selectedTicker.quotes.USD.percent_change_7d < 0}
                width="120"
                height="23"
                src="https://graphs{Math.random() > 0.5 ? '2' : ''}.coinpaprika.com/currency/chart/{$selectedTicker.id}/7d/chart.svg"
                alt="" />
            30d ({$selectedTicker.quotes.USD.percent_change_30d}%):
            <img
                loading="lazy"
                class="graph-img"
                class:positive={$selectedTicker.quotes.USD.percent_change_30d >= 0}
                class:negative={$selectedTicker.quotes.USD.percent_change_30d < 0}
                width="120"
                height="23"
                src="https://graphs{Math.random() > 0.5 ? '2' : ''}.coinpaprika.com/currency/chart/{$selectedTicker.id}/30d/chart.svg"
                alt="" />
        </div>

        <a class="close-button" href on:click|preventDefault={() => closeBar()}>×</a>
    </div>
{/if}
