import { writable } from 'svelte/store';

export const createEndorsedLegislationSearchStore = () => {

    const { subscribe, update } = writable(
        {
            year: [],
            government_level: "",
            state: "",
            county: "",
            city: "",
            name: "",
            sponsors: [],
            cosponsors: [],
            introduced_in_Senate_only: false,
            introduced_in_House_only: false,
            scheduled_for_vote_in_House_only: false,
            scheduled_for_vote_in_Senate_only: false,
            approved_in_House_only: false,
            approved_in_Senate_only: false,
            signed_into_law_by_Executive_only: false,
            vetoed_by_Executive_only: false,
            overridden_Executive_veto_only: false
        }
    );

    return {
        subscribe,
        
        setSearch(/** @type {SearchTermsLegislation} */ search) {
            // @ts-ignore
            update(() => search);
        },

        reset() {
            update(() => ({
                year: [],
                government_level: "",
                state: "",
                county: "",
                city: "",
                name: "",
                sponsors: [],
                cosponsors: [],
                introduced_in_Senate_only: false,
                introduced_in_House_only: false,
                scheduled_for_vote_in_House_only: false,
                scheduled_for_vote_in_Senate_only: false,
                approved_in_House_only: false,
                approved_in_Senate_only: false,
                signed_into_law_by_Executive_only: false,
                vetoed_by_Executive_only: false,
                overridden_Executive_veto_only: false
            }));
        }
    };
};