import States from '$lib/data/states.titlecase.json';

export const SearchActionsByNameAndLocationFilter = (
    /** @type { SearchActionTerms } */ store, 
    /** @type {{ searchTerms: SearchActionTerms}} */ item
) => {

    let handledStateName;

    let handleStateName = false;

    States.forEach((state) => {

        if (state.abbreviation === store.state) {

            handleStateName = true;

            handledStateName = state.name.toLowerCase();

        };

    });

    const searchName = store.action_name.toLowerCase();
    const searchCity = store.city?.toLowerCase();
    const searchCounty = store.county?.toLowerCase();

    /**
     * @type {string | any}
     */
    let searchState;

    if (handleStateName) {

        searchState = handledStateName;

    } else {

        searchState = store.state?.toLowerCase();

    };

    // if search state and city are empty, return item

    if (searchName) {

        if (item.searchTerms.action_name.toLowerCase().includes(searchName)) {

            return item;
            
        };

    } else if (
        !item.searchTerms.state &&
        !item.searchTerms.county &&
        !item.searchTerms.city &&
        item.searchTerms.government_level === "federal"
    ) {

        return item;

    } else if (
        !searchState &&
        !searchCounty &&
        !searchCity
    ) {

        return item;

    } else if (
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

        if (item.searchTerms.city.toLowerCase().includes(searchCity)) {

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
            ) ||
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
            ) ||
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

        if (item.searchTerms.state.toLowerCase().includes(searchState)) {

            return item;

        };

    } else if (
        !searchState &&
        searchCounty &&
        !searchCity
    ) {

        if (item.searchTerms.county.toLowerCase().includes(searchCounty)) {

            return item;

        };

    };
    
};