import { writable } from 'svelte/store';

const initialLocation = {
    latitude: null,
    longitude: null,
    streetPreDir: "",
    streetNumber: "",
    street: "",
    city: "",
    county: "",
    state: "",
    zipcode: "",
    country: "",
    USCongressionalDistrict: "",
    StateUnicameralDistrict: "",
    StateSenateDistrict: "",
    StateHouseDistrict: "",
    CityWard: ""
};

function createVoterLocationStore() {
    const { subscribe, set, update } = writable(initialLocation);

    return {
        subscribe,
        set,
        update,

        /**
         * @param {VoterLocation} location
         */
        setLocation(location) {
            // @ts-ignore
            set(location);
        },

        // @ts-ignore
        updateLocation(changes) {
            update(location => ({
                ...location,
                ...changes
            }));
        },

        reset() {
            set(initialLocation);
        }
    };
}

export const VoterLocationStore = createVoterLocationStore();