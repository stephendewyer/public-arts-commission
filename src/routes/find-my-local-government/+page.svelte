<script lang="ts">
    import ActionButton from "$lib/components/buttons/ActionButton.svelte";
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import GeolocationIcon from "$lib/images/icons/geolocation_icon.svg?raw";
    import { onMount } from 'svelte';
    import LoaderAnimation from '$lib/components/loaders/LoaderAnimation.svelte';
	import { parse } from "@universe/address-parser";
	import USCities from '$lib/data/USCities.json';
    import Checkbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
    import { page } from '$app/state';
    import SubmitButtonSecondary from "$lib/components/buttons/SubmitButtonSecondary.svelte";
	import { goto } from "$app/navigation";
	import ErrorFlashMessage from "$lib/components/flashMessages/ErrorFlashMessage.svelte";
	import { VoterLocationStore } from "$lib/stores/VoterLocationStore.js";

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
		StateUnicameralDistrict: "",
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

		searchByStreetAddressInputValueChangeHandler();

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
		findUserLocationSuccess = true;
		location.latitude = position.coords.latitude;
		location.longitude = position.coords.longitude;
		reverseGeocode(location.latitude, location.longitude);
	};

	// log an error if getCurrentPosition fails

	let fundUserLocationErrorMessage: string = $state("");
	let findUserLocationSuccess: boolean | null = $state(null)

	const error = (error: any) => {
		pendingReverseGeocode = false;
		addressLoadSuccess = false;
		findUserLocationSuccess = false;
		switch (error.code) {
			case error.PERMISSION_DENIED:
				fundUserLocationErrorMessage = "Geolocation was denied.  Please allow geolocation from your browser.";
				break;
			case error.POSITION_UNAVAILABLE: 
				fundUserLocationErrorMessage = "Location information is unavailable.";
				break;
			case error.TIMEOUT:
				fundUserLocationErrorMessage = "The request to get your location timed out.";
			default:
				fundUserLocationErrorMessage = "An unknown geolocation error occurred.";
		};

	};

	// get user's location using JavaScript geolocation

	const findUserLocation = async () => {
		const permission = await navigator.permissions.query({
			name: "geolocation"
		});

		if (permission.state === "denied") {
			findUserLocationSuccess = false;
			fundUserLocationErrorMessage = "Location permission is disabled.  Please enable it in your browser";
		};

		navigator.geolocation.getCurrentPosition( success, error );
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

	let disableSearchButton: boolean = $state(true);

	let addressSlug: string = $derived(searchByStreetAddressInputValue.replace(/ /g,"_"));

	const searchByStreetAddressInputValueChangeHandler = () => {
		// clear the search paramaters only if search parameters
		if (
			searchParams.get("current_address_checked") === "true" &&
			searchParams.get("address") !== searchByStreetAddressInputValue.replace(/ /g,"_")
		) {
			const url = new URL(page.url.pathname, window.location.origin);
			// Navigates to the current path without the query string
			goto(url.toString(), { 
				replaceState: true, 
				keepFocus: true, 
				noScroll: true 
			});
		};

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
		// change USCongressionalDistrict to undefined to remove search results
		location.USCongressionalDistrict = "";

	};

	let searchErrorMessage: string = $state("");

	let pendingGeocoordinates: boolean | null = $state(null);

	let getGeoCoordinatesResponse: ResponseObj = $state({
        success: "",
        error: "",
        status: null
    });

	const getGeoCoordinates = async (location: VoterLocation) => {
		pendingGeocoordinates = true;

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

			getGeoCoordinatesResponse = await response.json();
			pendingGeocoordinates = false;

			if (!response.ok) {
				searchErrorMessage = getGeoCoordinatesResponse.error;
			} else if (getGeoCoordinatesResponse.success) {
				return {
					latitude: getGeoCoordinatesResponse.success.y,
					longitude: getGeoCoordinatesResponse.success.x
				};
			};
		} catch(error) {
			console.log(error);
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

			if (!response.ok) {
				searchErrorMessage = getDivisionsUSCensusResponse.error;
			} else if (getDivisionsUSCensusResponse.success) {
				// extract the data
				const districts = getDivisionsUSCensusResponse.success;
				location.USCongressionalDistrict = districts.congressional;
				location.StateUnicameralDistrict = districts.stateLegislative.find((district: LegislativeDistrict) => district.chamber === "unicameral")?.district;
				location.StateHouseDistrict = districts.stateLegislative.find((district: LegislativeDistrict) => district.chamber === "lower")?.district;
				location.StateSenateDistrict = districts.stateLegislative.find((district: LegislativeDistrict) => district.chamber === "upper")?.district;
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

			if (!response.ok) {
				searchErrorMessage = getDivisionsGoogleResponse.error;
			} else if (getDivisionsGoogleResponse.success) {
				// extract the city districts
				extractGoogleDistricts(location, getDivisionsGoogleResponse.success)
				// IMPORTANT!  UPDATE THE VoterLocationStore
				VoterLocationStore.updateLocation({...location});
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
		} else if (
			// handle if error getting data
			getDivisionsUSCensusResponse.error ||
			getGeoCoordinatesResponse.error ||
			getDivisionsGoogleResponse.error 
		) {
			pendingCivicDivisions = false;
		};
    });

	const searchLocalGovernment = async () => {

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

			if (
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
					if (location?.latitude && location?.longitude) {
						await getCivicDivisions(
							coords?.latitude, 
							coords?.longitude, 
							`${location.streetNumber} ${location.street}, ${location.city}, ${location.state} ${location.zipcode}`, 
							location.country
						);
					};

				} else {
					getGeoCoordinatesResponse.error = "Must have valid U.S. street address to get civic divisions";
					searchErrorMessage = getGeoCoordinatesResponse.error;
				};				

			} else {
				getGeoCoordinatesResponse.error = "Must have valid U.S. street address to get civic divisions";
				searchErrorMessage = getGeoCoordinatesResponse.error;
			};

		};

	};

	$effect(() => {
		if (
			getGeoCoordinatesResponse.error || 
			getDivisionsGoogleResponse.error ||
			getDivisionsUSCensusResponse.error
		) {
			setTimeout(() => {
				getGeoCoordinatesResponse.error = "";
				getDivisionsGoogleResponse.error = "";
				getDivisionsUSCensusResponse.error = "";
				status: null;
			}, 4000)
		};
	});

	$effect(() => {
		if (searchByStreetAddressInputValue !== "") {
			disableSearchButton = false;
		} else {
			disableSearchButton = true;
		};

	});

