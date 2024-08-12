<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import ProposeActionButton from '$lib/components/buttons/NominateButton.svelte';
    import type { User } from '@auth/core/types.js';
    import ActionEndorsementCard from '$lib/components/cards/endorsementCards/ActionEndorsementCard.svelte';
    import { onDestroy, onMount, afterUpdate } from 'svelte';
    import LoaderAnimation from '$lib/components/loaders/LoaderAnimation.svelte';
    import Years from '$lib/data/years.json';
	import SelectSearchInput from '$lib/components/inputs/SelectSearchInput.svelte';
    import { createEndorsedActionsSearchStore, searchEndorsedActionsHandler } from '$lib/stores/EndorsedActionSearchStore.js';
	import { parse } from "@universe/address-parser";
	import USCities from '$lib/data/USCities.json';
    import States from '$lib/data/states.titlecase.json';
    import Checkbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
    import Pagination from '$lib/components/pagination/Pagination.svelte';
    import { EndorsedActionSelectedStore } from '$lib/stores/EndorsedActionSelectedStore';
    import { EndorsedActionOpenStore } from '$lib/stores/EndorsedActionOpenStore';
    import { page } from '$app/stores';
    import GeoLocationIcon from "$lib/images/icons/geolocation_icon.svg?raw";
    import NominateButton from '$lib/components/buttons/NominateButton.svelte';
    import FilterToggleButton from '$lib/components/buttons/FilterToggleButton.svelte';
    import SubmitButtonSecondary from '$lib/components/buttons/SubmitButtonSecondary.svelte';
    import { reverseHtmlEntities } from "$lib/utils/reverseHtmlEntities";

    export let data;

	let URLPathName: string = $page.url.pathname;

    // once user clicks "use my current location" checkbox, 

	// define the latitude and longitude variables
	let latitude: number | null = null;
	let longitude: number | null = null;

	// define the location variables

	let country: string| any = "";
	let zipcode: string | any = "";
	let state: string | any = "";
	let county: string | any = "";
	let city: string | any = "";
	let street: string | any = "";
	let streetNumber: string | any = "";

	let yearInputValue: string | any = "";

    $: yearInputValue;

    let actionName: string = "";

    let searchByStreetAddressInputValue: string;

    $: searchByStreetAddressInputValue;

    let useCurrentLocationChecked: boolean;

    const user: User | undefined = data.streamed.user;

    // load all the endorsed actions

	let endorsedActions: ActionWithImage[] = [];

    // load all the future actions

    let futureEndorsedActions: ActionWithImage[] = [];

    // load all the past actions

    let pastEndorsedActions: ActionWithImage[] = [];

    // begin get endorsed candidates data from database

    let pendingEndorsedActionsData: boolean = false;

    let getEndorsedActionsDataSuccess: boolean | null = null;

    async function getEndorsedActionsData() {

        pendingEndorsedActionsData = true;
        
        const response = await fetch("/api/getEndorsedActions");

        endorsedActions= await response.json();

        if (response.ok) {

            pendingEndorsedActionsData = false;

            getEndorsedActionsDataSuccess = true;

        } else if (!response.ok) {

            pendingEndorsedActionsData = false;

            getEndorsedActionsDataSuccess = false;

        };

    };

    onMount(() => {
        getEndorsedActionsData();
    });

    let searchParams: URLSearchParams;
	
	$: searchParams = new URLSearchParams($page.url.search);

    $: if (searchParams.get("action_ID") !== null) {

        const actionID: string | null = searchParams.get("action_ID");

        endorsedActions.filter((action, i) => {

            if (action.action_ID.toString() === actionID) {

                $EndorsedActionSelectedStore = action;
                $EndorsedActionOpenStore = true;

            };

        });

    };

    const currentDate = new Date();

    // use the parsed address from seach by address input to filter endorsed candidates 

    let searchEndorsedActions: SearchActionWithImage[] = [];

    $: searchEndorsedActions = endorsedActions.map((action: ActionWithImage) => ({
		...action,
		searchTerms: {
            year: {
                all_day_event_date: `${new Date(action.all_day_event_date).getFullYear()}`,
                date_start: `${new Date(action.date_start).getFullYear()}`,
                date_end: `${new Date(action.date_end).getFullYear()}`
            },
            action_name: `${reverseHtmlEntities(action.action_name)}`,
            zipcode: `${action.action_zip_code}`,
			state: `${reverseHtmlEntities(action.action_state)}`,
			city: `${reverseHtmlEntities(action.action_city)}`,
            government_level: `${reverseHtmlEntities(action.government_level)}`
		}
	}));

	$: searchEndorsedActionsStore = createEndorsedActionsSearchStore(searchEndorsedActions);

	$: unsubscribeSearchEndorsedActionsStore = searchEndorsedActionsStore.subscribe((model) => {

		searchEndorsedActionsHandler(model)

	});

	onDestroy(() => {

		unsubscribeSearchEndorsedActionsStore();
		
	});

    $: $searchEndorsedActionsStore.filtered.forEach((action: ActionWithImage) => {

        const actionEndDate = new Date(action.date_end);
        const actionAllDayDate = new Date(action.all_day_event_date);

        if ((actionEndDate >= currentDate) || (actionAllDayDate >= currentDate)) {

            futureEndorsedActions = [...futureEndorsedActions, action];
            
        } else {

            pastEndorsedActions = [...pastEndorsedActions, action]

        };
    });

    // set the amount of items to appear in each category on the page
    let pageSize: number = 4;

    let actionsForthcomingCurrentPage: number = 1;
    let actionsHistoryCurrentPage: number = 1;

    // set the index of the first item to appear on the page for each category
    let firstPageIndexActionsForthcoming: number = 1;
    $: firstPageIndexActionsForthcoming = (actionsForthcomingCurrentPage -1) * pageSize;
    
    let firstPageIndexActionsHistory: number = 1;
    $: firstPageIndexActionsHistory = (actionsHistoryCurrentPage -1) * pageSize;

    // set the index for the page after the first page for each category
    let lastPageIndexActionsForthcoming: number = 1;
    $: lastPageIndexActionsForthcoming = firstPageIndexActionsForthcoming + pageSize;

    let lastPageIndexActionsHistory: number = 1;
    $: lastPageIndexActionsHistory = firstPageIndexActionsHistory + pageSize;

    let paginatedActionsForthcoming: ActionWithImage[] = [];
    let paginatedActionsHistory: ActionWithImage[] = [];

    // use the first page index and last page index to slice the correct items to appear on the page for each category
    $: paginatedActionsForthcoming = futureEndorsedActions.slice(firstPageIndexActionsForthcoming, lastPageIndexActionsForthcoming);
    $: paginatedActionsHistory = pastEndorsedActions.slice(firstPageIndexActionsHistory, lastPageIndexActionsHistory);

    // after submit

    let reversedGeolocation: ReverseGeoLocation;

	// use the user's geolocation to get the user's address

	let addressLoadSuccess: boolean | null = null;

    let pending: boolean = false;

    async function reverseGeocode(latitude: number | null, longitude: number | null): Promise<string> {

        const response = await fetch("/api/reverseGeocode", {
            method: 'POST',
            body: JSON.stringify({
                latitude,
                longitude
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        reversedGeolocation = await response.json();

        if (response.ok) {

            pending = false;

            addressLoadSuccess = true;

        } else if (!response.ok) {

            pending = false;

            addressLoadSuccess = false;

        };

        // show the user's address as the value in the searchEndorsements searchInput

        searchByStreetAddressInputValue = reversedGeolocation.addresses[0].address.freeformAddress;
        country = reversedGeolocation.addresses[0].address.country;
        zipcode = reversedGeolocation.addresses[0].address.extendedPostalCode;
        state = reversedGeolocation.addresses[0].address.countrySubdivision;
        county = reversedGeolocation.addresses[0].address.countrySecondarySubdivision;
        city = reversedGeolocation.addresses[0].address.municipality;
        street= reversedGeolocation.addresses[0].address.street;
        streetNumber = reversedGeolocation.addresses[0].address.streetNumber;
        // clear categories data

        // update the search filter stores
        futureEndorsedActions = [];
        pastEndorsedActions = [];

        actionsForthcomingCurrentPage = 1;
        actionsHistoryCurrentPage = 1;

        $searchEndorsedActionsStore.search = {
            year:  {
                all_day_event_date: yearInputValue,
                date_start: yearInputValue,
                date_end: yearInputValue
            },
            action_name: actionName,
            zipcode: zipcode,
            state: state,
            city: city,
            county: county,
            government_level: "federal"
        };

        return searchByStreetAddressInputValue;

    };

    // if getCurrentPosition is a success, 

	const success = (position: GeoLocationPosition) => {

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        reverseGeocode(latitude, longitude);

    };

    // log an error if getCurrentPosition fails

    const error = (error: any) => {

        pending = false;

        addressLoadSuccess = false;

        console.log("Unable to retrieve your location!" + error);
    };

        // get user's location using JavaScript geolocation

    const findUserLocation = () => {

        actionName = "";

        navigator.geolocation.getCurrentPosition(success, error);

    };

        // if user activates the get current location checkbox, call the findUserLocation checkbox, else clear the searchValue

    $: if (useCurrentLocationChecked) { 

        pending = true;

        findUserLocation();

    };

    // handle changes to searchbar input value

	let statesWithCity: string[] = [];

	const searchByNameOrLocationInputValueChangeHandler = () => {

        actionsForthcomingCurrentPage = 1;
        actionsHistoryCurrentPage = 1;

        let stateName: string = "";
		let stateAbbreviation: string = "";

		country = "";
		zipcode = "";
		state = "";
		city = "";
		street= "";
		streetNumber = "";
		county = "";
		actionName = "";

		let searchBarInputValueArray: string[] = searchByStreetAddressInputValue.split(" ");
		let searchBarInputValueFirstWord: string = searchBarInputValueArray[0].replace(",", "");
		let stateValueArray: string[] = [];
		let stateValueFirstWord: string = "";
		let cityValueArray: string[] = [];
		let cityValueFirstWord: string = "";
		let countyValueArray: string[] = [];
		let countyValueFirstWord: string = "";

		// uncheck "use my current location" checkbox if user changes the search by address input value after checking "use my current location"

		if (
			useCurrentLocationChecked && 
			(reversedGeolocation.addresses[0].address.freeformAddress !== searchByStreetAddressInputValue)
		) {

			useCurrentLocationChecked = false;

		};

		// IMPORTANT: street address parser must have an input length greater than zero

		// if search by address input value is greater than zero and use my current location is not checked, 
		// use address-parser to parse search by address input value

		if (
			!useCurrentLocationChecked
		) {

			// if user has entered only numbers, filter actions using zipcode

			if (/^-?\d+$/.test(searchByStreetAddressInputValue)) {

				// check if entered value matches zipcode in USCities

				USCities.filter((cityObj: CityObject) => {

					if (cityObj.zip_code.toString() === searchByStreetAddressInputValue) {

						zipcode = cityObj.zip_code;
						state = cityObj.state;
						city = cityObj.city;
						stateValueArray = [...state.split(" ")];
						stateValueFirstWord = stateValueArray[0].replace(",", "");
						cityValueArray = [...city.split(" ")];
						cityValueFirstWord = cityValueArray[0].replace(",", "");
						countyValueArray = [...county.split(" ")];
						countyValueFirstWord = countyValueArray[0].replace(",", "");

						return;

					} else {

						return;

					};

				});

			} else if (!/^-?\d+$/.test(searchByStreetAddressInputValue)) {

				// if the first entered value by user is a letter, filter actions by state, city and name

				// check if search input value includes state

				States.filter((stateObj) => {

					if (
						searchByStreetAddressInputValue.includes(stateObj.abbreviation) ||
						searchByStreetAddressInputValue.toLowerCase().includes(stateObj.name.toLowerCase())
					) {

						state = stateObj.name;
						stateName = stateObj.name.toLowerCase();
						stateAbbreviation = stateObj.abbreviation.toLowerCase();
						stateValueArray = [...state.split(" ")];
						stateValueFirstWord = stateValueArray[0].replace(",", "");

					};

				});

				// check if search input value includes city

				statesWithCity = [];

				if (state) {

					USCities.filter((cityObj: CityObject) => {

						if (searchByStreetAddressInputValue.toLowerCase().includes(cityObj.city.toLowerCase())) {

							// check to see if cityObj.state matches state

							// make sure state is abbreviation

							States.filter((stateObj) => {

								if (stateObj.name === state) {

									state = stateObj.abbreviation;

								};

							});

							if (state === cityObj.state) {

								city = cityObj.city;
								cityValueArray = [...city.split(" ")];
								cityValueFirstWord = cityValueArray[0].replace(",", "");

							};

						};

					});

				} else if (!state) {

					// create an array of all possible states for city

					USCities.forEach((cityObj: CityObject) => {

						if (searchByStreetAddressInputValue.toLowerCase().includes(cityObj.city.toLowerCase())) {

							city = cityObj.city;
							cityValueArray = [...city.split(" ")];
							cityValueFirstWord = cityValueArray[0].replace(",", "");

							// check if city and state combination already is in statesWithCity and if false, add to statesWithCity

							if (
								(statesWithCity.includes(`${cityObj.city}, ${cityObj.state}`) === false) &&
								(searchBarInputValueArray.length <= 2)
							) {

								statesWithCity = [...statesWithCity, `${cityObj.city}, ${cityObj.state}`];

							};

						};

					});

				};

				if (

					searchBarInputValueFirstWord.toLowerCase() !== stateName &&

					searchBarInputValueFirstWord.toLowerCase() !== stateAbbreviation &&

					searchBarInputValueFirstWord.toLowerCase() !== stateValueFirstWord && 

					searchByStreetAddressInputValue.includes(",") === false &&

					(
						searchBarInputValueFirstWord.toLowerCase() !== cityValueFirstWord.toLowerCase() ||

						searchBarInputValueArray.length >= 2

					)
				) {
					
					actionName = searchByStreetAddressInputValue.toLowerCase();
					
				};                

			} else if (searchByStreetAddressInputValue.length > 0) {

				// if user has entered numbers followed by letters, filter actions using street address
				// parse the search by address input value

				const parsed = parse(searchByStreetAddressInputValue);

				// load the parsed properties

				country = parsed.country;
				zipcode = parsed.zip;
				state = parsed.state;
				city = parsed.city;
				street= parsed.streetName;
				streetNumber = parsed.number;

				// use zip code to load county from parsed address

				county = USCities.find((location) => location.zip_code.toString() === zipcode)?.county;

			};

		} else {

			country = "";
			zipcode = "";
			state = "";
			city = "";
			street= "";
			streetNumber = "";
			county = "";
			actionName = "";
			stateValueArray = [];
			stateValueFirstWord = "";
			cityValueArray = [];
			cityValueFirstWord = "";
			countyValueArray = [];
			countyValueFirstWord = "";

		};

        // update the search filter stores
        futureEndorsedActions = [];
        pastEndorsedActions = [];

        $searchEndorsedActionsStore.search = {
            year:  {
                all_day_event_date: yearInputValue,
                date_start: yearInputValue,
                date_end: yearInputValue
            },
            action_name: actionName,
            zipcode: zipcode,
            state: state,
            city: city,
            county: county,
            government_level: "federal"
        };

    };

    // if option is selected, run filters

	let searchbarOptionSelected: boolean = false;

    $: if (searchbarOptionSelected) {

        searchByNameOrLocationInputValueChangeHandler();

        searchbarOptionSelected = false;

    };

    const selectYearInputValueChangeHandler = () => {

        // update the search filter stores
        // clear categories data

        futureEndorsedActions = [];
        pastEndorsedActions = [];

        actionsForthcomingCurrentPage = 1;
        actionsHistoryCurrentPage = 1;

        $searchEndorsedActionsStore.search = {
            year:  {
                all_day_event_date: yearInputValue,
                date_start: yearInputValue,
                date_end: yearInputValue
            },
            action_name: actionName,
            zipcode: zipcode,
            state: state,
            city: city,
            county: county,
            government_level: "federal"
        };

    };

    let openFilters: boolean = true;

	let height: number = 0;

    $: height;

	// innerWidth is the width of the inner window
	let innerWidth: number = 0;

	let clearFiltersClicked: boolean = false;

	$: if (clearFiltersClicked) {
		useCurrentLocationChecked = false;
		yearInputValue = "";
		selectYearInputValueChangeHandler();
		searchByStreetAddressInputValue = " ";
		searchByNameOrLocationInputValueChangeHandler();
		clearFiltersClicked = false;
	};

	let filtersContainerHeight: number = 0;

	$: filtersContainerHeight;

	let endorsementNavHeight: number = 0;

	let endorsementsNav: HTMLElement;

	let filtersContainerElement: HTMLElement;

	let y: number = 0;

    let endorsementTabsSticky: boolean = false;

    let currentEndorsementTabsStickyPosition: number = 0;

	let filtersAbsolutePosition: number = 0;

	let filtersAbsolute: boolean = false;

    onMount(() => {
        currentEndorsementTabsStickyPosition = endorsementsNav?.getBoundingClientRect().top + window.scrollY;
    });

	afterUpdate(() =>  {
		if (innerWidth <= 720) {
			filtersAbsolutePosition = filtersContainerElement?.getBoundingClientRect().top + window.scrollY + (filtersContainerHeight - endorsementNavHeight);
		} else {
			filtersAbsolutePosition = filtersContainerElement?.getBoundingClientRect().top + window.scrollY + (filtersContainerHeight - height- endorsementNavHeight);
		};
	});

    $: if (y > currentEndorsementTabsStickyPosition && y <= filtersAbsolutePosition) {
        endorsementTabsSticky = true;
		filtersAbsolute = false;
    } else if (y > currentEndorsementTabsStickyPosition && y > filtersAbsolutePosition) {
        endorsementTabsSticky = true;
		filtersAbsolute = true;
    } else if (y <= currentEndorsementTabsStickyPosition && y <= filtersAbsolutePosition) {
		endorsementTabsSticky = false;
		filtersAbsolute = false;
	};

    const handleWindowResize = () => {
        currentEndorsementTabsStickyPosition = endorsementsNav?.getBoundingClientRect().top + window.scrollY;
    };

</script>
<svelte:head>
	<title>actions - public arts commission</title>
	<meta name="description" content="forthcoming and past actions endorsed by public arts commission" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<svelte:window 
    bind:innerWidth 
    bind:scrollY={y}
    on:resize={handleWindowResize}
/>
<section class="page">
    <h1>
        search actions
    </h1>
    <div 
        id="endorsement_nav_tabs"
        bind:this={endorsementsNav}
        class={endorsementTabsSticky ? "endorsement_tabs_container_sticky" : "endorsements_tabs_container"}
        bind:clientHeight={endorsementNavHeight}
    >
        <div class="endorsement_nav_tabs_inner">
            <FilterToggleButton bind:openFilters >filters</FilterToggleButton>
        </div>
    </div>
    <div 
        class="filters_and_results"
        style={endorsementTabsSticky ? `padding-top: ${endorsementNavHeight}px;` : "padding-top: 0px;"}
    >
        <div 
            id="filters_container" 
            class={openFilters ? "filters_container_open" : "filters_container_closed"}
            style={ (innerWidth <= 720) ? openFilters ? `height: ${height}px` : 'height: 0px;' : "" }
            bind:clientHeight={filtersContainerHeight}
            bind:this={filtersContainerElement}
        >
            
            <form 
                id="filters"
                class={(innerWidth > 720) ? endorsementTabsSticky ? !filtersAbsolute ? "filters_sticky" : "filters_absolute" : "filters_not_sticky" : "filters_not_sticky"}
                style={(innerWidth > 720) ? endorsementTabsSticky ? filtersAbsolute ? "" : `top: ${endorsementNavHeight}px;` : "top: 0;": ""}
                bind:clientHeight={height}
            >
                <div class="search_endorsements_input_container">
                    {#if useCurrentLocationChecked}
                        {#if pending}
                            <LoaderAnimation />
                        {:else if addressLoadSuccess}
                            <SearchInput 
                                placeholder="action name | 1000 MyStreet, MyCity, MyState  10000 | City, State | State | 10000"
                                inputID="address"
                                inputName="address"
                                inputLabel={true}
                                bind:searchInputValue={searchByStreetAddressInputValue}
                                searchInputValueChange={() => searchByNameOrLocationInputValueChangeHandler()}
                                options={statesWithCity}
                                bind:optionSelected={searchbarOptionSelected}
                            >
                                action name, state, city, zip code or street address
                            </SearchInput>
                        {:else if !addressLoadSuccess}
                            <p>failed to load address</p>
                        {/if}
                    {:else}
                        <SearchInput 
                            placeholder="action name | 1000 MyStreet, MyCity, MyState  10000 | City, State | State | 10000"
                            inputID="address"
                            inputName="address"
                            inputLabel={true}
                            bind:searchInputValue={searchByStreetAddressInputValue}
                            searchInputValueChange={() => searchByNameOrLocationInputValueChangeHandler()}
                            options={statesWithCity}
                            bind:optionSelected={searchbarOptionSelected}
                        >
                            action name, state, city, zip code or street address
                        </SearchInput>
                    {/if}
                    <Checkbox 
                        bind:checked={useCurrentLocationChecked}
                    >
                        <div class="use_current_location_label">
                            <div class="geolocation_container">
                                {@html GeoLocationIcon}
                            </div>
                            use my current location
                        </div>
                    </Checkbox>
                </div>
                <div class="year_input_container">
                    <SelectSearchInput 
                        options={Years}
                        inputID="year"
                        inputName="year"
                        inputLabel={true}	
                        bind:selectInputValue={yearInputValue}
                        selectInputValueChange={() => selectYearInputValueChangeHandler()}	
                    >
                        election year or release year
                    </SelectSearchInput>
                </div>
                <SubmitButtonSecondary 
                    disable={false}
                    bind:clicked={clearFiltersClicked}
                >
                    clear filters
                </SubmitButtonSecondary>
            </form>
        </div>
        <ul class="results">
            {#if pendingEndorsedActionsData}
                <LoaderAnimation />
            {:else if (pendingEndorsedActionsData === false && getEndorsedActionsDataSuccess === true)}
                <li class="forthcoming_actions_container">
                    <h3>
                        forthcoming actions
                    </h3>
                    <div class="action_cards_frame">
                        <div class="action_cards">
                            {#each paginatedActionsForthcoming as endorsedAction, i}
                                <a 
                                    href={`${URLPathName}/?action_ID=${endorsedAction.action_ID}&action_name=${endorsedAction.action_name.replace(/ /g,"_")}`}
                                    data-sveltekit-noscroll
                                > 
                                    <ActionEndorsementCard endorsedActionData={endorsedAction} />
                                </a>
                            {/each}
                        </div>
                    </div>
                    <Pagination 
                        bind:currentPage={actionsForthcomingCurrentPage}
                        totalCount={futureEndorsedActions.length}
                        pageSize={pageSize}
                    />
                </li>
                <li class="actions_history_container">
                    <h3>
                        actions history
                    </h3>
                    <div class="action_cards_frame">
                        <div class="action_cards">
                            {#if pendingEndorsedActionsData}
                                <LoaderAnimation />
                            {:else if getEndorsedActionsDataSuccess}
                                {#each paginatedActionsHistory as endorsedAction, i}
                                    <a 
                                        href={`${URLPathName}/?action_ID=${endorsedAction.action_ID}&action_name=${endorsedAction.action_name.replace(/ /g,"_")}`}
                                        data-sveltekit-noscroll
                                    > 
                                        <ActionEndorsementCard endorsedActionData={endorsedAction} />
                                    </a>
                                {/each}
                            {:else if !getEndorsedActionsDataSuccess}
                                <p>failed to load endorsed actions history</p>
                            {/if}
                        </div>
                    </div>
                    <Pagination 
                        bind:currentPage={actionsHistoryCurrentPage}
                        totalCount={pastEndorsedActions.length}
                        pageSize={pageSize}
                    />
                </li>
            {:else if (getEndorsedActionsDataSuccess === false && pendingEndorsedActionsData === false)}
                <p>failed to load endorsed forthcoming actions</p>
            {/if}
        </ul>
    </div>
    <div class="nominate_button_container">
		<NominateButton 
			category="actions"
			authorized_user={data.streamed.user}
		>
			propose an action
		</NominateButton>
	</div>
</section>

<style>

    .page {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

    #endorsement_nav_tabs {	
		width: 100%;
		padding: 0.5rem 1rem;
	}

    .endorsements_tabs_container {
		position: relative;
	}

	.endorsement_tabs_container_sticky {
		position: fixed;
		top: 0;
		z-index: 1;
		background-color: #DBE4D7;
	}

	.endorsement_nav_tabs_inner {
		position: relative;
		display: flex;
		justify-content: flex-end;
		width: 100%;
		max-width: 1920px;
		margin: 0 auto;
	}

    .filters_and_results {
		position: relative;
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	#filters_container {
		position: relative;
		width: 34rem;
		min-width: 34rem;
		transition: margin-left 0.3s ease-out;
		background-color: #E7DED0;
	}

	.filters_container_open {
		margin-left: 0%;
	}

	.filters_container_closed {
		margin-left: -34rem;
	}

	#filters {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 1rem;
		gap: 1rem;
		transition: transform 0.2s ease-out;
	}

	.filters_sticky {
		position: fixed;
		width: 34rem;
	}

	.filters_absolute {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.filters_not_sticky {
		position: relative;
	}

	.results {
		position: relative;
		width: 100%;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
	}

    .search_endorsements_input_container {
		display: flex;
		flex-direction: column;
        gap: 0.5rem;
		width: 100%;
	}

    .use_current_location_label {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
		font-size: 1rem;
    }

    .geolocation_container {
        width: 1.25rem;
    }

	.year_input_container {
		width: 12rem;
	}

    .forthcoming_actions_container {
        background-color: #F4F5FB;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .actions_history_container {
        background-color: #CBC6C2;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .action_cards_frame {
        width: 100%;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .action_cards {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;      
        gap: 1rem;
        padding: 0 1rem 1rem 1rem;
        width: 100%;
    }

    
    .nominate_button_container {
		position: fixed;
		bottom: 0;
		right: 0;
		padding: 1rem;
		max-width: 1920px;
		width: 100%;
		left: auto;
		right: auto;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		background: none;
		pointer-events: none;
	}


    @media screen and (max-width: 1440px) {
        #filters_container {
			width: 28rem;
			min-width: 28rem;
		}

		.filters_sticky {
			width: 28rem;
		}

		.filters_container_closed {
			margin-left: -28rem;
		}

		.use_current_location_label {
			font-size: 0.95rem;
		}
    }

    @media screen and (max-width: 1080px) {


        .use_current_location_label {
			font-size: 0.9rem;
		}

		#filters_container {
			width: 24rem;
			min-width: 24rem;
		}

		.filters_container_closed {
			margin-left: -24rem;
		}

		.filters_sticky {
			width: 24rem;
		}
        

    }

    @media (max-width: 720px) {

        .endorsements_tabs_container {
			position: relative;
		}

		.use_current_location_label {
			font-size: 0.85rem;
		}

		.filters_and_results {
			display: flex;
			flex-direction: column;
			width: 100%;
		}

		#filters_container {
			width: 100%;
			overflow-y: hidden;
			will-change: height;
        	transition: height 0.4s cubic-bezier(0.65, 0.05, 0.36, 1);
			min-width: 100%;
		}

        .geolocation_container {
            width: 1rem;
        }

		.filters_container_closed {
			margin-left: 0;
		}

        .action_cards {
            flex-wrap: nowrap;
            justify-content: flex-start;
        }

    }

</style>