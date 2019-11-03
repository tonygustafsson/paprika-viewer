<script>
    import { global } from '../stores/global';
</script>

<style>
    .lds-ring {
        display: inline-block;
        position: absolute;
        top: calc(50% - 64px);
        left: calc(50% - 64px);
        width: 128px;
        height: 128px;
    }

    .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 108px;
        height: 108px;
        margin: 10px;
        border: 10px solid #f10;
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #f10 transparent transparent transparent;
    }

    .lds-ring div:nth-child(1) {
        animation-delay: -0.45s;
    }

    .lds-ring div:nth-child(2) {
        animation-delay: -0.3s;
    }

    .lds-ring div:nth-child(3) {
        animation-delay: -0.15s;
    }

    @keyframes lds-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>

{#if $global.loading}
    <div class="lds-ring">
        <div />
        <div />
        <div />
        <div />
    </div>
{/if}
