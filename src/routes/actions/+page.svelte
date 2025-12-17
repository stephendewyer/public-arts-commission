<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import ProposeActionButton from '$lib/components/buttons/NominateButton.svelte';
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
    import { page } from '$app/state';
    import GeoLocationIcon from "$lib/images/icons/geolocation_icon.svg?raw";
    import NominateButton from '$lib/components/buttons/NominateButton.svelte';
    import FilterToggleButton from '$lib/components/buttons/FilterToggleButton.svelte';
    import SubmitButtonSecondary from '$lib/components/buttons/SubmitButtonSecondary.svelte';
    import { reverseHtmlEntities } from "$lib/utils/reverseHtmlEntities";
    import { fade } from 'svelte/transition';
    import ArrowButton from '$lib/components/buttons/ArrowButton.svelte';

    export let data;

	let URLPathName: string = page.url.pathname;

    // once user clicks "use my current location" checkbox, 

    // define the location object

	interface Location {
		latitude: number | null;
		longitude: number | null;
		streetPreDir: string;
		streetNumber: string;
		street: string;
		city: string;
		county: string;
		state: string;
		zipcode: string;
		country: string;
	};

	const location: Location = {
		latitude: null,
		longitude: null,
		streetPreDir: "",
		streetNumber: "",
		street: "",
		city: "",
		county: "",
		state: "",
		zipcode: "",
		country: ""
	};

	// define the location variables

	let yearInputValue: string | any = "";
    let actionName: string = "";
    let searchByStreetAddressInputValue: string = ""
    let useCurrentLocationChecked: boolean = false;

    // load all the endorsed actions

    interface EndorsedActions {
        all: ActionWithImage[];
        past: ActionWithImage[];
        future: ActionWithImage[];
    };

    let endorsedActions: ActionWithImage[] = [];

    let searchEndorsedActions: SearchActionWithImage[] = [];

    const filteredEndorsedActions: EndorsedActions = {
        all: [],
        past: [],
        future: []
    };

    // begin get endorsed candidates data from database

    let pendingEndorsedActionsData: boolean = false;

    let getEndorsedActionsDataSuccess: boolean | null = null;

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

    afterUpdate(() => {
        HandleOpenSidedrawer();
    });

    const currentDate = new Date();

    // use the parsed address from seach by address input to filter endorsed candidates 

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

            filteredEndorsedActions.future = [...filteredEndorsedActions.future, action];    
        } else {
            filteredEndorsedActions.past = [...filteredEndorsedActions.past, action];
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
    $: paginatedActionsForthcoming = filteredEndorsedActions.future.slice(firstPageIndexActionsForthcoming, lastPageIndexActionsForthcoming);
    $: paginatedActionsHistory = filteredEndorsedActions.past.slice(firstPageIndexActionsHistory, lastPageIndexActionsHistory);

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
        location.country = reversedGeolocation.addresses[0].address.country;
        location.zipcode = reversedGeolocation.addresses[0].address.extendedPostalCode;
        location.state = reversedGeolocation.addresses[0].address.countrySubdivision;
        location.county = reversedGeolocation.addresses[0].address.countrySecondarySubdivision;
        location.city = reversedGeolocation.addresses[0].address.municipality;
        location.street= reversedGeolocation.addresses[0].address.street;
        location.streetNumber = reversedGeolocation.addresses[0].address.streetNumber;

        // clear categories data

        // update the search filter stores
        filteredEndorsedActions.all = [];
        filteredEndorsedActions.future = [];
        filteredEndorsedActions.past = [];

        actionsForthcomingCurrentPage = 1;
        actionsHistoryCurrentPage = 1;

        $searchEndorsedActionsStore.search = {
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
        };

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
        pending = false;
        addressLoadSuccess = false;
        console.log("Unable to retrieve your location!" + error);
    };

        // get user's location using JavaScript geolocation

    const findUserLocation = () => {
        actionName = "";
        navigator.geolocation.getCurrentPosition(success, error)
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

        // update the search filter stores
        filteredEndorsedActions.all = [];
        filteredEndorsedActions.future = [];
        filteredEndorsedActions.past = [];

        $searchEndorsedActionsStore.search = {
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
        };

    };

    // if option is selected, run filters

	let searchbarOptionSelected: boolean = false;

    $: if (searchbarOptionSelected) {
        searchByNameOrLocationInputValueChangeHandler()
        searchbarOptionSelected = false;
    };

    const selectYearInputValueChangeHandler = () => {

        // update the search filter stores
        // clear categories data
        filteredEndorsedActions.all = [];
        filteredEndorsedActions.future = [];
        filteredEndorsedActions.past = [];

        actionsForthcomingCurrentPage = 1;
        actionsHistoryCurrentPage = 1;

        $searchEndorsedActionsStore.search = {
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
        };

    };

    let openFilters: boolean = true;

	let searchHeight: number = 0;

	// innerWidth is the width of the inner window
	let innerWidth: number = 0;

	let clearFiltersClicked: boolean = false;

	$: if (clearFiltersClicked) {
		useCurrentLocationChecked = false;
		yearInputValue = "";
        searchByStreetAddressInputValue = "";
		searchByNameOrLocationInputValueChangeHandler();
        selectYearInputValueChangeHandler();
        actionsForthcomingCurrentPage = 1;
        actionsHistoryCurrentPage = 1;
		clearFiltersClicked = false;
	};

	let searchContainerHeight: number = 0;

	let searchContainerElement: HTMLElement;

	let mobileScrollableSearchHeight: number = 0;

	let innerHeight: number = 0;

	let scrollableSearchHeight: number = 0;

	let endorsementNavHeight: number = 0;

	let endorsementsNav: HTMLElement;	

	let y: number = 0;

    let endorsementTabsSticky: boolean = false;

    let currentEndorsementTabsStickyPosition: number = 0;

	let searchAbsolutePosition: number = 0;

	let searchAbsolute: boolean = false;

	let endorsementResultsHeight: number = 0;

	let clearFiltersButtonHeight: number = 0;

	let searchContainerSticky: boolean = false;

	let searchContainerTopPosition: number = 0;

	let nominateButtonContainerElement: HTMLElement;

	let resultsElement: HTMLElement;

	let nominateButtonAbsolute: boolean = false;

	let nominateButtonAbsolutePosition: number = 0;

	let resultsBottomPosition: number = 0;

	let nominateButtonContainerHeight: number = 0;

	let searchActionsHeadingElement: HTMLElement;

	let endorsementsHeadingTopPosition: number = 0;

    let forthcomingActionsSectionElement: HTMLElement;
    let forthcomingActionsSectionElementTop: number = 0;
    let forthcomingActionsSectionElementBottom: number = 0;
    let forthcomingActionsHeadingSticky: boolean = false;
    let forthcomingActionsHeadingAbsolute: boolean = false;
    let forthcomingActionsHeadingHeight: number = 0;

    let actionsHistorySectionElement: HTMLElement;
    let actionsHistorySectionElementTop: number = 0;
    let actionsHistorySectionElementBottom: number = 0;
    let actionsHistoryHeadingSticky: boolean = false;
    let actionsHistoryHeadingAbsolute: boolean = false;
    let actionsHistoryHeadingHeight: number = 0;

    onMount(() => {
		if (innerWidth <= 720) {
			openFilters = false;
		};
		endorsementsHeadingTopPosition = searchActionsHeadingElement.getBoundingClientRect().top + window.scrollY;
		resultsBottomPosition = resultsElement.getBoundingClientRect().bottom + window.scrollY;
		nominateButtonAbsolutePosition = resultsBottomPosition - nominateButtonContainerElement.clientHeight;
		searchContainerTopPosition = searchContainerElement?.getBoundingClientRect().top + window.scrollY;
        currentEndorsementTabsStickyPosition = endorsementsNav?.getBoundingClientRect().top + window.scrollY;
		mobileScrollableSearchHeight =  innerHeight - searchContainerElement?.getBoundingClientRect().top - clearFiltersButtonHeight;

        if (forthcomingActionsSectionElement) {
            forthcomingActionsSectionElementTop = forthcomingActionsSectionElement.getBoundingClientRect().top + window.scrollY;
            forthcomingActionsSectionElementBottom = forthcomingActionsSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };

        if (actionsHistorySectionElement) {
            actionsHistorySectionElementTop = actionsHistorySectionElement.getBoundingClientRect().top + window.scrollY;
            actionsHistorySectionElementBottom = actionsHistorySectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
    });

	const widowResizeHandler = () => {
		endorsementsHeadingTopPosition = searchActionsHeadingElement.getBoundingClientRect().top + window.scrollY;
		resultsBottomPosition = resultsElement.getBoundingClientRect().bottom + window.scrollY;
		nominateButtonAbsolutePosition = resultsBottomPosition - nominateButtonContainerElement.clientHeight;		
		searchContainerTopPosition = searchContainerElement?.getBoundingClientRect().top + window.scrollY;
		currentEndorsementTabsStickyPosition = searchActionsHeadingElement?.getBoundingClientRect().bottom + window.scrollY;

        if (forthcomingActionsSectionElement) {
            forthcomingActionsSectionElementTop = forthcomingActionsSectionElement.getBoundingClientRect().top + window.scrollY;
            forthcomingActionsSectionElementBottom = forthcomingActionsSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };

        if (actionsHistorySectionElement) {
            actionsHistorySectionElementTop = actionsHistorySectionElement.getBoundingClientRect().top + window.scrollY;
            actionsHistorySectionElementBottom = actionsHistorySectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
	};

	afterUpdate(() =>  {

		if (window.scrollY + innerHeight >= resultsBottomPosition) {
            nominateButtonAbsolute = true;
        } else {
            nominateButtonAbsolute = false;
        };

		endorsementsHeadingTopPosition = searchActionsHeadingElement.getBoundingClientRect().top + window.scrollY;
		resultsBottomPosition = resultsElement.getBoundingClientRect().bottom + window.scrollY;
		nominateButtonAbsolutePosition = resultsBottomPosition - nominateButtonContainerElement.clientHeight;
		mobileScrollableSearchHeight =  innerHeight - searchContainerElement?.getBoundingClientRect().top - clearFiltersButtonHeight;
		searchAbsolutePosition = searchContainerElement?.getBoundingClientRect().top + window.scrollY + (searchContainerHeight - searchHeight- endorsementNavHeight);
		searchContainerTopPosition = searchContainerElement?.getBoundingClientRect().top + window.scrollY;

        if (forthcomingActionsSectionElement) {
            forthcomingActionsSectionElementTop = forthcomingActionsSectionElement.getBoundingClientRect().top + window.scrollY;
            forthcomingActionsSectionElementBottom = forthcomingActionsSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };

        if (actionsHistorySectionElement) {
            actionsHistorySectionElementTop = actionsHistorySectionElement.getBoundingClientRect().top + window.scrollY;
            actionsHistorySectionElementBottom = actionsHistorySectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
	});

	$: scrollableSearchHeight = innerHeight - clearFiltersButtonHeight - searchContainerTopPosition;

	// $: console.log("endorsement results height: ", endorsementResultsHeight)

	$: if (endorsementResultsHeight <= (scrollableSearchHeight + clearFiltersButtonHeight)) {
		// quilt search results height is less than search container = no search absolute position
		// handle for both mobile and desktop
		searchAbsolute = false;
		searchContainerSticky = false;
		nominateButtonAbsolute = true;
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
			if (window.scrollY + innerHeight >= resultsBottomPosition) {
				nominateButtonAbsolute = true;
			} else {
				nominateButtonAbsolute = false;
			};
		};
	};

    $: if (innerWidth > 720) {
        if (
            (y > forthcomingActionsSectionElementTop - endorsementNavHeight) && 
            (y <= forthcomingActionsSectionElementBottom - endorsementNavHeight - forthcomingActionsHeadingHeight) 
        ) {
            forthcomingActionsHeadingSticky = true;
        } else {
            forthcomingActionsHeadingSticky = false;
        };

        if (y > forthcomingActionsSectionElementBottom - endorsementNavHeight - forthcomingActionsHeadingHeight) {
            forthcomingActionsHeadingAbsolute = true;
        } else {
            forthcomingActionsHeadingAbsolute = false;
        };

        if (
            (y > actionsHistorySectionElementTop - endorsementNavHeight) && 
            (y <= actionsHistorySectionElementBottom - endorsementNavHeight - actionsHistoryHeadingHeight) 
        ) {
            actionsHistoryHeadingSticky = true;
        } else {
            actionsHistoryHeadingSticky = false;
        };

        if (y > actionsHistorySectionElementBottom - endorsementNavHeight - actionsHistoryHeadingHeight) {
            actionsHistoryHeadingAbsolute = true;
        } else {
            actionsHistoryHeadingAbsolute = false;
        };
    };

	const handleScroll = () => {
		if (endorsementResultsHeight > (scrollableSearchHeight + clearFiltersButtonHeight)) {
			if (window.scrollY + innerHeight >= resultsBottomPosition) {
				nominateButtonAbsolute = true;
			} else {
				nominateButtonAbsolute = false;
			}
		};
	};

    let disableClearFiltersButton: boolean = false;

	$: if (searchByStreetAddressInputValue !== "") {
		disableClearFiltersButton = false;
	} else if (useCurrentLocationChecked) {
		disableClearFiltersButton = false;
	} else if (yearInputValue !== "") {
		disableClearFiltersButton = false;
	} else {
		disableClearFiltersButton = true;
	};

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
    on:resize={widowResizeHandler}
    on:scroll={handleScroll}
/>
<section class="page">
    <h1 bind:this={searchActionsHeadingElement}>
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
						on:submit|preventDefault
						bind:clientHeight={searchHeight}
						style={openFilters ? "opacity: 100%;" : "opacity: 0;"}
					>
						<div 
							class="scrollable_search_container"
							style={`height: ${mobileScrollableSearchHeight}px;`}
						>
                            <h2 style="text-align: center">filters</h2>
							<ArrowButton bind:openFilters />
                            <div class="search_actions_input_container">
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
                    on:submit|preventDefault
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
                        <div class="search_actions_input_container">
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
            <ul 
                bind:clientHeight={endorsementResultsHeight}
				bind:this={resultsElement}
                class="results"
            >
                {#if pendingEndorsedActionsData}
                    <LoaderAnimation />
                {:else if (pendingEndorsedActionsData === false && getEndorsedActionsDataSuccess === true)}
                    <li 
                        bind:this={forthcomingActionsSectionElement}
                        class="actions_section_container"
                        style="background-color: rgb(251, 239, 246);"
                    >
                        <div 
                            class="section_heading_container" 
                            style={forthcomingActionsHeadingSticky || forthcomingActionsHeadingAbsolute ? `height: ${forthcomingActionsHeadingHeight}px;` : "height: auto;"}
                        >
                            <h3
                                id="forthcoming_actions_heading"
                                bind:clientHeight={forthcomingActionsHeadingHeight}
                                class={forthcomingActionsHeadingSticky ? "section_heading_sticky" : forthcomingActionsHeadingAbsolute ? "section_heading_absolute" : "section_heading_relative"}
                                style={forthcomingActionsHeadingSticky ? `top: ${endorsementNavHeight}px;`: ""}
                            >
                                forthcoming actions
                            </h3>
                        </div>
                        <div class="action_cards_and_pagination">
                            <div class="action_cards_frame">
                                {#key actionsForthcomingCurrentPage}
                                    <div 
                                        in:fade={{ delay: 250, duration: 300 }}
                                        class="action_cards"
                                    >
                                        {#each paginatedActionsForthcoming as endorsedAction, i}
                                            <a 
                                                href={`${URLPathName}/?action_ID=${endorsedAction.action_ID}&action_name=${endorsedAction.action_name.replace(/ /g,"_")}`}
                                                data-sveltekit-noscroll
                                            > 
                                                <ActionEndorsementCard endorsedActionData={endorsedAction} />
                                            </a>
                                        {/each}
                                    </div>
                                {/key}
                            </div>
                            <div class="pagination_container">
                                <Pagination 
                                    bind:currentPage={actionsForthcomingCurrentPage}
                                    totalCount={filteredEndorsedActions.future.length}
                                    pageSize={pageSize}
                                />
                            </div>
                        </div>
                    </li>
                    <li 
                        bind:this={actionsHistorySectionElement}
                        class="actions_section_container"
                        style="background-color: rgb(203, 198, 194);"
                    >
                        <div 
                            class="section_heading_container" 
                            style={actionsHistoryHeadingSticky || actionsHistoryHeadingAbsolute ? `height: ${actionsHistoryHeadingHeight}px;` : "height: auto;"}
                        >
                            <h3
                                id="actions_history_heading"
                                bind:clientHeight={actionsHistoryHeadingHeight}
                                class={actionsHistoryHeadingSticky ? "section_heading_sticky" : actionsHistoryHeadingAbsolute ? "section_heading_absolute" : "section_heading_relative"}
                                style={actionsHistoryHeadingSticky ? `top: ${endorsementNavHeight}px;`: ""}
                            >
                                actions history
                            </h3>
                        </div>
                        <div class="action_cards_and_pagination">
                            <div class="action_cards_frame">
                                {#if pendingEndorsedActionsData}
                                    <LoaderAnimation />
                                {:else if getEndorsedActionsDataSuccess}
                                    {#key actionsHistoryCurrentPage}
                                        <div class="action_cards" in:fade={{ delay: 250, duration: 300 }}>
                                            {#each paginatedActionsHistory as endorsedAction, i}
                                                <a 
                                                    href={`${URLPathName}/?action_ID=${endorsedAction.action_ID}&action_name=${endorsedAction.action_name.replace(/ /g,"_")}`}
                                                    data-sveltekit-noscroll
                                                > 
                                                    <ActionEndorsementCard endorsedActionData={endorsedAction} />
                                                </a>
                                            {/each}
                                        </div>
                                    {/key}
                                {:else if !getEndorsedActionsDataSuccess}
                                    <p>failed to load endorsed actions history</p>
                                {/if}
                            </div>
                            <div class="pagination_container">
                                <Pagination 
                                    bind:currentPage={actionsHistoryCurrentPage}
                                    totalCount={filteredEndorsedActions.past.length}
                                    pageSize={pageSize}
                                />
                            </div>
                        </div>
                    </li>
                {:else if (getEndorsedActionsDataSuccess === false && pendingEndorsedActionsData === false)}
                    <p>failed to load endorsed forthcoming actions</p>
                {/if}
            </ul>
        </div>
    </div>
    <div 
		id="nominate_button_container"
		class={nominateButtonAbsolute ? "nominate_button_container_absolute" : "nominate_button_container_sticky"}
		style={nominateButtonAbsolute ? `top: ${nominateButtonAbsolutePosition - endorsementsHeadingTopPosition}px;` : "top: auto;"}
		bind:this={nominateButtonContainerElement}
		bind:clientHeight={nominateButtonContainerHeight}
	>
		<NominateButton 
			category="actions"
			authorized_user={data.streamed.user}
		>
			propose an action
		</NominateButton>
	</div>
</section>

<style>

    #forthcoming_actions_heading {
        background-color: rgb(251, 239, 246);
    }

    #actions_history_heading {
        background-color: rgb(203, 198, 194);
    }

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
		position: relative;
		width: 100%;
	}

	.results {
		position: relative;
		width: 100%;
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
	}

    .search_actions_input_container {
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
		justify-content: flex-end;
		width: 100%;
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
		justify-content: flex-end;
		background: none;
		pointer-events: none;
	}

	.nominate_button_container_sticky {
		left: auto;
		position: fixed;
		bottom: 0;
		right: 0;
	}

	.nominate_button_container_absolute {
		position: absolute;
		left: auto;
		right: 0;
		bottom: auto;
	}

	.mobile_search_container {
		position: relative;
		width: 100%;
	}

    .actions_section_container {
        position: relative;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .section_heading_container {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .section_heading_container > h3 {
        margin: 0;
        font-size: 2rem; 
        padding: 0 1rem 0.5rem 1rem;
    }

    .section_heading_relative {
        position: relative;
    }

    .section_heading_absolute {
        position: absolute;
        bottom: 0;
        top: auto;
        left: auto;
        right: auto;
        z-index: 1;
    }

    .section_heading_sticky {
        position: fixed;
        top: 0;
        bottom: auto;
        z-index: 1;
    }

    .action_cards_and_pagination {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .action_cards_frame {
        position: relative;
        width: auto;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .action_cards {
        position: relative;
        display: grid;
        grid-template-columns: repeat(4, 1fr);   
        gap: 1rem;
        padding: 0 0 1rem 0;
        width: 100%;
    }

    .pagination_container {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
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

        .section_heading_container > h3 {
           font-size: 1.875rem; 
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

        .section_heading_container > h3 {
            font-size: 1.675rem;
        }

        .action_cards_frame {
            width: 100%;
            max-width: 100%;
        }

    }

    @media screen and (max-width: 720px) {

        .action_cards {
            grid-template-columns: repeat(8, 1fr);   
        }

        .endorsements_tabs_container {
			position: relative;
		}

		.endorsement_nav_tabs_inner {
			margin: 0;
			gap: 0.5rem;
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

        .section_heading_container > h3 {
            font-size: 1.5rem;
        }

        .actions_section_container {
            gap: 0.5rem;
            width: 100%;
        }

    }

</style>