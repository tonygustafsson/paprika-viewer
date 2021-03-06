import { writable } from 'svelte/store';

const initValue = {
    by: '24h',
    direction: 'desc'
};

const orderStore = () => {
    const { subscribe, set, update } = writable(initValue);

    return {
        subscribe,
        setOrderBy: orderBy => {
            update(order => {
                let newOrder = { ...order };
                newOrder.by = orderBy;
                newOrder.direction = newOrder.direction === 'asc' ? 'desc' : 'asc';
                return newOrder;
            });
        }
    };
};

export const order = orderStore();
