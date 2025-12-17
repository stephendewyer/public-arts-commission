<script lang="ts">
    import Checkbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { page } from '$app/state';
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
	import States from '$lib/data/states.titlecase.json';
	import { EndorsedAmendmentSelectedStore } from '$lib/stores/EndorsedAmendmentSelectedStore';
	import { EndorsedCandidateSelectedStore } from "$lib/stores/EndorsedCandidateSelectedStore";
	import { EndorsedLegislationSelectedStore } from '$lib/stores/EndorsedLegislationSelectedStore';
	import { EndorsedReferendumSelectedStore } from '$lib/stores/EndorsedReferendumSelectedStore';
    import { EndorsedAmendmentOpenStore } from '$lib/stores/EndorsedAmendmentOpenStore';
    import { EndorsedCandidateOpenStore } from "$lib/stores/EndorsedCandidateOpenStore";
    import { EndorsedLegislationOpenStore } from '$lib/stores/EndorsedLegislationOpenStore';
    import { EndorsedReferendumOpenStore } from '$lib/stores/EndorsedReferendumOpenStore';
	import GeolocationIcon from "$lib/images/icons/geolocation_icon.svg?raw";
	import FilterToggleButton from "$lib/components/buttons/FilterToggleButton.svelte";
	import NominateButton from "$lib/components/buttons/NominateButton.svelte";
	import SubmitButtonSecondary from "$lib/components/buttons/SubmitButtonSecondary.svelte";
	import { reverseHtmlEntities } from "$lib/utils/reverseHtmlEntities";
	import ArrowButton from '$lib/components/buttons/ArrowButton.svelte';

	export let data;

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

	let name: string = "";
	let yearInputValue: string = "";
	let searchByStreetAddressInputValue: string = "";
	let useCurrentLocationChecked: boolean = false;

	interface CurrentPages {
		currentPageCandidates: number;
		currentPageReferendums: number;
		currentPageLegislation: number;
		currentPageAmendments: number;
	};

	const currentPages: CurrentPages = {
		currentPageCandidates: 1,
		currentPageReferendums: 1,
		currentPageLegislation: 1,
		currentPageAmendments: 1
	};

	let activeEndorsementsTab: number = 0;

	$: activeEndorsementsTab = 0;

	// set the latitude and longitude with user's position.coords

	let reversedGeolocation: ReverseGeoLocation;

	// use the user's geolocation to get the user's address

	// after submit

	let addressLoadSuccess: boolean | null = null;

	let pendingReverseGeocode: boolean | null = null;

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
			// reset current pagination page for each category
			currentPages.currentPageAmendments = 1;
			currentPages.currentPageCandidates = 1;
			currentPages.currentPageLegislation = 1;
			currentPages.currentPageReferendums = 1;
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
			filteredEndorsedCandidates.federal = [];
			filteredEndorsedCandidates.state = [];
			filteredEndorsedCandidates.county = [];
			filteredEndorsedCandidates.city = [];

			filteredEndorsedLegislation.federal = [];
			filteredEndorsedLegislation.state = [];
			filteredEndorsedLegislation.county = [];
			filteredEndorsedLegislation.city = [];

			filteredEndorsedAmendments.federal = [];
			filteredEndorsedAmendments.state = [];
			filteredEndorsedAmendments.county = [];
			filteredEndorsedAmendments.city = [];

			filteredEndorsedReferendums.federal = [];
			filteredEndorsedReferendums.state = [];
			filteredEndorsedReferendums.county = [];
			filteredEndorsedReferendums.city = [];

			$searchEndorsedCandidatesStore.search = {
				year: yearInputValue.toString(),
				government_level: "federal",
				state: location.state,
				county: location.county,
				city: location.city,
				name: name
			};

			$searchEndorsedLegislationStore.search = {
				year: yearInputValue.toString(),
				government_level: "federal",
				state: location.state,
				county: location.county,
				city: location.city,
				name: name
			};

			$searchEndorsedAmendmentsStore.search = {
				year_election: yearInputValue.toString(),
				year_released: yearInputValue.toString(),
				government_level: "federal",
				state: location.state,
				county: location.county,
				city: location.city,
				name: name
			};

			$searchEndorsedReferendumsStore.search = {
				year: yearInputValue.toString(),
				government_level: "federal",
				state: location.state,
				county: location.county,
				city: location.city,
				name: name
			};

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
		name = "";
		navigator.geolocation.getCurrentPosition(success, error);
	};

	// if user activates the get current location checkbox AND after fetching data, set pending as true and find user location

	// else if user activates get current location checkbox AND address has not yet loaded and endorsement data has not loaded, set pending as true

	$: if (
		useCurrentLocationChecked && 
		getEndorsedCandidatesDataSuccess && 
		getEndorsedLegislationDataSuccess && 
		getEndorsedAmendmentsDataSuccess &&
		getEndorsedReferendumsDataSuccess
	) { 
		pendingReverseGeocode = true;
		findUserLocation();
	} else if (
		useCurrentLocationChecked && 
		addressLoadSuccess === null &&
		(
			!getEndorsedCandidatesDataSuccess || 
			!getEndorsedLegislationDataSuccess || 
			!getEndorsedAmendmentsDataSuccess ||
			!getEndorsedReferendumsDataSuccess
		)
	) {
		pendingReverseGeocode = true;
	};

	$: if (useCurrentLocationChecked) {
		findUserLocation();
	};

	// begin get endorsed candidates data from database

	interface FilteredEndorsedCandidates {
		federal: CandidateWithImage[];
		state: CandidateWithImage[];
		county: CandidateWithImage[];
		city: CandidateWithImage[];
	};

	const filteredEndorsedCandidates: FilteredEndorsedCandidates = {
		federal: [],
		state: [],
		county: [],
		city: []
	};

	let endorsedCandidates: CandidateWithImage[] = [];

	let searchEndorsedCandidates: SearchEndorsedCandidateWithImage[] = [];

	let pendingEndorsedCandidatesData: boolean | null = null;

	let getEndorsedCandidatesDataSuccess: boolean | null = null;

	async function getEndorsedCandidatesData() {

		pendingEndorsedCandidatesData = true;
		
		const response = await fetch("/api/getEndorsedCandidates");

		endorsedCandidates = await response.json();

		if (response.ok) {

			endorsedCandidates = endorsedCandidates.sort((a: any, b: any) => {
				let dateA: any = new Date(a.election_date_general);
				let dateB: any = new Date(b.election_date_general);

				return dateB - dateA;
			});

			searchEndorsedCandidates = endorsedCandidates.map((candidate: CandidateWithImage) => ({
				...candidate,
				searchTerms: {
					year: `${new Date(candidate.election_date_general).getFullYear()}`,
					government_level: `${reverseHtmlEntities(candidate.government_level)}`,
					state: `${reverseHtmlEntities(candidate.state)}`,
					county: `${reverseHtmlEntities(candidate.county)}`,
					city: `${reverseHtmlEntities(candidate.city)}`,
					name: `${reverseHtmlEntities(candidate.campaign_name)}`
				}
			}));
			pendingEndorsedCandidatesData = false;
			getEndorsedCandidatesDataSuccess = true;
		} else if (!response.ok) {
			pendingEndorsedCandidatesData = false;
			getEndorsedCandidatesDataSuccess = false;
		};

	};

	// begin get endorsed legislation data from database

	interface FilteredEndorsedLegislation {
		federal: LegislationWithSponsorsAndImage[];
		state: LegislationWithSponsorsAndImage[];
		county: LegislationWithSponsorsAndImage[];
		city: LegislationWithSponsorsAndImage[];
	};

	const filteredEndorsedLegislation: FilteredEndorsedLegislation = {
		federal: [],
		state: [],
		county: [],
		city: []
	};

	let endorsedLegislation: LegislationWithSponsorsAndImage[] = [];

	let searchEndorsedLegislation: SearchLegislationWithSponsorsAndImage[] = [];

	let pendingEndorsedLegislationData: boolean | null = null;

	let getEndorsedLegislationDataSuccess: boolean | null = null;

	async function getEndorsedLegislationData() {

		pendingEndorsedLegislationData = true;

		const response = await fetch("/api/getEndorsedLegislation");

		endorsedLegislation = await response.json();
		
		if (response.ok) {
			endorsedLegislation = endorsedLegislation.sort((a: number | any, b: number | any) => {
				let dateA: number = a.year_released;
				let dateB: number = b.year_released;

				return dateB - dateA;
			});

			searchEndorsedLegislation = endorsedLegislation.map((legislation: LegislationWithSponsorsAndImage) => ({
				...legislation,
				searchTerms: {
					year: `${legislation.year_released}`,
					government_level: `${reverseHtmlEntities(legislation.government_level)}`,
					state: `${reverseHtmlEntities(legislation.state)}`,
					county: `${reverseHtmlEntities(legislation.county)}`,
					city: `${reverseHtmlEntities(legislation.city)}`,
					name: `${reverseHtmlEntities(legislation.legislation_name)}`
				}
			}));
			pendingEndorsedLegislationData = false;
			getEndorsedLegislationDataSuccess = true;
		} else if (!response.ok) {
			pendingEndorsedLegislationData = false;
			getEndorsedCandidatesDataSuccess = false;
		};

	};

	// begin get endorsed amendments data from database

	interface FilteredEndorsedAmendments {
		federal: AmendmentWithSponsorsAndImage[];
		state: AmendmentWithSponsorsAndImage[];
		county: AmendmentWithSponsorsAndImage[];
		city: AmendmentWithSponsorsAndImage[];
	};

	const filteredEndorsedAmendments: FilteredEndorsedAmendments = {
		federal: [],
		state: [],
		county: [],
		city: []
	};

	let endorsedAmendments: AmendmentWithSponsorsAndImage[] = [];

	let searchEndorsedAmendments: SearchAmendmentWithSponsorsAndImage[] = [];

	let pendingEndorsedAmendmentsData: boolean | null = null;

	let getEndorsedAmendmentsDataSuccess: boolean | null = null;

	async function getEndorsedAmendmentsData() {

		pendingEndorsedAmendmentsData = true;

		const response = await fetch("/api/getEndorsedAmendments");

		endorsedAmendments = await response.json();

		if (response.ok) {

			endorsedAmendments = endorsedAmendments.sort((a: any, b: any) => {
				let dateA: any | number = a.year_released;
				let dateB: any | number = b.year_released;

				return dateB - dateA;
			});

			searchEndorsedAmendments = endorsedAmendments.map((amendment: AmendmentWithSponsorsAndImage) => ({
				...amendment,
				searchTerms: {
					year_election: `${amendment.election_date}`,
					year_released: `${amendment.year_released}`,
					government_level: `${reverseHtmlEntities(amendment.government_level)}`,
					state: `${reverseHtmlEntities(amendment.state)}`,
					county: `${reverseHtmlEntities(amendment.county)}`,
					city: `${reverseHtmlEntities(amendment.city)}`,
					name: `${reverseHtmlEntities(amendment.amendment_name)}`
				}
			}));
			pendingEndorsedAmendmentsData = false;
			getEndorsedAmendmentsDataSuccess = true;
		} else if (!response.ok) {
			pendingEndorsedAmendmentsData = false;
			getEndorsedAmendmentsDataSuccess = false;
		};

	};
	
	// begin get endorsed referendums data from database

	interface FilteredEndorsedReferendums {
		federal: ReferendumWithImage[];
		state: ReferendumWithImage[];
		county: ReferendumWithImage[];
		city: ReferendumWithImage[];
	};

	const filteredEndorsedReferendums: FilteredEndorsedReferendums = {
		federal: [],
		state: [],
		county: [],
		city: []
	};

	let endorsedReferendums: ReferendumWithImage[] = [];

	let searchEndorsedReferendums: SearchReferendumWithImage[] = [];

	let pendingEndorsedReferendumsData: boolean | null = null;

	let getEndorsedReferendumsDataSuccess: boolean | null = null;

	async function getEndorsedReferendums() {

		pendingEndorsedReferendumsData = true;

		const response = await fetch("/api/getEndorsedReferendums");

		let endorsedReferendums = await response.json();

		// order referendums by most recent election_data

		if (response.ok) {

			endorsedReferendums = endorsedReferendums.sort((a: any, b: any) => {
				let dateA: any = new Date(a.election_date);
				let dateB: any = new Date(b.election_date);

				return dateB - dateA;
			});

			searchEndorsedReferendums = endorsedReferendums.map((referendum: ReferendumWithImage) => ({
				...referendum,
				searchTerms: {
					year: `${new Date(referendum.election_date).getFullYear()}`,
					government_level: `${reverseHtmlEntities(referendum.government_level)}`,
					state: `${reverseHtmlEntities(referendum.state)}`,
					county: `${reverseHtmlEntities(referendum.county)}`,
					city: `${reverseHtmlEntities(referendum.city)}`,
					name: `${reverseHtmlEntities(referendum.referendum_name)}`
				}
			}));
			pendingEndorsedReferendumsData = false;
			getEndorsedReferendumsDataSuccess = true;
		} else if (!response.ok) {
			pendingEndorsedReferendumsData = false;
			getEndorsedReferendumsDataSuccess = false;
		};

	};

	// handle changes to searchbar input value

	let statesWithCity: string[] = [];

	const searchByStreetAddressInputValueChangeHandler = () => {

		// reset current pagination page for each category
		currentPages.currentPageAmendments = 1;
		currentPages.currentPageCandidates = 1;
		currentPages.currentPageLegislation = 1;
		currentPages.currentPageReferendums = 1;

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
		name = "";

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

		let searchBarFirstPhrase: string | number = searchByStreetAddressInputValue.split(",")[0]
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

				// use civic data API to get representative districts or wards in federal, state and city levels

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
					searchBarFirstPhrase.toLowerCase() !== stateName &&
					searchBarInputValueFirstWord.toLowerCase() !== stateAbbreviation &&
					searchBarInputValueFirstWord.toLowerCase() !== stateValueFirstWord && 
					!searchByStreetAddressInputValue.includes(",") &&
				(
						searchBarInputValueFirstWord.toLowerCase() !== cityValueFirstWord.toLowerCase() ||
						searchBarInputValueArray.length >= 2

					)
				) {
					
					name = searchByStreetAddressInputValue.toLowerCase();
					
				};                

			};

		} else {

			location.country = "";
			location.zipcode = "";
			location.state = "";
			location.city = "";
			location.street= "";
			location.streetNumber = "";
			location.county = "";
			name = "";
			stateValueArray = [];
			stateValueFirstWord = "";
			cityValueArray = [];
			cityValueFirstWord = "";
			countyValueArray = [];
			countyValueFirstWord = "";

		};

		// update the search filter stores
		// update the candidate search filter store
		// clear categories data

		filteredEndorsedCandidates.federal = [];
		filteredEndorsedCandidates.state = [];
		filteredEndorsedCandidates.county = [];
		filteredEndorsedCandidates.city = [];

		filteredEndorsedLegislation.federal = [];
		filteredEndorsedLegislation.state = [];
		filteredEndorsedLegislation.county = [];
		filteredEndorsedLegislation.city = [];

		filteredEndorsedAmendments.federal = [];
		filteredEndorsedAmendments.state = [];
		filteredEndorsedAmendments.county = [];
		filteredEndorsedAmendments.city = [];

		filteredEndorsedReferendums.federal = [];
		filteredEndorsedReferendums.state = [];
		filteredEndorsedReferendums.county = [];
		filteredEndorsedReferendums.city = [];

		$searchEndorsedCandidatesStore.search = {
			year: yearInputValue.toString(),
			government_level: "federal",
			state: location.state,
			county: location.county,
			city: location.city,
			name: name
		};

		$searchEndorsedLegislationStore.search = {
			year: yearInputValue.toString(),
			government_level: "federal",
			state: location.state,
			county: location.county,
			city: location.city,
			name: name
		};

		$searchEndorsedAmendmentsStore.search = {
			year_election: yearInputValue.toString(),
			year_released: yearInputValue.toString(),
			government_level: "federal",
			state: location.state,
			county: location.county,
			city: location.city,
			name: name
		};

		$searchEndorsedReferendumsStore.search = {
			year: yearInputValue.toString(),
			government_level: "federal",
			state: location.state,
			county: location.county,
			city: location.city,
			name: name
		};

	};

	// if option is selected, run filters

	let searchbarOptionSelected: boolean = false;

	$: if (searchbarOptionSelected) {
		searchByStreetAddressInputValueChangeHandler();
		searchbarOptionSelected = false;
	};

	// use onMount to get data from params after page is prerendered and to get data from database for endorsed candidates, legislation, amendments and referendums

	const HandleOpenSidedrawer = () => {
		
		if (page.url.search) {

			let searchParams: URLSearchParams;

			searchParams = new URLSearchParams(page.url.search);

			let searchAddress: string | null = null;

			if (
				searchParams.get("current_address_checked") === "true" && 
				!searchParams.get("address")
			) {
				useCurrentLocationChecked = true;
			} else if (
				searchParams.get("current_address_checked") === "true" && 
				searchParams.get("address")
			) {
				searchAddress = searchParams.get("address");
				if (searchAddress !== null) {
					// filter results by address
					searchByStreetAddressInputValue = searchAddress.replace(/_/g, ' ');
				};
			} else if (searchParams.get("candidate_ID") !== null) {

				const candidateID: string | null = searchParams.get("candidate_ID");

				endorsedCandidates.filter((candidate, i) => {

					if (candidate.candidate_ID.toString() === candidateID) {

						$EndorsedCandidateSelectedStore = candidate;
						$EndorsedCandidateOpenStore = true;

					};

				});

			} else if (searchParams.get("legislation_ID") !== null) {

				const legislationID: string | null = searchParams.get("legislation_ID");
				
				endorsedLegislation.filter((legislation, i) => {

					if (legislation.legislation_ID.toString() === legislationID) {

						$EndorsedLegislationSelectedStore = legislation;
						$EndorsedLegislationOpenStore = true;

					};

				});

			} else if (searchParams.get("referendum_ID") !== null) {

				const referendumID: string | null = searchParams.get("referendum_ID");

				searchEndorsedReferendums.filter((referendum, i) => {

					if (referendum.referendum_ID.toString() === referendumID) {

						$EndorsedReferendumSelectedStore = referendum;
						$EndorsedReferendumOpenStore = true;

					};

				});

			} else if (searchParams.get("amendment_ID") !== null) {

				const amendmentID: string | null = searchParams.get("amendment_ID");

				endorsedAmendments.filter((amendment, i) => {

					if (amendment.amendment_ID.toString() === amendmentID) {

						$EndorsedAmendmentSelectedStore = amendment;
						$EndorsedAmendmentOpenStore = true;

					};

				});

			};
		};
	};

	afterUpdate(() => {
		HandleOpenSidedrawer();
	});

	let componentDidMount: boolean = false;

    onMount(() => {
		getEndorsedReferendums();
		getEndorsedCandidatesData();
		getEndorsedLegislationData();
		getEndorsedAmendmentsData();
		componentDidMount = true;
    });

	// handle location input search data present on page mount

	$: if (
		componentDidMount && 
		searchByStreetAddressInputValue && 
		!useCurrentLocationChecked && 
		getEndorsedReferendumsDataSuccess && 
		getEndorsedAmendmentsDataSuccess &&
		getEndorsedCandidatesDataSuccess &&
		getEndorsedLegislationDataSuccess
	) {
		searchByStreetAddressInputValueChangeHandler();
		componentDidMount = false;
	};

	const selectYearInputValueChangeHandler = () => {

		// reset current pagination page for each category
		currentPages.currentPageAmendments = 1;
		currentPages.currentPageCandidates = 1;
		currentPages.currentPageLegislation = 1;
		currentPages.currentPageReferendums = 1;

		// update the search filter stores

		filteredEndorsedCandidates.federal = [];
		filteredEndorsedCandidates.state = [];
		filteredEndorsedCandidates.county = [];
		filteredEndorsedCandidates.city = [];

		filteredEndorsedLegislation.federal = [];
		filteredEndorsedLegislation.state = [];
		filteredEndorsedLegislation.county = [];
		filteredEndorsedLegislation.city = [];

		filteredEndorsedAmendments.federal = [];
		filteredEndorsedAmendments.state = [];
		filteredEndorsedAmendments.county = [];
		filteredEndorsedAmendments.city = [];

		filteredEndorsedReferendums.federal = [];
		filteredEndorsedReferendums.state = [];
		filteredEndorsedReferendums.county = [];
		filteredEndorsedReferendums.city = [];

		$searchEndorsedCandidatesStore.search = {
			year: yearInputValue.toString(),
			government_level: "federal",
			state: location.state,
			county: location.county,
			city: location.city,
			name: name
		};

		$searchEndorsedLegislationStore.search = {
			year: yearInputValue.toString(),
			government_level: "federal",
			state: location.state,
			county: location.county,
			city: location.city,
			name: name
		};

		$searchEndorsedAmendmentsStore.search = {
			year_election: yearInputValue.toString(),
			year_released: yearInputValue.toString(),
			government_level: "federal",
			state: location.state,
			county: location.county,
			city: location.city,
			name: name
		};

		$searchEndorsedReferendumsStore.search = {
			year: yearInputValue.toString(),
			government_level: "federal",
			state: location.state,
			county: location.county,
			city: location.city,
			name: name
		};

	};

	// use the parsed address from seach by address input to filter endorsed candidates 

	$: searchEndorsedCandidatesStore = createEndorsedCandidatesSearchStore(searchEndorsedCandidates);

	$: unsubscribeSearchEndorsedCandidatesStore = searchEndorsedCandidatesStore.subscribe((model) => {
		searchEndorsedCandidatesHandler(model);
	});

	$: $searchEndorsedCandidatesStore.filtered.forEach((candidate: CandidateWithImage) => {
		if (candidate.government_level === "federal") {
			filteredEndorsedCandidates.federal = [...filteredEndorsedCandidates.federal, candidate];
		} else if (candidate.government_level === "state") {
			filteredEndorsedCandidates.state = [...filteredEndorsedCandidates.state, candidate];
		} else if (candidate.government_level === "county") {
			filteredEndorsedCandidates.county = [...filteredEndorsedCandidates.county, candidate];
		} else if (candidate.government_level === "city") {
			filteredEndorsedCandidates.city = [...filteredEndorsedCandidates.city, candidate];
		};
	});

	// use the parsed address from seach by address input to filter endorsed legislation 

	$: searchEndorsedLegislationStore = createEndorsedLegislationSearchStore(searchEndorsedLegislation);

	$: unsubscribeSearchEndorsedLegislationStore = searchEndorsedLegislationStore.subscribe((model) => {
		searchEndorsedLegislationHandler(model);
	});

	$: $searchEndorsedLegislationStore.filtered.forEach((legislation: LegislationWithSponsorsAndImage) => {
		if (legislation.government_level === "federal") {
			filteredEndorsedLegislation.federal = [...filteredEndorsedLegislation.federal, legislation];
		} else if (legislation.government_level === "state") {
			filteredEndorsedLegislation.state = [...filteredEndorsedLegislation.state, legislation];
		} else if (legislation.government_level === "county") {
			filteredEndorsedLegislation.county = [...filteredEndorsedLegislation.county, legislation];
		} else if (legislation.government_level === "city") {
			filteredEndorsedLegislation.city = [...filteredEndorsedLegislation.city, legislation];

		};
	});

	// use the parsed address from seach by address input to filter endorsed amendments 

	$: searchEndorsedAmendmentsStore = createEndorsedAmendmentsSearchStore(searchEndorsedAmendments);

	$: unsubscribeSearchEndorsedAmendmentsStore = searchEndorsedAmendmentsStore.subscribe((model) => {

		searchEndorsedAmendmentsHandler(model)

	});

	$: $searchEndorsedAmendmentsStore.filtered.forEach((amendment: AmendmentWithSponsorsAndImage) => {
		if (amendment.government_level === "federal") {
			filteredEndorsedAmendments.federal = [...filteredEndorsedAmendments.federal, amendment];
		} else if (amendment.government_level === "state") {
			filteredEndorsedAmendments.state = [...filteredEndorsedAmendments.state, amendment]
		} else if (amendment.government_level === "county") {
			filteredEndorsedAmendments.county = [...filteredEndorsedAmendments.county, amendment]
		} else if (amendment.government_level === "city") {
			filteredEndorsedAmendments.city = [...filteredEndorsedAmendments.city, amendment]
		};
	});

	// use the parsed address from seach by address input to filter endorsed referendums 

	$: searchEndorsedReferendumsStore = createEndorsedReferendumsSearchStore(searchEndorsedReferendums);

	$: unsubscribeSearchEndorsedReferendumsStore = searchEndorsedReferendumsStore.subscribe((model) => {

		searchEndorsedReferendumsHandler(model);

	});

	$: $searchEndorsedReferendumsStore.filtered.forEach((referendum: ReferendumWithImage) => {
		if (referendum.government_level === "federal") {
			filteredEndorsedReferendums.federal = [...filteredEndorsedReferendums.federal, referendum];
		} else if (referendum.government_level === "state") {
			filteredEndorsedReferendums.state = [...filteredEndorsedReferendums.state, referendum];
		} else if (referendum.government_level === "county") {
			filteredEndorsedReferendums.county = [...filteredEndorsedReferendums.county, referendum];
		} else if (referendum.government_level === "city") {
			filteredEndorsedReferendums.city = [...filteredEndorsedReferendums.city, referendum];
		};
	});

	onDestroy(() => {
		unsubscribeSearchEndorsedCandidatesStore();
		unsubscribeSearchEndorsedLegislationStore();
		unsubscribeSearchEndorsedAmendmentsStore();
		unsubscribeSearchEndorsedReferendumsStore();
	});


	let endorsementPanelData: Endorsements;

	$: endorsementPanelData = {
		user: data.streamed.user,
		currentPageCandidates: currentPages.currentPageCandidates,
		currentPageAmendments: currentPages.currentPageAmendments,
		currentPageReferendums: currentPages.currentPageReferendums,
		currentPageLegislation: currentPages.currentPageLegislation,
		endorsed_amendments: $searchEndorsedAmendmentsStore.filtered, 
		endorsed_candidates: $searchEndorsedCandidatesStore.filtered,
		endorsed_legislation: $searchEndorsedLegislationStore.filtered,
		endorsed_referendums: $searchEndorsedReferendumsStore.filtered,
		pendingEndorsedCandidatesData: pendingEndorsedCandidatesData,
		pendingEndorsedLegislationData: pendingEndorsedLegislationData,
		pendingEndorsedReferendumsData: pendingEndorsedReferendumsData,
		pendingEndorsedAmendmentsData: pendingEndorsedAmendmentsData,
		getEndorsedCandidatesDataSuccess: getEndorsedCandidatesDataSuccess,
		getEndorsedLegislationDataSuccess: getEndorsedLegislationDataSuccess,
		getEndorsedReferendumsDataSuccess: getEndorsedReferendumsDataSuccess,
		getEndorsedAmendmentsDataSuccess: getEndorsedAmendmentsDataSuccess
	};

	let endorsementFederalPanelData: Endorsements;

	$: endorsementFederalPanelData = {
		user: data.streamed.user,
		currentPageCandidates: currentPages.currentPageCandidates,
		currentPageAmendments: currentPages.currentPageAmendments,
		currentPageReferendums: currentPages.currentPageReferendums,
		currentPageLegislation: currentPages.currentPageLegislation,
		endorsed_amendments: filteredEndorsedAmendments.federal, 
		endorsed_candidates: filteredEndorsedCandidates.federal,
		endorsed_legislation: filteredEndorsedLegislation.federal,
		endorsed_referendums: filteredEndorsedReferendums.federal,
		pendingEndorsedCandidatesData: pendingEndorsedCandidatesData,
		pendingEndorsedLegislationData: pendingEndorsedLegislationData,
		pendingEndorsedReferendumsData: pendingEndorsedReferendumsData,
		pendingEndorsedAmendmentsData: pendingEndorsedAmendmentsData,
		getEndorsedCandidatesDataSuccess: getEndorsedCandidatesDataSuccess,
		getEndorsedLegislationDataSuccess: getEndorsedLegislationDataSuccess,
		getEndorsedReferendumsDataSuccess: getEndorsedReferendumsDataSuccess,
		getEndorsedAmendmentsDataSuccess: getEndorsedAmendmentsDataSuccess
	};

	let endorsementStatePanelData: Endorsements;

	$: endorsementStatePanelData = {
		user: data.streamed.user,
		currentPageCandidates: currentPages.currentPageCandidates,
		currentPageAmendments: currentPages.currentPageAmendments,
		currentPageReferendums: currentPages.currentPageReferendums,
		currentPageLegislation: currentPages.currentPageLegislation,
		endorsed_amendments: filteredEndorsedAmendments.state, 
		endorsed_candidates: filteredEndorsedCandidates.state,
		endorsed_legislation: filteredEndorsedLegislation.state,
		endorsed_referendums: filteredEndorsedReferendums.state,
		pendingEndorsedCandidatesData: pendingEndorsedCandidatesData,
		pendingEndorsedLegislationData: pendingEndorsedLegislationData,
		pendingEndorsedReferendumsData: pendingEndorsedReferendumsData,
		pendingEndorsedAmendmentsData: pendingEndorsedAmendmentsData,
		getEndorsedCandidatesDataSuccess: getEndorsedCandidatesDataSuccess,
		getEndorsedLegislationDataSuccess: getEndorsedLegislationDataSuccess,
		getEndorsedReferendumsDataSuccess: getEndorsedReferendumsDataSuccess,
		getEndorsedAmendmentsDataSuccess: getEndorsedAmendmentsDataSuccess
	};

	let endorsementCountyPanelData: Endorsements;

	$: endorsementCountyPanelData = {
		user: data.streamed.user,
		currentPageCandidates: currentPages.currentPageCandidates,
		currentPageAmendments: currentPages.currentPageAmendments,
		currentPageReferendums: currentPages.currentPageReferendums,
		currentPageLegislation: currentPages.currentPageLegislation,
		endorsed_amendments: filteredEndorsedAmendments.county, 
		endorsed_candidates: filteredEndorsedCandidates.county,
		endorsed_legislation: filteredEndorsedLegislation.county,
		endorsed_referendums: filteredEndorsedReferendums.county,
		pendingEndorsedCandidatesData: pendingEndorsedCandidatesData,
		pendingEndorsedLegislationData: pendingEndorsedLegislationData,
		pendingEndorsedReferendumsData: pendingEndorsedReferendumsData,
		pendingEndorsedAmendmentsData: pendingEndorsedAmendmentsData,
		getEndorsedCandidatesDataSuccess: getEndorsedCandidatesDataSuccess,
		getEndorsedLegislationDataSuccess: getEndorsedLegislationDataSuccess,
		getEndorsedReferendumsDataSuccess: getEndorsedReferendumsDataSuccess,
		getEndorsedAmendmentsDataSuccess: getEndorsedAmendmentsDataSuccess
	};
	
	let endorsementCityPanelData: Endorsements;

	$: endorsementCityPanelData = {
		user: data.streamed.user,
		currentPageCandidates: currentPages.currentPageCandidates,
		currentPageAmendments: currentPages.currentPageAmendments,
		currentPageReferendums: currentPages.currentPageReferendums,
		currentPageLegislation: currentPages.currentPageLegislation,
		endorsed_amendments: filteredEndorsedAmendments.city, 
		endorsed_candidates: filteredEndorsedCandidates.city,
		endorsed_legislation: filteredEndorsedLegislation.city,
		endorsed_referendums: filteredEndorsedReferendums.city,
		pendingEndorsedCandidatesData: pendingEndorsedCandidatesData,
		pendingEndorsedLegislationData: pendingEndorsedLegislationData,
		pendingEndorsedReferendumsData: pendingEndorsedReferendumsData,
		pendingEndorsedAmendmentsData: pendingEndorsedAmendmentsData,
		getEndorsedCandidatesDataSuccess: getEndorsedCandidatesDataSuccess,
		getEndorsedLegislationDataSuccess: getEndorsedLegislationDataSuccess,
		getEndorsedReferendumsDataSuccess: getEndorsedReferendumsDataSuccess,
		getEndorsedAmendmentsDataSuccess: getEndorsedAmendmentsDataSuccess
	};

	let endorsementTabPanels: tabPanels[] = [];
	
	$: endorsementTabPanels = [
		{
			id: uuidv4(),
			index: 0,
			label: "all",
			hasCapitol: true,
			panel: AllEndorsementPanel,
			data: endorsementPanelData,
		},
		{
			id: uuidv4(),
			index: 1,
			label: "federal",
			hasCapitol: true,
			panel: FederalEndorsementsPanel,
			data: endorsementFederalPanelData,
		},
		{
			id: uuidv4(),
			index: 2,
			label: "state",
			hasCapitol: true,
			panel: StateEndorsementsPanel,
			data: endorsementStatePanelData,
		},
		{
			id: uuidv4(),
			index: 3,
			label: "county",
			hasCapitol: true,
			panel: CountyEndorsementsPanel,
			data: endorsementCountyPanelData,
		},
		{
			id: uuidv4(),
			index: 4,
			label: "city",
			hasCapitol: true,
			panel: CityEndorsementsPanel,
			data: endorsementCityPanelData,
		},
	];

	let openFilters: boolean = true;

	let searchHeight: number = 0;

	// innerWidth is the width of the inner window
	let innerWidth: number = 0;

	let clearFiltersClicked: boolean = false;

	$: if (clearFiltersClicked) {
		useCurrentLocationChecked = false;
		searchByStreetAddressInputValue = "";
		yearInputValue = "";
		selectYearInputValueChangeHandler();
		searchByStreetAddressInputValueChangeHandler();
		currentPages.currentPageCandidates = 1;
		currentPages.currentPageReferendums = 1;
		currentPages.currentPageLegislation = 1;
		currentPages.currentPageAmendments = 1;
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

	let endorsementsHeadingElement: HTMLElement;

	let endorsementsHeadingTopPosition: number = 0;

    onMount(() => {
		if (innerWidth <= 720 && !useCurrentLocationChecked) {
			openFilters = false;
		};
		endorsementsHeadingTopPosition = endorsementsHeadingElement.getBoundingClientRect().top + window.scrollY;
		resultsBottomPosition = resultsElement.getBoundingClientRect().bottom + window.scrollY;
		nominateButtonAbsolutePosition = resultsBottomPosition - nominateButtonContainerElement.clientHeight;
		searchContainerTopPosition = searchContainerElement?.getBoundingClientRect().top + window.scrollY;
        currentEndorsementTabsStickyPosition = endorsementsNav?.getBoundingClientRect().top + window.scrollY;
		mobileScrollableSearchHeight =  innerHeight - searchContainerElement?.getBoundingClientRect().top - clearFiltersButtonHeight;
    });

	const windowResizeHandler = () => {
		endorsementsHeadingTopPosition = endorsementsHeadingElement.getBoundingClientRect().top + window.scrollY;
		resultsBottomPosition = resultsElement.getBoundingClientRect().bottom + window.scrollY;
		nominateButtonAbsolutePosition = resultsBottomPosition - nominateButtonContainerElement.clientHeight;		
		searchContainerTopPosition = searchContainerElement?.getBoundingClientRect().top + window.scrollY;
		currentEndorsementTabsStickyPosition = endorsementsHeadingElement?.getBoundingClientRect().bottom + window.scrollY;
	};

	afterUpdate(() =>  {
		if (window.scrollY + innerHeight >= resultsBottomPosition) {
				nominateButtonAbsolute = true;
			} else {
				nominateButtonAbsolute = false;
			};
		endorsementsHeadingTopPosition = endorsementsHeadingElement.getBoundingClientRect().top + window.scrollY;
		resultsBottomPosition = resultsElement.getBoundingClientRect().bottom + window.scrollY;
		nominateButtonAbsolutePosition = resultsBottomPosition - nominateButtonContainerElement.clientHeight;
		mobileScrollableSearchHeight =  innerHeight - searchContainerElement?.getBoundingClientRect().top - clearFiltersButtonHeight;
		searchAbsolutePosition = searchContainerElement?.getBoundingClientRect().top + window.scrollY + (searchContainerHeight - searchHeight- endorsementNavHeight);
		searchContainerTopPosition = searchContainerElement?.getBoundingClientRect().top + window.scrollY;
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
		}
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
			}
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
			}
			if (window.scrollY + innerHeight >= resultsBottomPosition) {
				nominateButtonAbsolute = true;
			} else {
				nominateButtonAbsolute = false;
			}
		}
	}

	const handleScroll = () => {
		if (endorsementResultsHeight > (scrollableSearchHeight + clearFiltersButtonHeight)) {
			if (window.scrollY + innerHeight >= resultsBottomPosition) {
				nominateButtonAbsolute = true;
			} else {
				nominateButtonAbsolute = false;
			};
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
	<title>endorsements - public arts commission</title>
	<meta name="description" content="find public arts commission-endorsed candidates, legislation, referendums and amendments" />
	<meta property="og:image" content={PublicArtsCommissionBanner} 
/>

</svelte:head>
<svelte:window 
	bind:innerHeight
	bind:innerWidth 
	bind:scrollY={y} 
	on:resize={windowResizeHandler}
	on:scroll={handleScroll}
/>
<section class="page">
	<h1 bind:this={endorsementsHeadingElement}>
		endorsements
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
							<div class="search_endorsements_input_container">
								{#if useCurrentLocationChecked}
									{#if pendingReverseGeocode}
										<LoaderAnimation />
									{:else if addressLoadSuccess}
										<SearchInput 
											placeholder="campaign name | 1000 MyStreet, MyCity, MyState  10000 | City, State | State | 10000"
											inputID="address"
											inputName="address"
											inputLabel={true}
											bind:searchInputValue={searchByStreetAddressInputValue}
											searchInputValueChange={() => searchByStreetAddressInputValueChangeHandler()}
											options={statesWithCity}
											bind:optionSelected={searchbarOptionSelected}
										>
											name, street address, city, state or zip code
										</SearchInput>
									{:else if !addressLoadSuccess}
										<p>failed to load address</p>
									{/if}
								{:else}
									<SearchInput 
										placeholder="campaign name | 1000 MyStreet, MyCity, MyState  10000 | City, State | State | 10000"
										inputID="address"
										inputName="address"
										inputLabel={true}
										bind:searchInputValue={searchByStreetAddressInputValue}
										searchInputValueChange={() => searchByStreetAddressInputValueChangeHandler()}
										options={statesWithCity}
										bind:optionSelected={searchbarOptionSelected}
									>
										name, street address, city, state or zip code
									</SearchInput>
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
						<div class="search_endorsements_input_container">
							{#if useCurrentLocationChecked}
								{#if pendingReverseGeocode}
									<LoaderAnimation />
								{:else if addressLoadSuccess}
									<SearchInput 
										placeholder="campaign name | 1000 MyStreet, MyCity, MyState  10000 | City, State | State | 10000"
										inputID="address"
										inputName="address"
										inputLabel={true}
										bind:searchInputValue={searchByStreetAddressInputValue}
										searchInputValueChange={() => searchByStreetAddressInputValueChangeHandler()}
										options={statesWithCity}
										bind:optionSelected={searchbarOptionSelected}
									>
										name, street address, city, state or zip code
									</SearchInput>
								{:else if !addressLoadSuccess}
									<p>failed to load address</p>
								{/if}
							{:else}
								<SearchInput 
									placeholder="campaign name | 1000 MyStreet, MyCity, MyState  10000 | City, State | State | 10000"
									inputID="address"
									inputName="address"
									inputLabel={true}
									bind:searchInputValue={searchByStreetAddressInputValue}
									searchInputValueChange={() => searchByStreetAddressInputValueChangeHandler()}
									options={statesWithCity}
									bind:optionSelected={searchbarOptionSelected}
								>
									name, street address, city, state or zip code
								</SearchInput>
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
		<div class="results_container" >
			<div 
				bind:clientHeight={endorsementResultsHeight}
				bind:this={resultsElement}
				class="results"
			>
				<TabPanel
					bind:tabPanels={endorsementTabPanels} 
					bind:activeTab={activeEndorsementsTab}
					endorsementNavHeight={endorsementNavHeight}
				/>	
			</div>
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
			category="amendment"
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
		position: relative;
		width: 100%;
	}

	.results {
		position: relative;
		width: 100%;
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