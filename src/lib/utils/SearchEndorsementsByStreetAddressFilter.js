export const SearchEndorsementsByStreetAddressFilter = (
    /** @type {string} */ searchState, 
    /** @type {string} */ searchCounty, 
    /** @type {string} */ searchCity, 
    /** @type {{ searchTerms: { government_level: string; state: string; county: string; city: string; }; }} */ item
) => {

    // if search state, county and city are empty, return item

    if (
        searchState === "" &&
        searchCounty === "" &&
        searchCity === ""
    ) {

        return item;

    } else if (

        // if item government level is federal, return item

        item.searchTerms.government_level.toLowerCase().includes("federal")

    ) {

        return item;

    } else if (

        // if search state, county and city are entered, return only items if values fit within values
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
        !searchState &&
        !searchCounty &&
        searchCity
    ) {

        if (
            (
                item.searchTerms.city.toLowerCase().includes(searchCity)
            )       

        ) {

            return item;

        };

    }  else if (
        !searchState &&
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
        searchState &&
        searchCounty &&
        !searchCity
    ) {

        if (
            (   
                item.searchTerms.state.toLowerCase().includes(searchState) &&
                item.searchTerms.county.toLowerCase().includes(searchCounty)
            ),
            (   
                item.searchTerms.state.toLowerCase().includes(searchState)
            )         
        ) {

            return item;

        };

    }  else if (
        searchState &&
        !searchCounty &&
        searchCity
    ) {

        if (
            (   
                item.searchTerms.state.toLowerCase().includes(searchState) &&
                item.searchTerms.city.toLowerCase().includes(searchCity)
            ),
            (   
                item.searchTerms.state.toLowerCase().includes(searchState)
            )         
        ) {

            return item;

        };

    } else if (
        searchState &&
        !searchCounty &&
        !searchCity
    ) {

        if (
            item.searchTerms.state.toLowerCase().includes(searchState)
        ) {

            return item;

        };

    } else if (
        !searchState &&
        searchCounty &&
        !searchCity
    ) {

        if (
            item.searchTerms.county.toLowerCase().includes(searchCounty)
        ) {

            return item;

        };

    };

};