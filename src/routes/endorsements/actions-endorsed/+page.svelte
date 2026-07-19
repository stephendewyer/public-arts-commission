<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import Tabs from '$lib/components/tabPanels/endorsementTabPanels/EndorsementsTabs.svelte';
	import Panel from "$lib/components/tabPanels/endorsementTabPanels/EndorsementsPanel.svelte";
    import { v4 as uuidv4 } from 'uuid';
    import GeolocationIcon from "$lib/images/icons/geolocation_icon.svg?raw";
    import ProposeActionButton from '$lib/components/buttons/NominateButton.svelte';
    import { onMount } from 'svelte';
    import LoaderAnimation from '$lib/components/loaders/LoaderAnimation.svelte';
    import Years from '$lib/data/years.json';
	import SelectSearchInput from '$lib/components/inputs/SelectSearchInput.svelte';
    import { createEndorsedActionsSearchStore } from '$lib/stores/EndorsedActionSearchStore.js';
	import { parse } from "@universe/address-parser";
	import USCities from '$lib/data/USCities.json';
    import States from '$lib/data/states.titlecase.json';
    import Checkbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
    import { EndorsedActionSelectedStore } from '$lib/stores/EndorsedActionSelectedStore';
    import { EndorsedActionOpenStore } from '$lib/stores/EndorsedActionOpenStore';
    import { page } from '$app/state';
    import NominateButton from '$lib/components/buttons/NominateButton.svelte';
    import FilterToggleButton from '$lib/components/buttons/FilterToggleButton.svelte';
    import SubmitButtonSecondary from '$lib/components/buttons/SubmitButtonSecondary.svelte';
    import { reverseHtmlEntities } from "$lib/utils/reverseHtmlEntities";
    import ArrowButton from '$lib/components/buttons/ArrowButton.svelte';
    import { SearchActionsByNameAndLocationFilter } from '$lib/utils/SearchActionsByNameAndLocationFilter.js';
    import { goto } from '$app/navigation';

    let { data } = $props();

	let URLPathName: string = $derived(page.url.pathname);

    const endorsementsType: string = "actions";

    // once user clicks "use my current location" checkbox, 

	const location: VoterLocation = $state({
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
	});

	// define the location variables

	let yearInputValue: string | any = $state("");
    let actionName: string = $state("");
    let searchByStreetAddressInputValue: string = $state("")
    let useCurrentLocationChecked: boolean = $state(false);
    let currentPage: number = $state(1);
	let activeEndorsementsTab: number = $state(0);

    // load all the endorsed actions

    interface FilteredEndorsedActions {
        all: SearchActionWithImage[];
        federal: SearchActionWithImage[];
        state: SearchActionWithImage[];
        county: SearchActionWithImage[];
        city: SearchActionWithImage[];
    };

    let endorsedActions = $state<ActionWithImage[]>([]);

    // begin get endorsed candidates data from database

    let pendingEndorsedActionsData: boolean = $state(false);

    let getEndorsedActionsDataSuccess: boolean | null = $state(null);

    async function getEndorsedActionsData() {
        pendingEndorsedActionsData = true;
        const response = await fetch("/api/getEndorsedActions");
        endorsedActions = await response.json();
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

    const HandleOpenSidedrawer = () => {
        let searchParams: URLSearchParams = new URLSearchParams(page.url.search);
        if (searchParams.get("action_ID") !== null) {
            const actionID: string | null = searchParams.get("action_ID");
            endorsedActions.filter((action, i) => {

                if (action.action_ID.toString() === actionID) {
                    $EndorsedActionSelectedStore = action;
                    $EndorsedActionOpenStore = true;
                };

            });
        };

    };

    $effect(() => {
        HandleOpenSidedrawer();
    });

    const searchEndorsedActions: SearchActionWithImage[] = $derived.by(() => {
            return endorsedActions.map((action: ActionWithImage) => ({
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
                county: `${reverseHtmlEntities(action.action_county)}`,
                government_level: `${reverseHtmlEntities(action.government_level)}`
            }
        }));
    });

    // create the endorsedActionsSearchStore

    const endorsedActionsSearchStore = createEndorsedActionsSearchStore();

    // filter searchEndorsedActions data using endorsedActionsSearchStore

    const filteredEndorsedActions: FilteredEndorsedActions = $derived.by(() => {

        const searchYearAllDayEvent = $endorsedActionsSearchStore.year.all_day_event_date.toString();
        const searchYearDateStart = $endorsedActionsSearchStore.year.date_start.toString();
        const searchYearDateEnd = $endorsedActionsSearchStore.year.date_end.toString();

        const filteredActions: SearchActionWithImage[] = searchEndorsedActions.filter((action) => {

            // if search by year is empty, continue with search by street address

            if (
                searchYearAllDayEvent === "" &&
                searchYearDateStart === "" &&
                searchYearDateEnd === ""
            ) {

                return SearchActionsByNameAndLocationFilter($endorsedActionsSearchStore, action);

            // else if search year matches item searchTerm year, continue with filters

            } else if (
                action.searchTerms.year.all_day_event_date === searchYearAllDayEvent ||
                action.searchTerms.year.date_start === searchYearDateStart ||
                action.searchTerms.year.date_end === searchYearDateEnd
            ) {

                return SearchActionsByNameAndLocationFilter($endorsedActionsSearchStore, action);

            } else {

                return;

            };

        });

        let all: SearchActionWithImage[] = [];
        let federal: SearchActionWithImage[] = [];
        let state: SearchActionWithImage[] = [];
        let county: SearchActionWithImage[] = [];
        let city: SearchActionWithImage[] = [];

        filteredActions.forEach((action: SearchActionWithImage) => {

            all = [...all, action];

            if (action.government_level === "federal") {
                federal = [...federal, action];
            } else if (action.government_level === "state") {
                state = [...state, action];
            } else if (action.government_level === "county") {
                county = [...county, action];
            } else if (action.government_level === "city") {
                city = [...city,  action];
            };
            
        });
    
        return (
            {
                all,
                federal,
                state,
                county,
                city
            }
        );

        
    });

    // after submit

    let reversedGeolocation: ReverseGeoLocation = $state({
        addresses: [],
        summary: {
            queryTime: 0,
            numResults: 0
        }
    });

	// use the user's geolocation to get the user's address

	let addressLoadSuccess: boolean | null = $state(null);

    let pendingReverseGeocode: boolean = $state(false);

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
            pendingReverseGeocode = false;
            addressLoadSuccess = true;
        } else if (!response.ok) {
            pendingReverseGeocode = false;
            addressLoadSuccess = false;
        };

        // show the user's address as the value in the searchEndorsements searchInput

        searchByStreetAddressInputValue = reversedGeolocation.addresses[0].address.freeformAddress;
        location.country = reversedGeolocation.addresses[0].address.country;
        location.zipcode = reversedGeolocation.addresses[0].address.extendedPostalCode;
        location.state = reversedGeolocation.addresses[0].address.countrySubdivision;
        location.county = reversedGeolocation.addresses[0].address.countrySecondarySubdivision;
        location.city = reversedGeolocation.addresses[0].address.municipality;
        location.street= reversedGeolocation.addresses[0].address.street;
        location.streetNumber = reversedGeolocation.addresses[0].address.streetNumber;

        currentPage = 1;

        endorsedActionsSearchStore.setSearch({
            year:  {
                all_day_event_date: yearInputValue,
                date_start: yearInputValue,
                date_end: yearInputValue
            },
            action_name: actionName,
            zipcode: location.zipcode,
            state: location.state,
            city: location.city,
            county: location.county,
            government_level: "federal"
        });

        return searchByStreetAddressInputValue;

    };

    // if getCurrentPosition is a success, 

	const success = (position: GeoLocationPosition) => {
        location.latitude = position.coords.latitude;
        location.longitude = position.coords.longitude;
        reverseGeocode(location.latitude, location.longitude);
    };

    // log an error if getCurrentPosition fails

    const error = (error: any) => {
        pendingReverseGeocode = false;
        addressLoadSuccess = false;
        console.log("Unable to retrieve your location!" + error);
    };

        // get user's location using JavaScript geolocation

    const findUserLocation = () => {
        actionName = "";
        navigator.geolocation.getCurrentPosition(success, error)
    };

        // if user activates the get current location checkbox, call the findUserLocation checkbox, else clear the searchValue
    $effect(() => {
        if (useCurrentLocationChecked) { 
            pendingReverseGeocode = true;
            findUserLocation();
        };
    });

    // handle changes to searchbar input value

	let statesWithCity: string[] = $state([]);

	const searchByNameOrLocationInputValueChangeHandler = () => {
        
        currentPage = 1;

        let stateName: string = "";
		let stateAbbreviation: string = "";

		location.country = "";
		location.zipcode = "";
		location.state = "";
		location.city = "";
		location.street= "";
		location.streetNumber = "";
		location.county = "";
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

						location.zipcode = cityObj.zip_code.toString();
						location.state = cityObj.state;
						location.city = cityObj.city;
						stateValueArray = [...location.state.split(" ")];
						stateValueFirstWord = stateValueArray[0].replace(",", "");
						cityValueArray = [...location.city.split(" ")];
						cityValueFirstWord = cityValueArray[0].replace(",", "");
						countyValueArray = [...location.county.split(" ")];
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
						location.state = stateObj.name;
						stateName = stateObj.name.toLowerCase();
						stateAbbreviation = stateObj.abbreviation.toLowerCase();
						stateValueArray = [...location.state.split(" ")];
						stateValueFirstWord = stateValueArray[0].replace(",", "");
					};
				});

				// check if search input value includes city

				statesWithCity = [];

				if (location.state) {

					USCities.filter((cityObj: CityObject) => {

						if (searchByStreetAddressInputValue.toLowerCase().includes(cityObj.city.toLowerCase())) {

							// check to see if cityObj.state matches state

							// make sure state is abbreviation

							States.filter((stateObj) => {

								if (stateObj.name === location.state) {

									location.state = stateObj.abbreviation;

								};

							});

							if (location.state === cityObj.state) {

								location.city = cityObj.city;
								cityValueArray = [...location.city.split(" ")];
								cityValueFirstWord = cityValueArray[0].replace(",", "");

							};

						};

					});

				} else if (!location.state) {

					// create an array of all possible states for city

					USCities.forEach((cityObj: CityObject) => {

						if (searchByStreetAddressInputValue.toLowerCase().includes(cityObj.city.toLowerCase())) {

							location.city = cityObj.city;
							cityValueArray = [...location.city.split(" ")];
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

				location.country = parsed.country ? parsed.country : "";
				location.zipcode = parsed.zip ? parsed.zip : "";
				location.state = parsed.state ? parsed.state : "";
				location.city = parsed.city ? parsed.city : "";
				location.street= parsed.streetName ? parsed.streetName : "";
				location.streetNumber = parsed.number ? parsed.number : "";

				// use zip code to load county from parsed address

				location.county = USCities.find((location) => location.zip_code.toString() === location.zipcode)?.county;

			};

		} else {

			location.country = "";
			location.zipcode = "";
			location.state = "";
			location.city = "";
			location.street= "";
			location.streetNumber = "";
			location.county = "";
			actionName = "";
			stateValueArray = [];
			stateValueFirstWord = "";
			cityValueArray = [];
			cityValueFirstWord = "";
			countyValueArray = [];
			countyValueFirstWord = "";

		};

        endorsedActionsSearchStore.setSearch({
            year:  {
                all_day_event_date: yearInputValue,
                date_start: yearInputValue,
                date_end: yearInputValue
            },
            action_name: actionName,
            zipcode: location.zipcode,
            state: location.state,
            city: location.city,
            county: location.county,
            government_level: "federal"
        });

    };

    // if option is selected, run filters

	let searchbarOptionSelected: boolean = $state(false);

    $effect(() => {
        if (searchbarOptionSelected) {
            searchByNameOrLocationInputValueChangeHandler()
            searchbarOptionSelected = false;
        };
    });

    const selectYearInputValueChangeHandler = () => {

        currentPage = 1;

        endorsedActionsSearchStore.setSearch({
            year:  {
                all_day_event_date: yearInputValue,
                date_start: yearInputValue,
                date_end: yearInputValue
            },
            action_name: actionName,
            zipcode: location.zipcode,
            state: location.state,
            city: location.city,
            county: location.county,
            government_level: "federal"
        });

    };

    let endorsementTabPanels: EndorsementTabPanel[] = $derived([
		{
			id: uuidv4(),
			index: 0,
			label: "all",
			hasCapitol: true,
			data: filteredEndorsedActions.all,
		},
		{
			id: uuidv4(),
			index: 1,
			label: "federal",
			hasCapitol: true,
			data: filteredEndorsedActions.federal,
		},
		{
			id: uuidv4(),
			index: 2,
			label: "state",
			hasCapitol: true,
			data: filteredEndorsedActions.state,
		},
		{
			id: uuidv4(),
			index: 3,
			label: "county",
			hasCapitol: true,
			data: filteredEndorsedActions.county,
		},
		{
			id: uuidv4(),
			index: 4,
			label: "city",
			hasCapitol: true,
			data: filteredEndorsedActions.city,
		},
	]);

    let openFilters: boolean = $state(true);

	let searchHeight: number = $state(0);

	// innerWidth is the width of the inner window
	let innerWidth: number = $state(0);

	let clearFiltersClicked: boolean = $state(false);

	$effect(() => {
        if (clearFiltersClicked) {
            page.url.pathname = "/endorsements/actions-endorsed";
            goto(page.url.pathname);
            useCurrentLocationChecked = false;
            searchByStreetAddressInputValue = "";
			searchByNameOrLocationInputValueChangeHandler();
            yearInputValue = "";
			selectYearInputValueChangeHandler();
            currentPage = 1;
            clearFiltersClicked = false;
        };
    });

	let searchContainerHeight: number = $state(0);

	let searchContainerElement: HTMLElement | undefined = $state();
	
	let innerHeight: number = $state(0);

	let endorsementNavHeight: number = $state(0);

	let endorsementsNav: HTMLElement | undefined = $state();	

	let y: number = $state(0);

    let endorsementTabsSticky: boolean = $state(false);

	let searchAbsolute: boolean = $state(false);

	let endorsementResultsHeight: number = $state(0);

	let clearFiltersButtonHeight: number = $state(0);

	let searchContainerSticky: boolean = $state(false);

	let searchContainerTopPosition: number = $derived(searchContainerElement ? searchContainerElement.getBoundingClientRect().top + window.scrollY : 0);

	let searchAbsolutePosition: number = $derived(searchContainerElement ?searchContainerElement?.getBoundingClientRect().top + window.scrollY + (searchContainerHeight - searchHeight- endorsementNavHeight) : 0);

	let resultsElement: HTMLElement | undefined = $state();

	let endorsementsHeadingElement: HTMLElement | undefined = $state();

	let endorsementsHeadingTopPosition: number = $derived(endorsementsHeadingElement ? endorsementsHeadingElement.getBoundingClientRect().top + window.scrollY : 0);

	let currentEndorsementTabsStickyPosition: number = $derived(endorsementsHeadingElement ? endorsementsHeadingElement?.getBoundingClientRect().bottom + window.scrollY : 0);

	let scrollableSearchHeight: number = $derived(innerHeight - clearFiltersButtonHeight - searchContainerTopPosition);

	let mobileScrollableSearchHeight: number =$derived(searchContainerElement ? innerHeight - searchContainerElement.getBoundingClientRect().top - clearFiltersButtonHeight : 0);

    onMount(() => {
		if (innerWidth <= 720 && !useCurrentLocationChecked) {
			openFilters = false;
		};
    });

	$effect(() => {

        if (endorsementResultsHeight <= (scrollableSearchHeight + clearFiltersButtonHeight)) {
            // quilt search results height is less than search container = no search absolute position
            // handle for both mobile and desktop
            searchAbsolute = false;
            searchContainerSticky = false;
            if (y > currentEndorsementTabsStickyPosition) {
                endorsementTabsSticky = true;
            } else if (y <= currentEndorsementTabsStickyPosition) {
                endorsementTabsSticky = false;
            };
        } else if (endorsementResultsHeight > (scrollableSearchHeight + clearFiltersButtonHeight)) {
            // quilt search results height is more than search container = include search absolute position
            if (innerWidth <= 720) {
                // mobile = no search absolute position
                searchAbsolute = false;
                if (y > currentEndorsementTabsStickyPosition) {
                    endorsementTabsSticky = true;
                    searchContainerSticky = true;
                } else if (y <= currentEndorsementTabsStickyPosition) {
                    endorsementTabsSticky = false;
                    searchContainerSticky = false;
                };
            } else if (innerWidth > 720) {
                if ((y > currentEndorsementTabsStickyPosition) && (y > searchAbsolutePosition)) {
                    endorsementTabsSticky = true;
                    searchContainerSticky = true;
                    searchAbsolute = true;
                } else if (y > currentEndorsementTabsStickyPosition && y <= searchAbsolutePosition) {
                    endorsementTabsSticky = true;
                    searchContainerSticky = true;
                    searchAbsolute = false;
                } else if (y <= currentEndorsementTabsStickyPosition && y <= searchAbsolutePosition) {
                    endorsementTabsSticky = false;
                    searchContainerSticky = false;
                    searchAbsolute = false;
                };
            };
        };

    });

    let disableClearFiltersButton: boolean = $state(true);

    $effect(() => {
        if (searchByStreetAddressInputValue !== "") {
            disableClearFiltersButton = false;
        } else if (useCurrentLocationChecked) {
            disableClearFiltersButton = false;
        } else if (yearInputValue !== "") {
            disableClearFiltersButton = false;
        } else {
            disableClearFiltersButton = true;
        };
    });
</script>
<svelte:head>
	<title>actions - public arts commission</title>
	<meta name="description" content="forthcoming and past actions endorsed by public arts commission" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<svelte:window 
    bind:innerHeight
    bind:innerWidth 
    bind:scrollY={y}
/>
<section class="page">
<h1 bind:this={endorsementsHeadingElement}>
		endorsed actions
	</h1>
	<div 
		id="endorsement_nav_tabs"
		bind:this={endorsementsNav}
		class={endorsementTabsSticky ? "endorsement_tabs_container_sticky" : "endorsements_tabs_container"}
		bind:clientHeight={endorsementNavHeight}
	>
		<div class="endorsement_nav_tabs_inner">
			<Tabs
				tabPanels={endorsementTabPanels} 
				bind:activeTab={activeEndorsementsTab}
				bind:currentPage={currentPage}
			/>
			<div class="filter_toggle_button_container">
				<FilterToggleButton bind:openFilters >filters</FilterToggleButton>
			</div>	
		</div>
		{#if (innerWidth <= 720)}
			<div class="mobile_search_container">
				<div 
					id="filters_container_mobile" 
					class={openFilters ? "filters_container_open" : "filters_container_closed"}
					style={openFilters ? `height: ${searchHeight}px` : 'height: 0px;'}
					bind:clientHeight={searchContainerHeight}
					bind:this={searchContainerElement}
				>
					<form 
						id="filters"
						noValidate 
						autoComplete="off"
						onsubmit={(e) => e.preventDefault()}
						bind:clientHeight={searchHeight}
						style={openFilters ? "opacity: 100%;" : "opacity: 0;"}
					>
						<div 
							class="scrollable_search_container"
							style={`height: ${mobileScrollableSearchHeight}px;`}
						>
							<h2 style="text-align: center">filters</h2>
							<ArrowButton bind:openFilters />
							<div class="search_endorsements_input_container">
								{#if pendingReverseGeocode}
									<LoaderAnimation />
								{:else if addressLoadSuccess || !useCurrentLocationChecked}
									<SearchInput 
										placeholder="campaign name | 1000 MyStreet, MyCity, MyState  10000 | City, State | State | 10000"
										inputID="address"
										inputName="address"
										inputLabel={true}
										bind:searchInputValue={searchByStreetAddressInputValue}
										searchInputValueChange={() => searchByNameOrLocationInputValueChangeHandler()}
										options={statesWithCity}
										bind:optionSelected={searchbarOptionSelected}
									>
										name, street address, city, state or zip code
									</SearchInput>
								{:else if !addressLoadSuccess}
									<p>failed to load address</p>
								{/if}
								<Checkbox 
									bind:checked={useCurrentLocationChecked}
								>
									<div class="use_current_location_label">
										<div class="geolocation_container">
											{@html GeolocationIcon}
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
									year
								</SelectSearchInput>	
							</div>
						</div>
						<div 
							class="clear_filters_container"
							bind:clientHeight={clearFiltersButtonHeight}
						>
							<SubmitButtonSecondary 
								disable={disableClearFiltersButton}
								bind:clicked={clearFiltersClicked}
							>
								clear filters
							</SubmitButtonSecondary>
						</div>
					</form>
				</div>
			
			</div>
		{/if}
	</div>
	<div 
		class="filters_and_results"
		style={endorsementTabsSticky ? `padding-top: ${endorsementNavHeight}px;` : "padding-top: 0px;"}
	>
		{#if (innerWidth > 720)}
			<div 
				id="filters_container" 
				class={openFilters ? "filters_container_open" : "filters_container_closed"}
				bind:clientHeight={searchContainerHeight}
				bind:this={searchContainerElement}
			>
				<form 
					id="filters"
					noValidate 
					autoComplete="off"
					onsubmit={(e) => e.preventDefault()}
					class={searchContainerSticky ? !searchAbsolute ? "filters_sticky" : "filters_absolute" : "filters_not_sticky"}
					style={searchContainerSticky ? searchAbsolute ? "" : `top: ${endorsementNavHeight}px;` : "top: 0;"}
					bind:clientHeight={searchHeight}
				>
					<div 
						class="scrollable_search_container"
						style={`height: ${scrollableSearchHeight}px;`}
					>
						<ArrowButton bind:openFilters={openFilters} />
						<h2 style="text-align: center">filters</h2>
						<div class="search_endorsements_input_container">
							{#if pendingReverseGeocode}
								<LoaderAnimation />
							{:else if addressLoadSuccess || !useCurrentLocationChecked}
								<SearchInput 
									placeholder="campaign name | 1000 MyStreet, MyCity, MyState  10000 | City, State | State | 10000"
									inputID="address"
									inputName="address"
									inputLabel={true}
									bind:searchInputValue={searchByStreetAddressInputValue}
									searchInputValueChange={() => searchByNameOrLocationInputValueChangeHandler()}
									options={statesWithCity}
									bind:optionSelected={searchbarOptionSelected}
								>
									name, street address, city, state or zip code
								</SearchInput>
							{:else if !addressLoadSuccess}
								<p>failed to load address</p>
							{/if}
							<Checkbox 
								bind:checked={useCurrentLocationChecked}
							>
								<div class="use_current_location_label">
									<div class="geolocation_container">
										{@html GeolocationIcon}
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
					</div>
					<div 
						class="clear_filters_container"
						bind:clientHeight={clearFiltersButtonHeight}
					>
						<SubmitButtonSecondary 
							disable={disableClearFiltersButton}
							bind:clicked={clearFiltersClicked}
						>
							clear filters
						</SubmitButtonSecondary>
					</div>
				</form>
			</div>
		{/if}
		<div class="results_container">
			<div 
				bind:clientHeight={endorsementResultsHeight}
				bind:this={resultsElement}
				class="results"
			>
				{#if pendingEndorsedActionsData}
					<LoaderAnimation />
				{:else if getEndorsedActionsDataSuccess}
					<Panel 
						bind:tabPanels={endorsementTabPanels} 
						bind:activeTab={activeEndorsementsTab}
						bind:currentPage
						endorsementNavHeight={endorsementNavHeight}
						endorsementsType={endorsementsType}
					></Panel>
				{:else}
					failed to load referendums
				{/if}
			</div>
		</div>
	</div>
	<div 
		id="nominate_button_container"
	>
		<NominateButton 
			category="candidate"
			authorized_user={data.streamed.user}
		>
			make a nomination
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

	#filters_container_mobile {
		display: none;
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

	.results_container {
		width: 100%;
		position: relative;
	}

	.results {
		position: relative;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.filter_toggle_button_container {
		position: absolute;
		right: 0;
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

	#endorsement_nav_tabs {	
		width: 100%;
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
		display: flex;
		justify-content: center;
		width: 100%;
		max-width: 1920px;
		margin: 0 auto;
		padding: 0.5rem 1rem;
	}

	.year_input_container {
		width: 12rem;
	}

	.scrollable_search_container {
		width: 100%;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
	}

	.clear_filters_container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 1rem;
		border-top: 1px;
        border-right: 0;
        border-left: 0;
        border-bottom: 0;
        border-style: solid;
        border-color: #1C2226;
	}

	#nominate_button_container {
		padding: 1rem;
		max-width: 1920px;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		background: none;
		pointer-events: none;
	}


	.mobile_search_container {
		position: relative;
		width: 100%;
	}

	@media screen and (max-width: 1440px) {

		#filters_container {
			width: 24rem;
			min-width: 24rem;
		}

		.filters_sticky {
			width: 24rem;
		}

		.filters_container_closed {
			margin-left: -24rem;
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
			width: 20rem;
			min-width: 20rem;
		}

		.filters_container_closed {
			margin-left: -20rem;
		}

		.filters_sticky {
			width: 20rem;
		}

	}

	@media (max-width: 720px) {

		.endorsements_tabs_container {
			position: relative;
		}

		.endorsement_nav_tabs_inner {
			position: relative;
			display: flex;
			flex-direction: column-reverse;
			justify-content: center;
			margin: 0;
			gap: 0.5rem;
		}

		.filter_toggle_button_container {
			position: relative;
			right: 0;
			padding: 0;
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
		}

		.use_current_location_label {
			font-size: 0.85rem;
		}

		.filters_and_results {
			display: flex;
			flex-direction: column;
			width: 100%;
		}

		#filters_container_mobile {
			display: block;
			position: absolute;
			width: 100%;
			min-width: 100%;
			overflow-y: hidden;
			will-change: height;
        	transition: height 0.4s cubic-bezier(0.65, 0.05, 0.36, 1);
			min-width: 100%;
			z-index: 1;
			margin-left: 0;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #E7DED0;
		}

		.filters_container_open {			
			height: 100%;
			overflow: hidden;

		}

		.filters_container_closed {
			height: 0;
			overflow: hidden;
		}

		#filters {
			position: relative;
			transition: opacity 0.6s ease-out;
		}

        .geolocation_container {
            width: 1rem;
        }

	}

</style>