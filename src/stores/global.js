import { writable } from 'svelte/store';

const initValue = {
    loading: true
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
        }
    };
};

export const global = globalStore();
