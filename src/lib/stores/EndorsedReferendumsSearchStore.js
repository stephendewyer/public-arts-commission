import { writable } from 'svelte/store';

export const createEndorsedReferendumsSearchStore = () => {

    const { subscribe, update } = writable(
        {
            year: "",
            election_date: "",
            government_level: "",
            state: "",
            county: "",
            city: "",
            name: "",
            status: "",
        }
    );

    return {
        subscribe,
        
        setSearch(/** @type {SearchTermsReferendum} */ search) {
            update(() => search);
        },

        reset() {
            update(() => ({
                year: "",
                election_date: "",
                government_level: "",
                state: "",
                county: "",
                city: "",
                name: "",
                status: "",
            }));
        }
    };
};