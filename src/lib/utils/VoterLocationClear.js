export const VoterLocationClear = (/** @type { VoterLocation } */location) => {

    return {
        ...location,
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
        StateSenateDistrict: "",
        StateHouseDistrict: "",
        StateUnicameralDistrict: "",
        CityWard: ""
    };
};