</script>

<svelte:head>
	<title>find my local government - public arts commission</title>
	<meta name="description" content="find my local government using geolocation and/or street address" />
	<meta property="og:image" content={PublicArtsCommissionBanner} 
/>
</svelte:head>

<div class="page" id="page_container">
    <form 
        id="filters"
        noValidate 
        autoComplete="off"
        onsubmit={(e) => e.preventDefault()}
    >
        <h2 style="text-align: center">
            find my local government
        </h2>
        {#if pendingReverseGeocode || pendingGeocoordinates}
            <LoaderAnimation />			
        {:else}
            <SearchInput 
                placeholder="1000 MyStreet, MyCity, MyState  10000"
                inputID="address"
                inputName="address"
                inputLabel={true}
                bind:searchInputValue={searchByStreetAddressInputValue}
                searchInputValueChange={() => searchByStreetAddressInputValueChangeHandler()}
            >
                street address
            </SearchInput>
			{#if (!findUserLocationSuccess && findUserLocationSuccess !== null)}
				<p style="color: red;">{fundUserLocationErrorMessage}</p>
			{:else if !addressLoadSuccess && addressLoadSuccess !== null}
				<p style="color: red;">failed to load address</p>
			{:else if !countryUnitedStates}
				<p style="color: red;">Address must be within the United States.  Please enter a valid United States address.</p>
			{/if}
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
        <SubmitButtonSecondary 
			disable={disableSearchButton}
			onclick={searchLocalGovernment}
		>
            search
        </SubmitButtonSecondary>
        {#if pendingCivicDivisions}
			<div class="pending_civic_divisions">
				<LoaderAnimation /><p class="loading_paragraph">getting local governments</p>
			</div>
		{:else if 
			getGeoCoordinatesResponse.error || 
			getDivisionsGoogleResponse.error ||
			getDivisionsUSCensusResponse.error
		}
			<ErrorFlashMessage>{searchErrorMessage}</ErrorFlashMessage>
        {:else if 
			location.USCongressionalDistrict
		}
            <table>
				<colgroup>
					<col style="width:40%">
					<col style="width:60%">
				</colgroup>
				<tbody>
					<tr>
						<td>
							country:
						</td>
						<td>
							{location.country}
						</td>
					</tr>
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
							State Unicameral District (Nebraska):
						</td>
						<td>
							{location.StateUnicameralDistrict}
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
							Ward or Council District:
						</td>
						<td>
							{location.CityWard}
						</td>
					</tr>
				</tbody>
			</table>
			<p>Data sourced from U.S. Census Bureau and Google Civic API DivisionsByAddress and accounts for latest Congressional mapping.</p>
        {/if}
    </form>
	<div class="endorsements">
		<h2>
			find endorsed...
		</h2>
		<div class="endorsement_categories">
			<a href={`/endorsements/candidates-endorsed?current_address_checked=${useCurrentLocationChecked}&address=${addressSlug}`}>
				<ActionButton>
					candidates
				</ActionButton>
			</a>
			<a href={`/endorsements/legislation-endorsed?current_address_checked=${useCurrentLocationChecked}&address=${addressSlug}`}>
				<ActionButton>
					legislation
				</ActionButton>
			</a>
			<a href={`/endorsements/referendums-endorsed?current_address_checked=${useCurrentLocationChecked}&address=${addressSlug}`}>
				<ActionButton>
					referendums
				</ActionButton>
			</a>
			<a href={`/endorsements/amendments-endorsed?current_address_checked=${useCurrentLocationChecked}&address=${addressSlug}`}>
				<ActionButton>
					amendments
				</ActionButton>
			</a>
			<a href={`/endorsements/actions-endorsed?current_address_checked=${useCurrentLocationChecked}&address=${addressSlug}`}>
				<ActionButton>
					actions
				</ActionButton>
			</a>
		</div>
	</div>
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

	.pending_civic_divisions {
		display: flex;
		flex-direction: row;
		align-self: center;
		justify-content: center;
		width: 100%;
		gap: 1rem;
	}

	.loading_paragraph {
		font-size: 2rem;
		font-weight: bold;
		display: flex;
		flex-wrap: row;
		align-items: center;
	}

	table {
        border-spacing: 0;
        width: 100%;
        table-layout: fixed;
    }

    tbody tr:nth-child(odd) {
        background-color: #FBF4F9
    }

    tbody > tr > td {
        padding: 1rem;
        overflow-wrap: break-word;
        hyphens: auto;
        font-size: 1.25rem;
    }

    tbody td:nth-child(odd) {
        overflow-wrap: break-word;
        hyphens: auto;
        font-weight: 600;
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-start;
    }

	.endorsements {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		width: 100%;
		max-width: 60rem;
		margin: 0 auto;
	}

	.endorsement_categories {
		display: flex;
		flex-wrap: wrap;
		gap: 0 1rem;
		width: 100%;
	}

	@media (max-width: 1140px) {

        tbody > tr > td {
            padding: 0.75rem 1rem;
            overflow-wrap: break-word;
            hyphens: auto;
            font-size: 1.125rem;
        }

		.loading_paragraph {
			font-size: 1.5rem;
		}

    }

    @media (max-width: 720px) {

        tbody > tr > td {
            padding: 0.5rem 1rem;
            overflow-wrap: break-word;
            hyphens: auto;
            font-size: 1rem;
        }

		.loading_paragraph {
			font-size: 1.25rem;
		}

    }


</style>