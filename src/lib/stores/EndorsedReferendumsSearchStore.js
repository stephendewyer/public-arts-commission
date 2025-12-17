import { writable } from 'svelte/store';
import { SearchEndorsementsByStreetAddressFilter } from '$lib/utils/SearchEndorsementsByStreetAddressFilter';

export const createEndorsedReferendumsSearchStore = (/** @type {SearchReferendumWithImage[]} */ data) => {

    const { subscribe, set, update } = writable({
        data: data,
        filtered: data,
        search: {
            year: "",
            government_level: "",
            state: "",
            county: "",
            city: "",
            name: ""
        },
    });

    return {
        subscribe,
        set,
        update,
    };
};

export const searchEndorsedReferendumsHandler = (/** @type {any} */ store) => {

    const searchYear = store.search.year.toString();

    // filter the endorsed candidates data
    store.filtered = store.data.filter((/** @type {any} */ item) => {

        // apply year filter first

        // if search by year is empty, continue with search by street address

        if (searchYear === "") {

            return SearchEndorsementsByStreetAddressFilter(store, item);

        // else if search year matches item searchTerm year, continue with filters

        } else if (item.searchTerms.year === searchYear) {

            return SearchEndorsementsByStreetAddressFilter(store, item);

        } else {

            return;

        };

    });

};