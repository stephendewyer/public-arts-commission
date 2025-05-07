import { writable } from 'svelte/store';
import { SearchActionsByNameAndLocationFilter } from '$lib/utils/SearchActionsByNameAndLocationFilter';

export const createEndorsedActionsSearchStore = (/** @type {SearchActionWithImage[]} */ data) => {

    const { subscribe, set, update } = writable({
        data: data,
        filtered: data,
        search: {
            year: {
                all_day_event_date: "",
                date_start: "",
                date_end: ""
            },
            action_name: "",
            zipcode: "",
			state: "",
			city: "",
            county: "",
            government_level: ""
		},
    });

    return {
        subscribe,
        set,
        update,
    };
};

export const searchEndorsedActionsHandler = (/** @type {any} */ store) => {
    const searchYearAllDayEvent = store.search.year.all_day_event_date.toString();
    const searchYearDateStart = store.search.year.date_start.toString();
    const searchYearDateEnd = store.search.year.date_end.toString();

    // filter the endorsed candidates data
    store.filtered = store.data.filter((/** @type {any} */ item) => {

        // apply year filter first

        // if search by year is empty, continue with search by street address

        if (
            searchYearAllDayEvent === "" &&
            searchYearDateStart === "" &&
            searchYearDateEnd === ""
        ) {

            return SearchActionsByNameAndLocationFilter(store, item);

        // else if search year matches item searchTerm year, continue with filters

        } else if (
            item.searchTerms.year.all_day_event_date === searchYearAllDayEvent ||
            item.searchTerms.year.date_start === searchYearDateStart ||
            item.searchTerms.year.date_end === searchYearDateEnd
        ) {

            return SearchActionsByNameAndLocationFilter(store, item);

        } else {

            return;

        };

    });

};