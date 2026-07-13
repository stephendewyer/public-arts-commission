import { writable } from 'svelte/store';

export const createEndorsedAmendmentsSearchStore = () => {

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
            introduced_in_House: false,
            introduced_in_Senate: false,
            twothirds_House_and_Senate_passed: false,
            simple_majority_House_and_Senate_passed: false,
            simple_majority_voters_passed: false,
            ratified_by_state_conventions: false,
            ratified_by_state_legislatures: false,
            scheduled_for_vote_in_House: false,
            scheduled_for_vote_in_Senate: false,
            enacted_into_law: false,
            on_ballot_for_election_by_voters: false,
            approved_by_voters: false,
        }
    );

    return {
        subscribe,
        
        setSearch(/** @type {SearchTermsAmendment} */ search) {
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
                introduced_in_House: false,
                introduced_in_Senate: false,
                twothirds_House_and_Senate_passed: false,
                simple_majority_House_and_Senate_passed: false,
                simple_majority_voters_passed: false,
                ratified_by_state_conventions: false,
                ratified_by_state_legislatures: false,
                scheduled_for_vote_in_House: false,
                scheduled_for_vote_in_Senate: false,
                enacted_into_law: false,
                on_ballot_for_election_by_voters: false,
                approved_by_voters: false,
            }));
        }
    };
};