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
            if (currency !== 'usd' && currency !== 'sek' && currency !== 'btc' && currency !== 'eth') {
                return;
            }

            update(global => {
                let newGlobal = { ...global };
                newGlobal.referenceCurrency = currency;

                let currencySymbol = '';

                switch (currency) {
                    case 'sek':
                        currencySymbol = 'kr';
                        break;
                    case 'btc':
                        currencySymbol = '₿';
                        break;
                    case 'eth':
                        currencySymbol = 'E';
                        break;
                    default:
                        currencySymbol = '$';
                }

                newGlobal.currencySymbol = currencySymbol;
                return newGlobal;
            });
        }
    };
};

export const global = globalStore();
