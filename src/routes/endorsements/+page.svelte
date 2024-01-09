<script lang="ts">
    import Checkbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import Tabs from '$lib/components/tabPanels/Tabs.svelte';
	import TabPanel from '$lib/components/tabPanels/Panel.svelte';
    import { v4 as uuidv4 } from 'uuid';
	import CityEndorsementsPanel from '$lib/components/endorsements/endorsementPanels/CityEndorsementsPanel.svelte';
	import CountyEndorsementsPanel from '$lib/components/endorsements/endorsementPanels/CountyEndorsementsPanel.svelte';
	import StateEndorsementsPanel from '$lib/components/endorsements/endorsementPanels/StateEndorsementsPanel.svelte';
	import FederalEndorsementsPanel from '$lib/components/endorsements/endorsementPanels/FederalEndorsementsPanel.svelte';
	import AllEndorsementPanel from '$lib/components/endorsements/endorsementPanels/AllEndorsementPanel.svelte';
	import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
	import Years from '$lib/data/years.json';
	import SelectSearchInput from '$lib/components/inputs/SelectSearchInput.svelte';;
	import { parse } from "@universe/address-parser";
	import USCities from '$lib/data/USCities.json';
  	import { createEndorsedCandidatesSearchStore, searchEndorsedCandidatesHandler } from '$lib/stores/EndorsedCandidatesSearchStore.js';
	import { createEndorsedLegislationSearchStore, searchEndorsedLegislationHandler } from '$lib/stores/EndorsedLegislationSearchStore.js';
	import { createEndorsedReferendumsSearchStore, searchEndorsedReferendumsHandler } from '$lib/stores/EndorsedReferendumsSearchStore.js';
	import { createEndorsedAmendmentsSearchStore, searchEndorsedAmendmentsHandler } from '$lib/stores/EndorsedAmendmentsSearchStore.js';
	import LoaderAnimation from '$lib/components/loaders/LoaderAnimation.svelte';
	
	export let data;

	$: data;

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

    let searchByStreetAddressInputValue: string;

    let useCurrentLocationChecked: boolean;

	let activeEndorsementsTab: number;

	$: activeEndorsementsTab = 0;

    // get string from url of whether get current location checkbox checked and address

    let searchQueries: string[];

	// set the latitude and longitude with user's position.coords

	let reversedGeolocation: ReverseGeoLocation;

	// use the user's geolocation to get the user's address

	// after submit

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

		candidatesFederal = [];
		candidatesState = [];
		candidatesCounty = [];
		candidatesCity = [];

		legislationFederal = [];
		legislationState = [];
		legislationCounty = [];
		legislationCity = [];

		amendmentsFederal = [];
		amendmentsState = [];
		amendmentsCounty = [];
		amendmentsCity = [];

		referendumsFederal = [];
		referendumsState = [];
		referendumsCounty = [];
		referendumsCity = [];

		$searchEndorsedCandidatesStore.search = {
			year: yearInputValue,
			government_level: "federal",
			state: state,
			county: county,
			city: city
		};

		$searchEndorsedLegislationStore.search = {
			year: yearInputValue,
			government_level: "federal",
			state: state,
			county: county,
			city: city
		};

		$searchEndorsedAmendmentsStore.search = {
			year: yearInputValue,
			government_level: "federal",
			state: state,
			county: county,
			city: city
		};

		$searchEndorsedReferendumsStore.search = {
			year: yearInputValue,
			government_level: "federal",
			state: state,
			county: county,
			city: city
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

	let candidatesFederal: CandidateWithImage[] = [];
	let candidatesState: CandidateWithImage[] = [];
	let candidatesCounty: CandidateWithImage[] = [];
	let candidatesCity: CandidateWithImage[] = [];

	let endorsedCandidates: CandidateWithImage[] = [];

	$: endorsedCandidates = [...data.streamed.endorsed_candidates];

	// use the parsed address from seach by address input to filter endorsed candidates 

	$: searchEndorsedCandidates = endorsedCandidates.map((candidate: CandidateWithImage) => ({
		...candidate,
		searchTerms: {
			year: `${new Date(candidate.election_date_general).getFullYear()}`,
			government_level: `${candidate.government_level}`,
			state: `${candidate.state}`,
			county: `${candidate.county}`,
			city: `${candidate.city}`
		}
	}));

	$: searchEndorsedCandidatesStore = createEndorsedCandidatesSearchStore(searchEndorsedCandidates);

	$: unsubscribeSearchEndorsedCandidatesStore = searchEndorsedCandidatesStore.subscribe((model) => {

		searchEndorsedCandidatesHandler(model)

	});

	onDestroy(() => {

		unsubscribeSearchEndorsedCandidatesStore();
		
	});

	$: $searchEndorsedCandidatesStore.filtered.forEach((candidate: CandidateWithImage) => {
		if (candidate.government_level === "federal") {
			candidatesFederal = [...candidatesFederal, candidate];
		} else if (candidate.government_level === "state") {
			candidatesState = [...candidatesState, candidate];
		} else if (candidate.government_level === "county") {
			candidatesCounty = [...candidatesCounty, candidate];
		} else if (candidate.government_level === "city") {
			candidatesCity = [...candidatesCity, candidate];
		};
	});

	let legislationFederal: LegislationWithSponsorsAndImage[] = [];
	let legislationState: LegislationWithSponsorsAndImage[] = [];
	let legislationCounty: LegislationWithSponsorsAndImage[] = [];
	let legislationCity: LegislationWithSponsorsAndImage[] = [];

	let endorsedLegislation: LegislationWithSponsorsAndImage[] = [];

	$: endorsedLegislation = [...data.streamed.endorsed_legislation];

	// use the parsed address from seach by address input to filter endorsed legislation 

	$: searchEndorsedLegislation = endorsedLegislation.map((legislation: LegislationWithSponsorsAndImage) => ({
		...legislation,
		searchTerms: {
			year: `${legislation.year_released}`,
			government_level: `${legislation.government_level}`,
			state: `${legislation.state}`,
			county: `${legislation.county}`,
			city: `${legislation.city}`
		}
	}));

	$: searchEndorsedLegislationStore = createEndorsedLegislationSearchStore(searchEndorsedLegislation);

	$: unsubscribeSearchEndorsedLegislationStore = searchEndorsedLegislationStore.subscribe((model) => {

		searchEndorsedLegislationHandler(model)

	});

	onDestroy(() => {

		unsubscribeSearchEndorsedLegislationStore();
		
	});

	$: $searchEndorsedLegislationStore.filtered.forEach((legislation: LegislationWithSponsorsAndImage) => {
		if (legislation.government_level === "federal") {
			legislationFederal = [...legislationFederal, legislation];
		} else if (legislation.government_level === "state") {
			legislationState = [...legislationState, legislation];
		} else if (legislation.government_level === "county") {
			legislationCounty = [...legislationCounty, legislation];
		} else if (legislation.government_level === "city") {
			legislationCity = [...legislationCity, legislation];

		};
	});

	let amendmentsFederal: Amendment[] = [];
	let amendmentsState: Amendment[] = [];
	let amendmentsCounty: Amendment[] = [];
	let amendmentsCity: Amendment[] = [];

	let endorsedAmendments: AmendmentWithSponsorsAndImage[] = [];

	$: endorsedAmendments = [...data.streamed.endorsed_amendments];

	// use the parsed address from seach by address input to filter endorsed amendments 

	$: searchEndorsedAmendments = endorsedAmendments.map((amendment: AmendmentWithSponsorsAndImage) => ({
		...amendment,
		searchTerms: {
			year: `${amendment.year_released}`,
			government_level: `${amendment.government_level}`,
			state: `${amendment.state}`,
			county: `${amendment.county}`,
			city: `${amendment.city}`
		}
	}));

	$: searchEndorsedAmendmentsStore = createEndorsedAmendmentsSearchStore(searchEndorsedAmendments);

	$: unsubscribeSearchEndorsedAmendmentsStore = searchEndorsedAmendmentsStore.subscribe((model) => {

		searchEndorsedAmendmentsHandler(model)

	});

	onDestroy(() => {

		unsubscribeSearchEndorsedAmendmentsStore();
		
	});

	$: $searchEndorsedAmendmentsStore.filtered.forEach((amendment: AmendmentWithSponsorsAndImage) => {
		if (amendment.government_level === "federal") {
			amendmentsFederal = [...amendmentsFederal, amendment];
		} else if (amendment.government_level === "state") {
			amendmentsState = [...amendmentsState, amendment]
		} else if (amendment.government_level === "county") {
			amendmentsCounty = [...amendmentsCounty, amendment]
		} else if (amendment.government_level === "city") {
			amendmentsCity = [...amendmentsCity, amendment]
		};
	});

	let referendumsFederal: ReferendumWithImage[] = [];
	let referendumsState: ReferendumWithImage[] = [];
	let referendumsCounty: ReferendumWithImage[] = [];
	let referendumsCity: ReferendumWithImage[] = [];

	let endorsedReferendums: ReferendumWithImage[] = [];

	$: endorsedReferendums = [...data.streamed.endorsed_referendums];

	// use the parsed address from seach by address input to filter endorsed referendums 

	$: searchEndorsedReferendums = endorsedReferendums.map((referendum: ReferendumWithImage) => ({
		...referendum,
		searchTerms: {
			year: `${new Date(referendum.election_date).getFullYear()}`,
			government_level: `${referendum.government_level}`,
			state: `${referendum.state}`,
			county: `${referendum.county}`,
			city: `${referendum.city}`
		}
	}));

	$: searchEndorsedReferendumsStore = createEndorsedReferendumsSearchStore(searchEndorsedReferendums);

	$: unsubscribeSearchEndorsedReferendumsStore = searchEndorsedReferendumsStore.subscribe((model) => {

		searchEndorsedReferendumsHandler(model)

	});

	onDestroy(() => {

		unsubscribeSearchEndorsedReferendumsStore();
		
	});

	$: $searchEndorsedReferendumsStore.filtered.forEach((referendum: ReferendumWithImage) => {
		if (referendum.government_level === "federal") {
			referendumsFederal = [...referendumsFederal, referendum];
		} else if (referendum.government_level === "state") {
			referendumsState = [...referendumsState, referendum];
		} else if (referendum.government_level === "county") {
			referendumsCounty = [...referendumsCounty, referendum];
		} else if (referendum.government_level === "city") {
			referendumsCity = [...referendumsCity, referendum];
		};
	});

	// use onMount to get data from params after page is prerendered

    onMount(() => {
        if ($page.url.search !== "") {
            searchQueries = $page.url.search.split("?");
            console.log(searchQueries);
            if (searchQueries[1] === "current_address_checked=true") {
                useCurrentLocationChecked = true;
            } else if (searchQueries[1] !== "current_address_checked=true") {
                searchByStreetAddressInputValue = searchQueries[2].replace(/_/g, ' ');
            };
        };
    });

	// handle changes to search endorsements by address input

	const searchByStreetAddressInputValueChangeHandler = () => {

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
			(searchByStreetAddressInputValue.length > 0) &&
			!useCurrentLocationChecked
		) {

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

		} else {

			country = "";
			zipcode = "";
			state = "";
			city = "";
			street= "";
			streetNumber = "";
			county = "";

		};

		// update the search filter stores
		// update the candidate search filter store
		// clear categories data

		candidatesFederal = [];
		candidatesState = [];
		candidatesCounty = [];
		candidatesCity = [];

		legislationFederal = [];
		legislationState = [];
		legislationCounty = [];
		legislationCity = [];

		amendmentsFederal = [];
		amendmentsState = [];
		amendmentsCounty = [];
		amendmentsCity = [];

		referendumsFederal = [];
		referendumsState = [];
		referendumsCounty = [];
		referendumsCity = [];

		$searchEndorsedCandidatesStore.search = {
			year: yearInputValue,
			government_level: "federal",
			state: state,
			county: county,
			city: city
		};

		$searchEndorsedLegislationStore.search = {
			year: yearInputValue,
			government_level: "federal",
			state: state,
			county: county,
			city: city
		};

		$searchEndorsedAmendmentsStore.search = {
			year: yearInputValue,
			government_level: "federal",
			state: state,
			county: county,
			city: city
		};

		$searchEndorsedReferendumsStore.search = {
			year: yearInputValue,
			government_level: "federal",
			state: state,
			county: county,
			city: city
		};

	};

	const selectYearInputValueChangeHandler = () => {

		// update the search filter stores
		// update the candidate search filter store
		// clear categories data

		candidatesFederal = [];
		candidatesState = [];
		candidatesCounty = [];
		candidatesCity = [];

		legislationFederal = [];
		legislationState = [];
		legislationCounty = [];
		legislationCity = [];

		amendmentsFederal = [];
		amendmentsState = [];
		amendmentsCounty = [];
		amendmentsCity = [];

		referendumsFederal = [];
		referendumsState = [];
		referendumsCounty = [];
		referendumsCity = [];

		$searchEndorsedCandidatesStore.search = {
			year: yearInputValue,
			government_level: "federal",
			state: state,
			county: county,
			city: city
		};

		$searchEndorsedLegislationStore.search = {
			year: yearInputValue,
			government_level: "federal",
			state: state,
			county: county,
			city: city
		};

		$searchEndorsedAmendmentsStore.search = {
			year: yearInputValue,
			government_level: "federal",
			state: state,
			county: county,
			city: city
		};

		$searchEndorsedReferendumsStore.search = {
			year: yearInputValue,
			government_level: "federal",
			state: state,
			county: county,
			city: city
		};

	};

	let endorsementTabPanels: tabPanels[] = [];

	$: endorsementTabPanels = [
		{
			id: uuidv4(),
			index: 0,
			label: "all",
			hasCapitol: true,
			panel: AllEndorsementPanel,
			data: {
				user: data.streamed.user,
				endorsed_amendments: $searchEndorsedAmendmentsStore.filtered, 
				endorsed_candidates: $searchEndorsedCandidatesStore.filtered,
				endorsed_legislation: $searchEndorsedLegislationStore.filtered,
				endorsed_referendums: $searchEndorsedReferendumsStore.filtered
			}
		},
		{
			id: uuidv4(),
			index: 1,
			label: "federal",
			hasCapitol: true,
			panel: FederalEndorsementsPanel,
			data: {
				user: data.streamed.user,
				endorsed_amendments: amendmentsFederal,
				endorsed_candidates: candidatesFederal,
				endorsed_legislation: legislationFederal,
				endorsed_referendums: referendumsFederal
			}
		},
		{
			id: uuidv4(),
			index: 2,
			label: "state",
			hasCapitol: true,
			panel: StateEndorsementsPanel,
			data: {
				user: data.streamed.user,
				endorsed_amendments: amendmentsState,
				endorsed_candidates: candidatesState,
				endorsed_legislation: legislationState,
				endorsed_referendums: referendumsState
			}
		},
		{
			id: uuidv4(),
			index: 3,
			label: "county",
			hasCapitol: true,
			panel: CountyEndorsementsPanel,
			data: {
				user: data.streamed.user,
				endorsed_amendments: amendmentsCounty,
				endorsed_candidates: candidatesCounty,
				endorsed_legislation: legislationCounty,
				endorsed_referendums: referendumsCounty
			}
		},
		{
			id: uuidv4(),
			index: 4,
			label: "city",
			hasCapitol: true,
			panel: CityEndorsementsPanel,
			data: {
				user: data.streamed.user,
				endorsed_amendments: amendmentsCity,
				endorsed_candidates: candidatesCity,
				endorsed_legislation: legislationCity,
				endorsed_referendums: referendumsCity
			}
		}
	];

