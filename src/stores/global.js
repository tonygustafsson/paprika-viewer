import { writable } from 'svelte/store';

const initValue = {
    loading: true,
    referenceCurrency: 'usd',
    currencySymbol: '$'
};

const globalStore = () => {
    const { subscribe, set, update } = writable(initValue);

    return {
        subscribe,
        isLoading: isLoading => {
            update(global => {
                let newGlobal = { ...global };
                newGlobal.loading = isLoading;
                return newGlobal;
            });
        },
        setReferenceCurrency: currency => {
            if (currency !== 'usd' && currency !== 'btc') return;

            update(global => {
                let newGlobal = { ...global };
                newGlobal.referenceCurrency = currency;
                newGlobal.currencySymbol = currency === 'usd' ? '$' : '₿';
                return newGlobal;
            });
        }
    };
};

export const global = globalStore();
