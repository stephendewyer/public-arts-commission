<script lang="ts">
    import ActionButton from "$lib/components/buttons/ActionButton.svelte";
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import GeolocationIcon from "$lib/images/icons/geolocation_icon.svg?raw";
    import { onMount } from 'svelte';
    import LoaderAnimation from '$lib/components/loaders/LoaderAnimation.svelte';
    import Years from '$lib/data/years.json';
	import SelectSearchInput from '$lib/components/inputs/SelectSearchInput.svelte';
	import { parse } from "@universe/address-parser";
	import USCities from '$lib/data/USCities.json';
    import States from '$lib/data/states.titlecase.json';
    import Checkbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
    import { page } from '$app/state';
    import ArrowButton from '$lib/components/buttons/ArrowButton.svelte';
    import SubmitButtonSecondary from "$lib/components/buttons/SubmitButtonSecondary.svelte";
    import ActionButtonSecondary from "$lib/components/buttons/ActionButtonSecondary.svelte";

    // set the latitude and longitude with user's position.coords

	let reversedGeolocation: ReverseGeoLocation = $state({
        addresses: [],
        summary: {
            queryTime: 0,
            numResults: 0
        }
    });

	// use the user's geolocation to get the user's address

    let useCurrentLocationChecked: boolean = $state(false);
	// after submit

	let addressLoadSuccess: boolean | null = $state(null);

	let pendingReverseGeocode: boolean | null = $state(null);

    let searchByStreetAddressInputValue: string = $state("");

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
		CityWard: ""
	});

	async function reverseGeocode(latitude: number | null, longitude: number | null): Promise<string | undefined> {

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
			
			// show the user's address as the value in the searchEndorsements searchInput
			searchByStreetAddressInputValue = reversedGeolocation.addresses[0].address.freeformAddress;
			location.country = reversedGeolocation.addresses[0].address.country;
			location.zipcode = reversedGeolocation.addresses[0].address.extendedPostalCode;
			location.state = reversedGeolocation.addresses[0].address.countrySubdivision;
			location.county = reversedGeolocation.addresses[0].address.countrySecondarySubdivision;
			location.city = reversedGeolocation.addresses[0].address.municipality;
			location.street= reversedGeolocation.addresses[0].address.street;
			location.streetNumber = reversedGeolocation.addresses[0].address.streetNumber;

            // set the search

			return searchByStreetAddressInputValue;

		} else if (!response.ok) {
			pendingReverseGeocode = false;
			addressLoadSuccess = false;
			return searchByStreetAddressInputValue = "";
		};

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
		navigator.geolocation.getCurrentPosition(success, error);
	};

        // if user activates the get current location checkbox, call the findUserLocation checkbox, else clear the searchValue
    $effect(() => {
        if (useCurrentLocationChecked) { 
            pendingReverseGeocode = true;
            findUserLocation();
        };
    });	

	let statesWithCity: string[] = $state([]);

	const searchByStreetAddressInputValueChangeHandler = () => {

		location.country = "";
		location.zipcode = "";
		location.state = "";
		location.city = "";
		location.street= "";
		location.streetNumber = "";
		location.streetPreDir = "";
		location.county = "";
		location.USCongressionalDistrict = "";
		location.StateSenateDistrict = "";
		location.StateHouseDistrict = "";
		location.CityWard = "";

		// uncheck "use my current location" checkbox if user changes the search by address input value after checking "use my current location"
		
		if (
			useCurrentLocationChecked && 
			(reversedGeolocation.addresses[0].address.freeformAddress !== searchByStreetAddressInputValue)
		) {
			useCurrentLocationChecked = false;
		};

		let stateName: string = "";
		let stateAbbreviation: string = "";
		let searchBarInputValueArray: string[] | number[] = searchByStreetAddressInputValue.split(" ");
		let searchBarInputValueFirstWord: string | number = "";

		if (searchBarInputValueArray[0].includes(",")) {
			searchBarInputValueFirstWord = searchBarInputValueArray[0].replace(",", "");
		} else {
			searchBarInputValueFirstWord = searchBarInputValueArray[0];
		};

		let searchBarInputValueSecondWord: string = "";

		if (searchBarInputValueArray.length > 1) {
			if (searchBarInputValueArray[1].includes(",")) {
				searchBarInputValueSecondWord = searchBarInputValueArray[1].replace(",", "");
			} else {
				searchBarInputValueSecondWord = searchBarInputValueArray[1];
			};
		};

		let stateValueArray: string[] = [];
		let stateValueFirstWord: string = "";
		let cityValueArray: string[] = [];
		let cityValueFirstWord: string = "";
		let countyValueArray: string[] = [];
		let countyValueFirstWord: string = "";

		// IMPORTANT: street address parser must have an input length greater than zero

		// if search by address input value is greater than zero and use my current location is not checked, 
		// use address-parser to parse search by address input value

		if (
			!useCurrentLocationChecked
		) {

			if (!/^-?\d+$/.test(searchByStreetAddressInputValue)) {

				// if the first entered value by user is a letter, filter actions by state, city and name
				// check if search input value includes state
				// user is not using geocoordinates
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

			};

		};

	};

	let pendingUSCongressionalDistrict: boolean | null = $state(null);

	// after getUSCongressionalDistrict
	let getUSCongressionalDistrictResponse: ResponseObj = $state({
        success: "",
        error: "",
        status: null
    });

    $effect(() => {
        if((getUSCongressionalDistrictResponse.error)) {
            setTimeout(() => {
                getUSCongressionalDistrictResponse.success = "";
                getUSCongressionalDistrictResponse.error = "";
                status: null;
            }, 4000);
        };

        if((getUSCongressionalDistrictResponse.success) || (getUSCongressionalDistrictResponse.error)) {
            pendingUSCongressionalDistrict = false;
        };
    });

	const getGeoCoordinates = async (location: VoterLocation) => {
		let geoCoordinates;
		try {
			const response = await fetch("/api/getGeoCoordinates", {
				method: 'POST',
				body: JSON.stringify({
					country: location.country,
					zipcode: location.zipcode,
					state: location.state,
					city: location.city,
					street: location.street,
					streetNumber: location.streetNumber,
					streetPreDir: location.streetPreDir
				}),
				headers: {
					'Content-Type': 'application/json',
				}
			});
			if (response.ok) {
				geoCoordinates = await response.json();
				location.latitude = geoCoordinates.y;
				location.longitude = geoCoordinates.x;
			};
		} catch(error) {
			console.log(error);
		};
	};
	
	const getUSCongressionalDistrict = async (latitude: number | null, longitude: number | null) => {
		pendingUSCongressionalDistrict = true;
		try {
			const response = await fetch("/api/getUSCongressionalDistrict", {
				method: "POST",
				body: JSON.stringify({
					longitude, 
					latitude
				}),
				headers: {
					"Content-Type": "application/json",
				}
			});
			getUSCongressionalDistrictResponse = await response.json();
			if (getUSCongressionalDistrictResponse.success) {
				location.USCongressionalDistrict = getUSCongressionalDistrictResponse.success;
			};	
		} catch(error) {
			console.log(error);
		};
	};

	const searchLocalGovernment = (e: Event) => {

		e.preventDefault();

		let stateName: string = "";
		let stateAbbreviation: string = "";
		location.country = "";
		location.zipcode = "";
		location.state = "";
		location.city = "";
		location.street= "";
		location.streetNumber = "";
		location.streetPreDir = "";
		location.county = "";
		location.USCongressionalDistrict = "";
		location.StateSenateDistrict = "";
		location.StateHouseDistrict = "";
		location.CityWard = "";

		let searchBarInputValueArray: string[] | number[] = searchByStreetAddressInputValue.split(" ");
		let searchBarInputValueFirstWord: string | number = "";

		if (searchBarInputValueArray[0].includes(",")) {
			searchBarInputValueFirstWord = searchBarInputValueArray[0].replace(",", "");
		} else {
			searchBarInputValueFirstWord = searchBarInputValueArray[0];
		};

		let searchBarInputValueSecondWord: string = "";

		if (searchBarInputValueArray.length > 1) {
			if (searchBarInputValueArray[1].includes(",")) {
				searchBarInputValueSecondWord = searchBarInputValueArray[1].replace(",", "");
			} else {
				searchBarInputValueSecondWord = searchBarInputValueArray[1];
			};
		};

		let stateValueArray: string[] = [];
		let stateValueFirstWord: string = "";
		let cityValueArray: string[] = [];
		let cityValueFirstWord: string = "";
		let countyValueArray: string[] = [];
		let countyValueFirstWord: string = "";

		// IMPORTANT: street address parser must have an input length greater than zero

		// if search by address input value is greater than zero and use my current location is not checked, 
		// use address-parser to parse search by address input value

		if (useCurrentLocationChecked) {

			if ( location.longitude && location.latitude ) {

				// get the U.S. Congressional District using longitude and latitude
				getUSCongressionalDistrict(location.latitude, location.longitude);

			} else {

				location.USCongressionalDistrict = "";

			};		

		} else if (
			!useCurrentLocationChecked
		) {

			// if user has entered only numbers, filter actions using zipcode

			if (/^-?\d+$/.test(searchByStreetAddressInputValue)) {
				// user is not using geocoordinates
				location.longitude = null;
				location.latitude = null;

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

			} else if (
				// if user enters numbers followed by strings, user is searching by street address
				/^-?\d+$/.test(searchBarInputValueFirstWord) && !(/^-?\d+$/.test(searchBarInputValueSecondWord))
			) {
				// parse the search by address input value
				const parsed = parse(searchByStreetAddressInputValue);

				// load the parsed properties

				location.country = parsed.country !== null ? parsed.country : "";
				location.zipcode = parsed.zip !== null ? parsed.zip : "";
				location.state = parsed.state !== null ? parsed.state : "";
				location.city = parsed.city !== null ? parsed.city : "";
				location.street= parsed.streetName !== null ? parsed.streetName : "";
				location.streetNumber = parsed.number !== null ? parsed.number : "";
				location.streetPreDir = parsed.streetPreDir !== null ? parsed.streetPreDir : "";

				// use zip code to load county from parsed address

				location.county = USCities.find((city) => city.zip_code.toString() === location.zipcode)?.county;

				// get the latitude and longitude using street address
				// get the latitude and longitude only if street number, street, city and state are entered

				if (
					location.streetNumber && 
					location.street && 
					location.city && 
					location.state
				) {
					// get the geocoordinates to find local governemnt
					getGeoCoordinates(location);

					if (location.longitude && location.latitude) {
						// get the U.S. Congressional District using longitude and latitude
						getUSCongressionalDistrict(location.latitude, location.longitude);
					};
				} else {
					location.USCongressionalDistrict = "";
				};				

				// get U.S. Congressional District, State Senate District, State House District and City Ward data

				// getUSCongressionalDistrict(latitude, longitude);

			} else if (!/^-?\d+$/.test(searchByStreetAddressInputValue)) {

				// if the first entered value by user is a letter, filter actions by state, city and name
				// check if search input value includes state
				// user is not using geocoordinates
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

			};

		};

	};


    let disableSearchButton: boolean = $state(false);

    $effect(() => {
        if (searchByStreetAddressInputValue !== "") {
            disableSearchButton = false;
        } else if (useCurrentLocationChecked) {
            disableSearchButton = false;
        } else {
            disableSearchButton = true;
        };
    });

