import { writable } from 'svelte/store';
import States from '$lib/data/states.titlecase.json';
import { SearchEndorsementsByStreetAddressFilter } from '$lib/utils/SearchEndorsementsByStreetAddressFilter';

export const createEndorsedCandidatesSearchStore = (/** @type {any} */ data) => {

    const { subscribe, set, update } = writable({
        data: data,
        filtered: data,
        search: {
            year: "",
            government_level: "",
            state: "",
            county: "",
            city: ""
        },
    });

    return {
        subscribe,
        set,
        update,
    };
};

export const searchEndorsedCandidatesHandler = (/** @type {any} */ store) => {

    const searchYear = store.search.year.toString();

    let handledStateName;

    let handleStateName = false;

    States.forEach((state) => {

        if (state.abbreviation === store.search.state) {

            handleStateName = true;

            handledStateName = state.name.toLowerCase();

        };

    });

    const searchCity = store.search.city?.toLowerCase();
    const searchCounty = store.search.county?.toLowerCase();

    /**
     * @type {string | any}
     */
    let searchState;

    if (handleStateName) {

        searchState = handledStateName;

    } else {

        searchState = store.search.state?.toLowerCase();

    };

    const searchGovernmentLevel = store.search.government_level?.toLowerCase();
    // filter the endorsed candidates data

    console.log(`search year: ${searchYear}, search federal: ${searchGovernmentLevel}, search state: ${searchState}, search county: ${searchCounty}, search city: ${searchCity}`)

    store.filtered = store.data.filter((/** @type {any} */ item) => {

        // apply year filter first

        // if search by year is empty, continue with search by street address

        if (searchYear === "") {

            return SearchEndorsementsByStreetAddressFilter(searchState, searchCounty, searchCity, item);

        // else if search year matches item searchTerm year, continue with filters

        } else if (item.searchTerms.year === searchYear) {

            return SearchEndorsementsByStreetAddressFilter(searchState, searchCounty, searchCity, item);

        } else {

            return;

        };

    });

};