</script>

<svelte:head>
	<title>endorsements - public arts commission</title>
	<meta name="description" content="find public arts commission-endorsed candidates, legislation, referendums, amendments and actions" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>

<section>    
    <form 
		class="search_endorsements_by_address_form"
	>
		<h1>
		    search endorsements by street address
		</h1>
		<div class="search_endorsement_fields">
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
							searchInputValueChange={() => searchByStreetAddressInputValueChangeHandler()}
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
						searchInputValueChange={() => searchByStreetAddressInputValueChangeHandler()}
					/>
				{/if}
			</div>
		</div>
	</form>
	<div class="election_year_field">
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
	<div class="endorsements_tabs_container">
		<Tabs
			tabPanels={endorsementTabPanels} 
			bind:activeTab={activeEndorsementsTab}
		/>
	</div>
	
	<TabPanel
		tabPanels={endorsementTabPanels} 
		bind:activeTab={activeEndorsementsTab}
	/>
</section>

<style>

	.search_endorsements_by_address_form {
		display: flex;
		flex-direction: column;
		align-items: center;
        justify-content: center;
		padding: 0 1rem 0 1rem;
	}

	.search_endorsement_fields {
		display: flex;
		flex-direction: row;
		width: 100%;
        justify-content: center;
        padding: 1rem 0;
	}

	.use_current_location_checkbox {
		width:20rem;
		display: inline;
		margin: 0 1rem 0 0;
	}

	.search_endorsements_by_address_input {
		width: 40rem;
		display: inline;
	}

	.endorsements_tabs_container {
		display: flex;
		justify-content: center;
	}

	.election_year_field {
		width: 100%;
		max-width: 10rem;
		margin: 0 auto 1rem auto;
	}

    @media (max-width: 1140px) {

		.search_endorsement_fields {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;
			width: 100%;
			padding: 0.5rem 0;
		}

		.use_current_location_checkbox {
			width: 20rem;
			display: block;
			margin: 0;
		}

		.search_endorsements_by_address_input {
			width: 40rem;
			display: block;
		}
	}

	@media (max-width: 720px) {

		.search_endorsements_by_address_form {
			width: 100%;
		}

		.search_endorsement_fields {
			flex-direction: column;
		}

		.search_endorsements_by_address_input {
			width: 100%;
		}
	}

</style>