</script>

<div class="page" id="page_container">
    <form 
        id="filters"
        noValidate 
        autoComplete="off"
        onsubmit={(e) => searchLocalGovernment(e)}
    >
        <h2 style="text-align: center">
            find my local government
        </h2>
        {#if pendingReverseGeocode}
            <LoaderAnimation />
        {:else if addressLoadSuccess || !useCurrentLocationChecked}
            <SearchInput 
                placeholder="1000 MyStreet, MyCity, MyState  10000 | City, State | State | 10000"
                inputID="address"
                inputName="address"
                inputLabel={true}
                bind:searchInputValue={searchByStreetAddressInputValue}
                searchInputValueChange={() => searchByStreetAddressInputValueChangeHandler()}
                options={statesWithCity}
            >
                street address, city, state or zip code
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
        <SubmitButtonSecondary disable={disableSearchButton}>
            search
        </SubmitButtonSecondary>
        {#if pendingUSCongressionalDistrict}
            <p style="font-size: 1rem">getting U.S. Congressional District</p>
        {:else if getUSCongressionalDistrictResponse.error}
            <p style="font-size: 1rem">failed to get U.S. Congressional District</p>
        {:else if location.USCongressionalDistrict}
            <p style="font-size: 1rem">
                <span>U.S. Congressional District: </span>
                <span style={"font-weight: bold"}>{location.USCongressionalDistrict}</span>
            </p>
        {/if}
    </form>
    <!-- <ul class="endorsement_categories" >
        <li>
            <a href="/endorsements/candidates-endorsed">
                <ActionButton>
                    candidates
                </ActionButton>
            </a>
        </li>
        <li>
            <a href="/endorsements/legislation-endorsed">
                <ActionButton>
                    legislation
                </ActionButton>
            </a>
        </li>
        <li>
            <a href="/endorsements/referendums-endorsed">
                <ActionButton>
                    referendums
                </ActionButton>
            </a>
        </li>
        <li>
            <a href="/endorsements/amendments-endorsed">
                <ActionButton>
                    amendments
                </ActionButton>
            </a>

        </li>
        <li>
            <a href="/endorsements/actions-endorsed">
                <ActionButton>
                    actions
                </ActionButton>
            </a>
        </li>
    </ul> -->
</div>

<style>

    #filters {
        display: flex;
        flex-direction: column;
        gap: 1rem;
		width: 100%;
		max-width: 60rem;
		margin: 0 auto;
    }

	.use_current_location_label {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
		font-size: 1.4rem;
    }

    .geolocation_container {
        width: 1.25rem;
    }

    .endorsement_categories {
        list-style: none;
        margin: 0;
        padding: 0;
    }

</style>