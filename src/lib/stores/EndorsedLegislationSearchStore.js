import { writable } from 'svelte/store';

export const createEndorsedLegislationSearchStore = (/** @type {any} */ data) => {

    const { subscribe, set, update } = writable({
        data: data,
        filtered: data,
        search: "",
    });

    return {
        subscribe,
        set,
        update,
    };
}