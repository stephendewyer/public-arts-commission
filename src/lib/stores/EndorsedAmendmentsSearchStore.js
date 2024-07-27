import { writable } from 'svelte/store';
import { SearchEndorsementsByStreetAddressFilter } from '$lib/utils/SearchEndorsementsByStreetAddressFilter';

export const createEndorsedAmendmentsSearchStore = (/** @type {SearchAmendmentWithSponsorsAndImage[]} */ data) => {

    const { subscribe, set, update } = writable({
        data: data,
        filtered: data,
        search: {
            year_released: "",
            year_election: "",
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

export const searchEndorsedAmendmentsHandler = (/** @type {any} */ store) => {

    const searchYearRelease = store.search.year_released?.toString();
    const searchYearElection = store.search.year_election?.toString();
    
    // filter the endorsed candidates data
    store.filtered = store.data.filter((/** @type {any} */ item) => {
        // apply year filter first

        // if search by year is empty, continue with search by street address

        if (searchYearElection === "" && searchYearRelease === "") {

            return SearchEndorsementsByStreetAddressFilter(store, item);

        // else if search year matches item searchTerm year, continue with filters

        } else if ((new Date(item.searchTerms.year_election).getFullYear().toString()) === searchYearElection || item.searchTerms.year_released === searchYearRelease) {

            return SearchEndorsementsByStreetAddressFilter(store, item);

        } else {

            return;

        };

    });

};