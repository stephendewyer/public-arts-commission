import { writable } from 'svelte/store';

export const createEndorsedActionsSearchStore = () => {

    const { subscribe, update } = writable(
        {
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
            government_level: "",
        }
    );

    return {
        subscribe,
        
        setSearch(/** @type {SearchActionTerms} */ search) {
            update(() => search);
        },

        reset() {
            update(() => ({
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
                government_level: "",
            }));
        }
    };
};