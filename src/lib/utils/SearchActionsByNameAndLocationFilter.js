import States from '$lib/data/states.titlecase.json';

export const SearchActionsByNameAndLocationFilter = (
    /** @type {{ search: { action_name: string; zip_code: string; state: string; city: string; county: string; }; }} */ store, 
    /** @type {{ searchTerms: { government_level: string; action_name: string; state: string; city: string; }; }} */ item
) => {

    // console.log("search in store: ", store.search)
    let handledStateName;

    let handleStateName = false;

    States.forEach((state) => {

        if (state.abbreviation === store.search.state) {

            handleStateName = true;

            handledStateName = state.name.toLowerCase();

        };

    });

    const searchName = store.search.action_name.toLowerCase();

    const searchCity = store.search.city?.toLowerCase();

    /**
     * @type {string | any}
     */
    let searchState;

    if (handleStateName) {

        searchState = handledStateName;

    } else {

        searchState = store.search.state?.toLowerCase();

    };

    // if search state and city are empty, return item

    if (
        searchName === "" &&
        searchState === "" &&
        searchCity === ""
    ) {

        return item;

    } else if (
        item.searchTerms.action_name.toLowerCase().includes(searchName)
    ) {

        return item;

    } else if (
        searchName !== "" &&
        !item.searchTerms.action_name.toLowerCase().includes(searchName) &&
        searchState === "" &&
        searchCity === ""
    ) {

        return;

    } else { 

        if (item.searchTerms.government_level === "federal") {

            return item;

        } else if (
            searchState !== "" &&
            searchCity !== ""
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
            !searchState &&
            searchCity
        ) {
    
            if (
    
                item.searchTerms.city.toLowerCase().includes(searchCity)
    
            ) {
    
                return item;
    
            };
    
        } else if (
            searchState &&
            !searchCity
        ) {
    
            if (
                item.searchTerms.state.toLowerCase().includes(searchState)
            ) {
    
                return item;
    
            };
    
        } else if (
            !searchState &&
            !searchCity
        ) {
    
            return;
    
        };
    };
    
};