import { writable } from 'svelte/store';

export const createEndorsedCandidatesSearchStore = () => {

    const { subscribe, update } = writable(
        {
            year: "",
            government_level: "",
            state: "",
            county: "",
            city: "",
            name: "",
            in_active_election: false,
            in_active_primary_election: false,
            in_active_general_election: false,
            elected_into_office: false,
            nonincumbent: false,
        }
    );

    return {
        subscribe,
        
        setSearch(/** @type {SearchTermsCandidate} */ search) {
            update(() => search);
        },

        reset() {
            update(() => ({
                year: "",
                government_level: "",
                state: "",
                county: "",
                city: "",
                name: "",
                in_active_election: false,
                in_active_primary_election: false,
                in_active_general_election: false,
                elected_into_office: false,
                nonincumbent: false,
            }));
        }
    };
};