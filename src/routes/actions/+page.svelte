<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import ProposeActionButton from '$lib/components/buttons/NominateButton.svelte';
    import type { User } from '@auth/core/types.js';
    import ActionEndorsementCard from '$lib/components/cards/endorsementCards/ActionEndorsementCard.svelte';
    import { onDestroy, onMount } from 'svelte';
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

    export let data;

    $: data;

	let URLPathName: string = $page.url.pathname;

    // once user clicks "use my current location" checkbox, 

	// define the latitude and longitude variables
	let latitude: number | null = null;
	let longitude: number | null = null;

	// define the location variables

	let country: string | any = "";
	let zipcode: string | any = "";
	let state: string | any = "";
	let county: string | any = "";
	let city: string | any = "";
	let street: string | any = "";
	let streetNumber: string | any = "";

	let yearInputValue: number | any = "";

    let actionName: string | any = "";

    let searchByStreetAddressInputValue: string;

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

    $: searchEndorsedActions = endorsedActions.map((action: ActionWithImage) => ({
		...action,
		searchTerms: {
            year: {
                all_day_event_date: `${new Date(action.all_day_event_date).getFullYear()}`,
                date_start: `${new Date(action.date_start).getFullYear()}`,
                date_end: `${new Date(action.date_end).getFullYear()}`
            },
            action_name: `${action.action_name}`,
            zipcode: `${action.action_zip_code}`,
			state: `${action.action_state}`,
			city: `${action.action_city}`,
            government_level: `${action.government_level}`
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

    let actionsForthcomingCurrentPage: number;
    let actionsHistoryCurrentPage: number;

    $: actionsForthcomingCurrentPage = 1;
    $: actionsHistoryCurrentPage = 1;

    // set the index of the first item to appear on the page for each category
    let firstPageIndexActionsForthcoming: number;
    $: firstPageIndexActionsForthcoming = (actionsForthcomingCurrentPage -1) * pageSize;
    
    let firstPageIndexActionsHistory: number;
    $: firstPageIndexActionsHistory = (actionsHistoryCurrentPage -1) * pageSize;

    // set the index for the page after the first page for each category
    let lastPageIndexActionsForthcoming: number;
    $: lastPageIndexActionsForthcoming = firstPageIndexActionsForthcoming + pageSize;

    let lastPageIndexActionsHistory: number;
    $: lastPageIndexActionsHistory = firstPageIndexActionsHistory + pageSize;

    let paginatedActionsForthcoming: ActionWithImage[];
    let paginatedActionsHistory: ActionWithImage[];

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
        actionName = searchByStreetAddressInputValue.toLowerCase();
        // clear categories data

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

        navigator.geolocation.getCurrentPosition(success, error);

    };

        // if user activates the get current location checkbox, call the findUserLocation checkbox, else clear the searchValue

    $: if (useCurrentLocationChecked) { 

        pending = true;

        findUserLocation();

    };

    // handle changes to search endorsements by address input

	const searchByNameOrLocationInputValueChangeHandler = () => {
        actionName = "";
        country = "";
        zipcode = "";
        state = "";
        city = "";
        street= "";
        streetNumber = "";
        county = "";

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

                        return;

                    } else {

                        return;

                    };

                });

            } else if (!/^-?\d+$/.test(searchByStreetAddressInputValue)) {

                // if the first entered value by user is a letter, filter actions by state, city and action name

                // first, check if value includes state

                States.filter((stateObj) => {

                    if (
                        searchByStreetAddressInputValue.includes(stateObj.abbreviation) ||
                        searchByStreetAddressInputValue.toLowerCase().includes(stateObj.name.toLowerCase())
                    ) {

                        state = stateObj.name;

                    };

                });

                // second, check if value includes city

                USCities.filter((cityObj: CityObject) => {

                    if (
                        searchByStreetAddressInputValue.toLowerCase().includes(cityObj.city.toLowerCase())
                    ) {

                        // if no state, set city as cityObj.city

                        if (!state) {

                            city = cityObj.city;

                        } else if (state) {

                            // check to see if cityObj.state matches state

                            // make sure state is abbreviation

                            States.filter((stateObj) => {

                                if (
                                    stateObj.name === state
                                ) {

                                    state = stateObj.abbreviation;

                                };

                            });

                            if (state === cityObj.state) {

                                city = cityObj.city;

                            };

                        };

                    };

                });

                // third, check if entered value includes action name

                actionName = searchByStreetAddressInputValue.toLowerCase();

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
            actionName = "";
            country = "";
            zipcode = "";
            state = "";
            city = "";
            street= "";
            streetNumber = "";
            county = "";
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

    const selectYearInputValueChangeHandler = () => {

        // update the search filter stores
        // clear categories data

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

</script>
<svelte:head>
	<title>actions - public arts commission</title>
	<meta name="description" content="forthcoming and past actions endorsed by public arts commission" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<section class="actions">
    <form 
        class="search_endorsements_by_address_form"
    >
        <h1>
            search actions by action name, state, city, zip code or street address
        </h1>
        <div class="search_endorsement_fields">
            <div class="name_and_location_search_fields">
                <div class="use_current_location_checkbox">
                    <Checkbox 
                        bind:checked={useCurrentLocationChecked}
                    >
                        use my current location
                    </Checkbox>
                </div>
                <div class="search_endorsements_by_address_input">
                    {#if useCurrentLocationChecked}
                        {#if pending}
                            <LoaderAnimation />
                        {:else if addressLoadSuccess}
                            <SearchInput 
                                placeholder="1000 MyStreet, MyCity, MyState  10000"
                                inputID="address"
                                inputName="address"
                                inputLabel={false}
                                bind:searchInputValue={searchByStreetAddressInputValue}
                                searchInputValueChange={() => searchByNameOrLocationInputValueChangeHandler()}
                            />
                        {:else if !addressLoadSuccess}
                            <p>failed to load address</p>
                        {/if}
                    {:else}
                        <SearchInput 
                            placeholder="1000 MyStreet, MyCity, MyState  10000"
                            inputID="address"
                            inputName="address"
                            inputLabel={false}
                            bind:searchInputValue={searchByStreetAddressInputValue}
                            searchInputValueChange={() => searchByNameOrLocationInputValueChangeHandler()}
                        />
                    {/if}
                </div>
            </div>
            <div class="year_field">
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
    </form>
    <ul class="actions_categories_container">
        <li class="forthcoming_actions_container">
            <h3>
                forthcoming actions
            </h3>
            <div class="action_cards_frame">
                <div class="action_cards">
                    {#if pendingEndorsedActionsData}
                        <LoaderAnimation />
                    {:else if getEndorsedActionsDataSuccess}
                        {#each paginatedActionsForthcoming as endorsedAction, i}
                            <a 
                                href={`${URLPathName}/?action_ID=${endorsedAction.action_ID}&action_name=${endorsedAction.action_name.replace(/ /g,"_")}`}
                                data-sveltekit-noscroll
                            > 
                                <ActionEndorsementCard endorsedActionData={endorsedAction} />
                            </a>
                        {/each}
                    {:else if !getEndorsedActionsDataSuccess}
                        <p>failed to load endorsed forthcoming actions</p>
                    {/if}
                </div>
            </div>
            <Pagination 
                bind:currentPage={actionsForthcomingCurrentPage}
                totalCount={futureEndorsedActions.length}
                pageSize={pageSize}
            />
            <div class="propose_an_action_button_container">
                <ProposeActionButton
                    category="actions" 
                    authorized_user={user}
                >
                    propose an action
                </ProposeActionButton>
            </div>
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
    </ul>
</section>

<style>

    .actions {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .search_endorsements_by_address_form {
		display: flex;
		flex-direction: column;
		align-items: center;
        justify-content: center;
		padding: 0 1rem 0 1rem;
	}

	.search_endorsement_fields {
		display: flex;
		flex-direction: column;
		width: 100%;
        justify-content: flex-start;
        padding: 1rem 0;
        gap: 1rem;
	}

    .name_and_location_search_fields {
        display: flex;
		flex-direction: row;
		width: 100%;
        justify-content: center;
    }

	.use_current_location_checkbox {
		width:20rem;
		display: inline;
		margin: 0 1rem 0 0;
	}

	.search_endorsements_by_address_input {
		width: 40rem;
		display: inline-flex;
		justify-content: center;
		align-items: center;
	}

	.year_field {
		width: 100%;
		max-width: 10rem;
		margin: 0 auto 1rem auto;
	}

    .actions_categories_container {
        padding: 0;
        width: 100%;
        margin: 0;
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
        overflow-x: hidden;
    }

    .action_cards {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;      
        gap: 1rem;
        padding: 0 1rem 1rem 1rem;
        width: 100%;
    }

    
    .propose_an_action_button_container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        width: 100%;
        padding: 1rem 0 0 0;
    }

    @media (max-width: 1140px) {

        .search_endorsement_fields {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 0.5rem 0;
        }

        .name_and_location_search_fields {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            width: 100%;
        }

        .use_current_location_checkbox {
            width: 20rem;
            display: block;
            margin: 0;
        }

        .search_endorsements_by_address_input {
            width: 40rem;
            display: flex;
        }

        .action_cards_frame {
            width: 100%;
            overflow-x: scroll;
        }

        .action_cards {
            width: 100%;
            flex-wrap: nowrap;
            justify-content: flex-start;
        }

    }

    @media (max-width: 720px) {

        .search_endorsement_fields {
            gap: 0.5rem;
        }

        .search_endorsements_by_address_form {
            width: 100%;
        }

        .search_endorsements_by_address_input {
            width: 100%;
        }

        .name_and_location_search_fields {
            gap: 0.5rem;
        }

    }

</style>