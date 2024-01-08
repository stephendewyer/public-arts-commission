import { writable } from 'svelte/store';
import States from '$lib/data/states.titlecase.json';

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

    console.log(`search year: ${searchYear}, search federal: ${searchGovernmentLevel}, search state: ${searchState}, search county: ${searchCounty}, search city: ${searchCity}`)

    store.filtered = store.data.filter((/** @type {any} */ item) => {

        // apply year filter first

        // if search by year is empty, continue with search by street address

        if (searchYear === "") {

            // if search state, county and city are empty, return item

            if (
                store.search.state === "" &&
                store.search.county === "" &&
                store.search.city === ""
            ) {

                return item;

            } else if (

                // if item government level is federal, return item

                item.searchTerms.government_level.toLowerCase().includes("federal")

            ) {

                return item;

            } else if (

                // if search state, county and city are entered, return only items if values fit within values
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

        // else if search year matches item searchTerm year, continue with filters

        } else if (item.searchTerms.year === searchYear) {

            // if search state, county and city are empty, return item

            if (
                store.search.state === "" &&
                store.search.county === "" &&
                store.search.city === ""
            ) {

                return item;

            } else if (

                // if item government level is federal, return item

                item.searchTerms.government_level.toLowerCase().includes("federal")

            ) {

                return item;

            } else if (

                // if search state, county and city are entered, return only items if values fit within values
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

        } else {

            return;

        };

    });

};