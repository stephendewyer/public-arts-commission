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
	import { goto } from "$app/navigation";

	let searchByStreetAddressInputValue: string = $state("");

	let useCurrentLocationChecked: boolean = $state(false);

	// get the search params from URL

	let searchParams: URLSearchParams = $derived(new URLSearchParams(page.url.search));

	let countryUnitedStates: boolean = $state(true);

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

	onMount(() => {

		// handle data in search

		if (page.url.search) {

			// check to see if address is in the U.S.
			if (searchParams.get("country") === "United_States") {
				countryUnitedStates = true;
			};

			if (searchParams.get("current_address_checked") === "true") {
				useCurrentLocationChecked = true;
			};

			const addressParam = searchParams.get("address");

			if (addressParam !== null) {
				searchByStreetAddressInputValue = addressParam.toString().replaceAll('_', ' ');
			};

			if (searchParams.get("latitude") !== null) {
				location.latitude = Number(searchParams.get("latitude"));
			};

			if (searchParams.get("longitude") !== null) {
				location.longitude = Number(searchParams.get("longitude"));
			};

		};

	});

    // set the latitude and longitude with user's position.coords

	let reversedGeolocation: ReverseGeoLocation = $state({
        addresses: [],
        summary: {
            queryTime: 0,
            numResults: 0
        }
    });

	// use the user's geolocation to get the user's address

	// after submit

	let addressLoadSuccess: boolean | null = $state(null);

	let pendingReverseGeocode: boolean | null = $state(null);
	
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
		// handle find user location only if search parameters don't already have the address
        if (
			useCurrentLocationChecked && (
				searchParams.get("current_address_checked") !== "true"
			)) { 
				pendingReverseGeocode = true;
				findUserLocation();
        } else if (
			// get the address from the search parameters
			useCurrentLocationChecked && 
			searchParams.get("current_address_checked") === "true"
		) {
			addressLoadSuccess = true;
		};
    });	

	let statesWithCity: string[] = $state([]);

	const searchByStreetAddressInputValueChangeHandler = () => {

		// clear the search paramaters only if search parameters
		if (searchParams.get("current_address_checked") === "true") {
			const url = new URL(page.url.pathname, window.location.origin);
			goto(url.toString(), { 
				replaceState: true, 
				keepFocus: true, 
				noScroll: true 
			});
		};
		// Navigates to the current path without the query string

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
		
		if (useCurrentLocationChecked && searchParams.get("current_address_checked") === "true") {
			useCurrentLocationChecked = false;
		} else if (
			useCurrentLocationChecked && (
				reversedGeolocation.addresses[0].address.freeformAddress !== searchByStreetAddressInputValue
			)
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

	let pendingGeocoordinates: boolean | null = $state(null);

	let getGeoCoordinatesResponse: ResponseObj = $state({
        success: "",
        error: "",
        status: null
    });


	const getGeoCoordinates = async (location: VoterLocation) => {
		pendingGeocoordinates = true;
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
		if (!response.ok) {
			console.log(getGeoCoordinatesResponse.error)
		} else {
			getGeoCoordinatesResponse = await response.json();
			pendingGeocoordinates = false;
			return {
				latitude: getGeoCoordinatesResponse.success.y,
				longitude: getGeoCoordinatesResponse.success.x
			};
	};
	};

	let pendingCivicDivisions: boolean | null = $state(null);

	// after getCivicDivisions
	let getDivisionsUSCensusResponse: ResponseObj = $state({
        success: "",
        error: "",
        status: null
    });

	let getDivisionsGoogleResponse: ResponseObj = $state({
        success: "",
        error: "",
        status: null
    });

	const extractGoogleDistricts = (location: VoterLocation, divisions: Record<string, { name: string }>): VoterLocation => {
		for (const [ocdId, division] of Object.entries(divisions)) {
			ocdId.split("/").forEach((part) => {

				if (part.startsWith('ward:') || part.startsWith("council_disctrict") ) {
					location.CityWard = part.substring(5);
				};

			});
		};

		return location;
	};

	const getCivicDivisions = async (latitude: number | null, longitude: number | null, searchByStreetAddressInputValue: string | null, country: string) => {

		// use the U.S. Census to get U.S. Congressional District, State House District and State Senate District
		pendingCivicDivisions = true;

		try {
			const response = await fetch("/api/getDivisionsUSCensus", {
				method: "POST",
				body: JSON.stringify({
					longitude, 
					latitude
				}),
				headers: {
					"Content-Type": "application/json",
				}
			});

			getDivisionsUSCensusResponse = await response.json();

			if (getDivisionsUSCensusResponse.success) {
				// extract the data
				const districts = getDivisionsUSCensusResponse.success;
				location.USCongressionalDistrict = districts.USCongressional;
				location.StateSenateDistrict = districts.stateSenate;
				location.StateHouseDistrict = districts.stateHouse;
			};	
		} catch(error) {
			console.log(error);
		};

		// use the Google API to get city divisions if any

		try {
			const response = await fetch("/api/getDivisionsGoogle", {
				method: "POST",
				body: JSON.stringify({
					address: searchByStreetAddressInputValue
				}),
				headers: {
					"Content-Type": "application/json",
				}
			});
			getDivisionsGoogleResponse = await response.json();

			if (getDivisionsGoogleResponse.success) {
				// extract the city districts
				extractGoogleDistricts(location, getDivisionsGoogleResponse.success)
			};	
		} catch(error) {
			console.log(error);
		};

	};

    $effect(() => {

		if (
			// handle if user has geocoordinates after page load
			!useCurrentLocationChecked &&
			getDivisionsUSCensusResponse.success && 
			getGeoCoordinatesResponse.success &&
			getDivisionsGoogleResponse.success
		) {
			pendingCivicDivisions = false;
		} else if (
			// handle if user has geocoordinates before page load
			useCurrentLocationChecked &&
			getDivisionsUSCensusResponse.success && 
			getDivisionsGoogleResponse.success
		) {
			pendingCivicDivisions = false;
		};

    });

	const searchLocalGovernment = async (e: Event) => {

		e.preventDefault();

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

		if (useCurrentLocationChecked) {

			// get the civic divisions by street address
			await getCivicDivisions(
				location.latitude, 
				location.longitude, 
				searchByStreetAddressInputValue, 
				location.country
			);

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

				// get the civic divisions only if street number, street, city, state and zipcode are entered

				if (
					location.streetNumber && 
					location.street && 
					location.city && 
					location.state &&
					location.zipcode
				) {
					// get the geocordinates
					
					const coords = await getGeoCoordinates(location);
					
					location.latitude = coords?.latitude;
					location.longitude = coords?.longitude;

					// get the civic divisons
					await getCivicDivisions(
						coords?.latitude, 
						coords?.longitude, 
						`${location.streetNumber} ${location.street}, ${location.city}, ${location.state} ${location.zipcode}`, 
						location.country
					);
				} else {
					console.log("Must have valid street address to get civic divisions");
				};				

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
		if (useCurrentLocationChecked && !countryUnitedStates) {
			disableSearchButton = true;
		} else if (!searchByStreetAddressInputValue && countryUnitedStates){
			disableSearchButton = true;
		} else {
			disableSearchButton = false;
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
        {#if pendingReverseGeocode || pendingGeocoordinates}
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
            <p style="color: red;">failed to load address</p>
        {/if}
		{#if !countryUnitedStates}
			<p style="color: red;">Address must be within the United States.  Please enter a valid United States address.</p>
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
        {#if pendingCivicDivisions}
            <p style="font-size: 1rem">getting local governments</p>
        {:else if getDivisionsGoogleResponse.error || getDivisionsUSCensusResponse.error}
            <p style="font-size: 1rem">failed to get local governments</p>
        {:else if location.USCongressionalDistrict}
            <table>
				<colgroup>
					<col style="width:40%">
					<col style="width:60%">
				</colgroup>
				<tbody>
					<tr>
						<td>
							state:
						</td>
						<td>
							{location.state}
						</td>
					</tr>
					<tr>
						<td>
							U.S. Congressional District:
						</td>
						<td>
							{location.USCongressionalDistrict}
						</td>
					</tr>
					<tr>
						<td>
							State House District:
						</td>
						<td>
							{location.StateHouseDistrict}
						</td>
					</tr>
					<tr>
						<td>
							State Senate District: 
						</td>
						<td>
							{location.StateSenateDistrict}
						</td>
					</tr>
					<tr>
						<td>
							County:
						</td>
						<td>
							{location.county}
						</td>
					</tr>
					<tr>
						<td>
							City:
						</td>
						<td>
							{location.city}
						</td>
					</tr>
					<tr>
						<td>
							Ward:
						</td>
						<td>
							{location.CityWard}
						</td>
					</tr>
				</tbody>
			</table>
        {/if}
    </form>
</div>

<style>

    #filters {
        display: flex;
        flex-direction: column;
        gap: 1rem;
		width: 100%;
		max-width: 60rem;
		margin: 0 auto;
		padding: 0 1rem;
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


</style>