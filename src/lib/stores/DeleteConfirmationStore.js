import { writable } from 'svelte/store';

export const DeleteConfirmationStore = writable({
    endorsement_name: null,
    endorsement_ID: null,
    endorsement_image_ID: null,
    edorsement_image_public_ID: null,
    endorsement_category: null
});