<script>
    import { selectedTicker } from '../stores/selectedTicker';
    import { global } from '../stores/global';

    const closeBar = () => {
        selectedTicker.set(null);
    };
</script>

{#if $selectedTicker}
    <div class="coin-info-bar">
        <div class="content">
            <p class="name">
                <a target="_blank" href="https://coinpaprika.com/coin/{$selectedTicker.id}">{$selectedTicker.name}</a>
                {$global.currencySymbol}{$selectedTicker[$global.referenceCurrency].price}
            </p>

            <div class="graphs">
                <div class="graph-item">
                    <span class="graph-label">24h ({$selectedTicker[$global.referenceCurrency].change24h}%):</span>

                    <img
                        loading="lazy"
                        class="graph-img"
                        class:positive={$selectedTicker[$global.referenceCurrency].change24h >= 0}
                        class:negative={$selectedTicker[$global.referenceCurrency].change24h < 0}
                        width="120"
                        height="23"
                        src="https://graphs.coinpaprika.com/currency/chart/{$selectedTicker.id}/24h/chart.svg"
                        alt=""
                    />
                </div>

                <div class="graph-item">
                    <span class="graph-label">7d ({$selectedTicker[$global.referenceCurrency].change7d}%):</span>

                    <img
                        loading="lazy"
                        class="graph-img"
                        class:positive={$selectedTicker[$global.referenceCurrency].change7d >= 0}
                        class:negative={$selectedTicker[$global.referenceCurrency].change7d < 0}
                        width="120"
                        height="23"
                        src="https://graphs.coinpaprika.com/currency/chart/{$selectedTicker.id}/7d/chart.svg"
                        alt=""
                    />
                </div>

                <div class="graph-item">
                    <span class="graph-label">30d ({$selectedTicker[$global.referenceCurrency].change30d}%):</span>

                    <img
                        loading="lazy"
                        class="graph-img"
                        class:positive={$selectedTicker[$global.referenceCurrency].change30d >= 0}
                        class:negative={$selectedTicker[$global.referenceCurrency].change30d < 0}
                        width="120"
                        height="23"
                        src="https://graphs.coinpaprika.com/currency/chart/{$selectedTicker.id}/30d/chart.svg"
                        alt=""
                    />
                </div>
            </div>
        </div>

        <a class="close-button" href on:click|preventDefault={() => closeBar()}>×</a>
    </div>
{/if}

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
        padding: 10px 0;
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

    .graphs {
        display: inline-flex;
        flex-wrap: wrap;
    }

    .graph-item {
        flex: 1 0 0;
        margin-right: 15px;
    }

    .graph-label {
        display: block;
    }

    .graph-img {
        margin: 0 4px 4px 0;
        vertical-align: middle;
    }

    .graph-img.positive {
        filter: hue-rotate(230deg);
    }

    .graph-img.negative {
        filter: hue-rotate(115deg);
    }

    @media screen and (min-width: 1000px) {
        .graphs {
            margin-top: 10px;
        }
        .graph-item {
            margin-right: 50px;
        }
    }
</style>
