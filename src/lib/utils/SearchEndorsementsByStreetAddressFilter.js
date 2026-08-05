import States from '$lib/data/states.titlecase.json';

export const SearchEndorsementsByStreetAddressFilter = (
    /** @type { any } */ store, 
    /** @type {{ searchTerms: any ; }} */ item
) => {

    let handledStateName;

    let handleStateName = false;

    States.forEach((state) => {

        if (state.abbreviation === store.state) {

            handleStateName = true;

            handledStateName = state.name.toLowerCase();

        };

    });

    const searchCity = store.city?.toLowerCase();
    const searchCounty = store.county?.toLowerCase();
    const searchName = store.name?.toLowerCase();

    /**
     * @type {string | any}
     */
    let searchState;

    if (handleStateName) {

        searchState = handledStateName;

    } else {

        searchState = store.state?.toLowerCase();

    };
    // handle name search    
    if (searchName) {

        if (item.searchTerms.name.toLowerCase().includes(searchName)) {

            return item;
            
        };

    } else if (
        // handle blank search
        item.searchTerms.state === "" &&
        item.searchTerms.county === "" &&
        item.searchTerms.city === "" &&
        item.searchTerms.government_level === "federal"
    ) {

        return item;

    } else if (
        // handle blank search of government level that is not "federal"
        searchState === "" &&
        searchCounty === "" &&
        searchCity === ""
    ) {

        return item;

    } else if (
        // handle search by street address
        searchState &&
        searchCounty &&
        searchCity
    ) {

        if (
            (
                item.searchTerms.state.toLowerCase().includes(searchState) &&
                item.searchTerms.county.toLowerCase().includes(searchCounty) &&
                item.searchTerms.city.toLowerCase().includes(searchCity)
            ) ||
            (
                item.searchTerms.state.toLowerCase().includes(searchState) &&
                item.searchTerms.county.toLowerCase().includes(searchCounty)
            ) ||
            (
                item.searchTerms.state.toLowerCase().includes(searchState)
            )
        ) {

            return item;

        };

    } else if (
        // handle search by city
        searchState === "" &&
        searchCounty === "" &&
        searchCity
    ) {

        if (item.searchTerms.city.toLowerCase().includes(searchCity)) {

            return item;

        };

    }  else if (
        // handle search by city and county
        searchState === "" &&
        searchCounty &&
        searchCity
    ) {

        if (
            (   
                item.searchTerms.county.toLowerCase().includes(searchCounty) &&
                item.searchTerms.city.toLowerCase().includes(searchCity)
            ) ||
            (   
                item.searchTerms.county.toLowerCase().includes(searchCounty)
            )
        ) {

            return item;

        };

    } else if (
        // handle search by state and county
        searchState &&
        searchCounty &&
        !searchCity
    ) {

        if (
            (   
                item.searchTerms.state.toLowerCase().includes(searchState) &&
                item.searchTerms.county.toLowerCase().includes(searchCounty)
            ) ||
            (   
                item.searchTerms.state.toLowerCase().includes(searchState)
            )         
        ) {

            return item;

        };

    }  else if (
        // handle search by state and city
        searchState &&
        !searchCounty &&
        searchCity
    ) {

        if (
            (   
                item.searchTerms.state.toLowerCase().includes(searchState) &&
                item.searchTerms.city.toLowerCase().includes(searchCity)
            ) ||
            (   
                item.searchTerms.state.toLowerCase().includes(searchState)
            )         
        ) {

            return item;

        };

    } else if (
        // handle search by state
        searchState &&
        !searchCounty &&
        !searchCity
    ) {

        if (item.searchTerms.state.toLowerCase().includes(searchState)) {

            return item;

        };

    } else if (
        // handle search by county
        !searchState &&
        searchCounty &&
        !searchCity
    ) {

        if (item.searchTerms.county.toLowerCase().includes(searchCounty)) {

            return item;

        };

    };

};