import { writable } from 'svelte/store';

export const CampaignActionConfirmationStore = writable({
    candidate_application: null,
    selected: null
});