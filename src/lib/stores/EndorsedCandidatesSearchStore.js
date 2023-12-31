import { writable } from 'svelte/store';
import States from '$lib/data/states.titlecase.json';

export const createEndorsedCandidatesSearchStore = (/** @type {any} */ data) => {

    const { subscribe, set, update } = writable({
        data: data,
        filtered: data,
        search: {
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
     * @type {string | undefined | null}
     */
    let searchState;

    if (handleStateName) {

        searchState = handledStateName;

    } else {

        searchState = store.search.state?.toLowerCase();

    };

    const searchGovernmentLevel = store.search.government_level?.toLowerCase();
    // filter the endorsed candidates data

    console.log(`search federal: ${searchGovernmentLevel}, search state: ${searchState}, search county: ${searchCounty}, search city: ${searchCity}`)

    store.filtered = store.data.filter((/** @type {any} */ item) => {

        // if endorsed candidate object does not include lower-case store search state AND search state is not empty, remove from filtered array

        // if endorsed candidate object does not include lower-case store search county 
        // AND store search county is not empty
        // OR if store search county is not in store search state, remove from filtered array

        // if endorsed candidate object does not include lower-case store search city 
        // AND store search city is not empty,
        // OR if store search city is not in store search county
        // OR if store search city is not in store search state
        // remove from filtered array
        if (
            store.search.state === "" &&
            store.search.county === "" &&
            store.search.city === ""
        ) {

            return item;

        } else if (

            item.searchTerms.government_level.toLowerCase().includes("federal")

        ) {

            return item;

        } else if (
            store.search.state &&
            store.search.county &&
            store.search.city
        ) {

            if (
                (
                    item.searchTerms.state.toLowerCase().includes(searchState) &&
                    item.searchTerms.county.toLowerCase().includes(searchCounty) &&
                    item.searchTerms.city.toLowerCase().includes(searchCity)
                ) ||
                (
                    item.searchTerms.state.toLowerCase().includes(searchState) &&
                    item.searchTerms.county.toLowerCase().includes(searchCounty) &&
                    item.searchTerms.city.toLowerCase().includes(searchCity)
                ) ||
                (
                    item.searchTerms.state.toLowerCase().includes(searchState) &&
                    item.searchTerms.county.toLowerCase().includes(searchCounty)
                ) ||
                (
                    item.searchTerms.state.toLowerCase().includes(searchState)
                )
            ) {

                return item;

            };

        } else if (
            !store.search.state &&
            !store.search.county &&
            store.search.city
        ) {

            if (
                (
                    item.searchTerms.city.toLowerCase().includes(searchCity)
                )       

            ) {

                return item;

            };

        }  else if (
            !store.search.state &&
            store.search.county &&
            store.search.city
        ) {

            if (
                (   
                    item.searchTerms.county.toLowerCase().includes(searchCounty) &&
                    item.searchTerms.city.toLowerCase().includes(searchCity)
                ) ||
                (   
                    item.searchTerms.county.toLowerCase().includes(searchCounty)
                )
            ) {

                return item;

            };

        } else if (
            store.search.state &&
            store.search.county &&
            !store.search.city
        ) {

            if (
                (   
                    item.searchTerms.state.toLowerCase().includes(searchState) &&
                    item.searchTerms.county.toLowerCase().includes(searchCounty)
                ),
                (   
                    item.searchTerms.state.toLowerCase().includes(searchState)
                )         
            ) {

                return item;

            };

        }  else if (
            store.search.state &&
            !store.search.county &&
            store.search.city
        ) {

            if (
                (   
                    item.searchTerms.state.toLowerCase().includes(searchState) &&
                    item.searchTerms.city.toLowerCase().includes(searchCity)
                ),
                (   
                    item.searchTerms.state.toLowerCase().includes(searchState)
                )         
            ) {

                return item;

            };

        } else if (
            store.search.state &&
            !store.search.county &&
            !store.search.city
        ) {

            if (
                item.searchTerms.state.toLowerCase().includes(searchState)
            ) {

                return item;

            };

        } else if (
            !store.search.state &&
            store.search.county &&
            !store.search.city
        ) {

            if (
                item.searchTerms.county.toLowerCase().includes(searchCounty)
            ) {

                return item;

            };

        };

    });

};