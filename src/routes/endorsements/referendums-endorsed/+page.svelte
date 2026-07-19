<script lang="ts">
    import Checkbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Tabs from '$lib/components/tabPanels/endorsementTabPanels/EndorsementsTabs.svelte';
	import Panel from "$lib/components/tabPanels/endorsementTabPanels/EndorsementsPanel.svelte";
    import { v4 as uuidv4 } from 'uuid';
	import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
	import Years from '$lib/data/years.json';
	import SelectSearchInput from '$lib/components/inputs/SelectSearchInput.svelte';;
	import { parse } from "@universe/address-parser";
	import USCities from '$lib/data/USCities.json';
	import { createEndorsedReferendumsSearchStore } from '$lib/stores/EndorsedReferendumsSearchStore.js';
	import LoaderAnimation from '$lib/components/loaders/LoaderAnimation.svelte';
	import States from '$lib/data/states.titlecase.json';
	import { EndorsedReferendumSelectedStore } from '$lib/stores/EndorsedReferendumSelectedStore';
    import { EndorsedReferendumOpenStore } from '$lib/stores/EndorsedReferendumOpenStore';
	import GeolocationIcon from "$lib/images/icons/geolocation_icon.svg?raw";
	import FilterToggleButton from "$lib/components/buttons/FilterToggleButton.svelte";
	import NominateButton from "$lib/components/buttons/NominateButton.svelte";
	import SubmitButtonSecondary from "$lib/components/buttons/SubmitButtonSecondary.svelte";
	import { reverseHtmlEntities } from "$lib/utils/reverseHtmlEntities";
	import ArrowButton from '$lib/components/buttons/ArrowButton.svelte';
    import { SearchEndorsementsByStreetAddressFilter } from '$lib/utils/SearchEndorsementsByStreetAddressFilter.js';

	let { data } = $props();

	const endorsementsType: string = "referendums";

    // get the endorsed referendums

	let endorsedReferendums = $state<ReferendumWithImage[]>([]);

	let pendingEndorsedReferendumsData: boolean | null = $state(null);

	let getEndorsedReferendumsDataSuccess: boolean | null = $state(null);

	async function getEndorsedReferendums() {

		pendingEndorsedReferendumsData = true;

		const response = await fetch("/api/getEndorsedReferendums");

		endorsedReferendums = await response.json();

		// order referendums by most recent election_data

		if (response.ok) {
			endorsedReferendums.sort((a: any, b: any) => {
				let dateA: any = new Date(a.election_date);
				let dateB: any = new Date(b.election_date);

				return dateB - dateA;
			});
			pendingEndorsedReferendumsData = false;
			getEndorsedReferendumsDataSuccess = true;
		} else if (!response.ok) {
			pendingEndorsedReferendumsData = false;
			getEndorsedReferendumsDataSuccess = false;
		};

	};

    onMount(() => {
		getEndorsedReferendums();
    });

    // handle open sidedrawer 

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
			} else if (searchParams.get("referendum_ID") !== null) {

				const referendumID: string | null = searchParams.get("referendum_ID");

				searchEndorsedReferendums.filter((referendum, i) => {

					if (referendum.referendum_ID.toString() === referendumID) {

						$EndorsedReferendumSelectedStore = referendum;
						$EndorsedReferendumOpenStore = true;

					};

				});

			};
		};
	};

	$effect(() => {
		HandleOpenSidedrawer();
	});

    const searchEndorsedReferendums: SearchReferendumWithImage[] = $derived.by(() => {

        return endorsedReferendums.map((referendum: ReferendumWithImage) => {

            let status: string = "";

            if (referendum.elected === 1) {

                status = " elected by voters";

            } else if (new Date(referendum.election_date) >= new Date()) {

                status = "pending election by voters";
            
            };

            return {
                ...referendum,
                searchTerms: {
                    year: `${new Date(referendum.election_date).getFullYear()}`,
                    election_date: `${new Date(referendum.election_date)}`,
                    government_level: `${reverseHtmlEntities(referendum.government_level)}`,
                    state: `${reverseHtmlEntities(referendum.state)}`,
                    county: `${reverseHtmlEntities(referendum.county)}`,
                    city: `${reverseHtmlEntities(referendum.city)}`,
                    name: `${reverseHtmlEntities(referendum.referendum_name)}`,
                    status: status
                }
            };
        
        });

    });

    // create the endorsedReferendumsSearchStore

    const endorsedReferendumsSearchStore = createEndorsedReferendumsSearchStore();

    // filter endorsedReferendumsSearchStore data using createEndorsedReferendumsSearchStore

    interface FilteredEndorsedReferendums {
        all: SearchReferendumWithImage[];
		federal: SearchReferendumWithImage[];
		state: SearchReferendumWithImage[];
		county: SearchReferendumWithImage[];
		city: SearchReferendumWithImage[];
	};

    const filteredEndorsedReferendums: FilteredEndorsedReferendums = $derived.by(() => {

        const filteredreferendums: SearchReferendumWithImage[] =  searchEndorsedReferendums.filter((referendum) => {

            const searchYear = $endorsedReferendumsSearchStore.year.toString();

            // if search by year is empty, continue with search by street address

            if (searchYear === "") {

                return SearchEndorsementsByStreetAddressFilter($endorsedReferendumsSearchStore, referendum);

            // else if search year matches item searchTerm year, continue with filters

            } else if (referendum.searchTerms.year === searchYear) {

                return SearchEndorsementsByStreetAddressFilter($endorsedReferendumsSearchStore, referendum);

            } else {

                return;

            };

        });

        // sort the referendums by government level

        let all: SearchReferendumWithImage[] = [];
        let federal: SearchReferendumWithImage[] = [];
        let state: SearchReferendumWithImage[] = [];
        let county: SearchReferendumWithImage[] = [];
        let city: SearchReferendumWithImage[] = [];

        filteredreferendums.forEach((referendum: SearchReferendumWithImage) => {
            all = [...all, referendum];

            if (referendum.government_level === "federal") {
                federal = [...federal, referendum];
            } else if (referendum.government_level === "state") {
                state = [...state, referendum];
            } else if (referendum.government_level === "county") {
                county = [...county, referendum];
            } else if (referendum.government_level === "city") {
                city = [...city, referendum];
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

    onMount(() => {

        // handle location input search data present on page mount

        if (
            searchByStreetAddressInputValue && 
            !useCurrentLocationChecked && 
            getEndorsedReferendumsDataSuccess
        ) {
            // searchByStreetAddressInputValueChangeHandler();
        };

        // handle open side drawer on page mount

        if (
            !searchByStreetAddressInputValue && 
            !useCurrentLocationChecked && 
            getEndorsedReferendumsDataSuccess
        ) {
            HandleOpenSidedrawer();
        };

    });

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

	let name: string = $state("");
	let yearInputValue: string = $state("");
    // let pendingElectionChecked: boolean = $state(false);
    // let electedByVotersChecked: boolean = $state(false);

	let searchByStreetAddressInputValue: string = $state("");
	let useCurrentLocationChecked: boolean = $state(false);

    let currentPage: number = $state(1);

	let activeEndorsementsTab: number = $state(0);

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


	const getUSCongressionalDistrict = async (latitude: number | null, longitude: number | null) => {
		pendingUSCongressionalDistrict = true;
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
			getUSCongressionalDistrictResponse = await response.json();
			if (getUSCongressionalDistrictResponse.success) {
				location.USCongressionalDistrict = getUSCongressionalDistrictResponse.success.USCongressional;
				location.StateHouseDistrict = getUSCongressionalDistrictResponse.success.stateHouse;
				location.StateSenateDistrict = getUSCongressionalDistrictResponse.success.stateSenate;
			};	
		} catch(error) {
			console.log(error);
		};
	};

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
			currentPage = 1;
			
			// show the user's address as the value in the searchEndorsements searchInput
			searchByStreetAddressInputValue = reversedGeolocation.addresses[0].address.freeformAddress;

			location.country = reversedGeolocation.addresses[0].address.country;
			location.zipcode = reversedGeolocation.addresses[0].address.extendedPostalCode;
			location.state = reversedGeolocation.addresses[0].address.countrySubdivision;
			location.county = reversedGeolocation.addresses[0].address.countrySecondarySubdivision;
			location.city = reversedGeolocation.addresses[0].address.municipality;
			location.street= reversedGeolocation.addresses[0].address.street;
			location.streetNumber = reversedGeolocation.addresses[0].address.streetNumber;

			// get U.S. Congressional District, State Senate District, State House District and City Ward data

			getUSCongressionalDistrict(latitude, longitude);

            // set the search

			endorsedReferendumsSearchStore.setSearch({
				year: yearInputValue.toString(),
				government_level: "federal",
				state: location.state,
				county: location.county,
				city: location.city,
				name: name,
                election_date: "",
                status: ""
			});

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

	// if user activates the get current location checkbox AND after fetching data, set pending as true and find user location

	// else if user activates get current location checkbox AND address has not yet loaded and endorsement data has not loaded, set pending as true

	$effect(() => {

        if (
            useCurrentLocationChecked &&
            getEndorsedReferendumsDataSuccess
        ) { 
            pendingReverseGeocode = true;
            findUserLocation();
        } else if (
            useCurrentLocationChecked && 
            addressLoadSuccess === null &&
            !getEndorsedReferendumsDataSuccess
        ) {
            pendingReverseGeocode = true;
        };

        if (useCurrentLocationChecked) {
            findUserLocation();
        };

    });

	// handle changes to searchbar input value

	let statesWithCity: string[] = $state([])

	const searchByStreetAddressInputValueChangeHandler = () => {

		// reset current pagination page for each category
		currentPage = 1;

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
					getGeoCoordinates(location);

					if (location.longitude && location.latitude) {
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
			location.USCongressionalDistrict = "";
			location.StateSenateDistrict = "";
			location.StateHouseDistrict = "";
			location.CityWard = "";
			name = "";
			stateValueArray = [];
			stateValueFirstWord = "";
			cityValueArray = [];
			cityValueFirstWord = "";
			countyValueArray = [];
			countyValueFirstWord = "";

		};

		// update the search 

        endorsedReferendumsSearchStore.setSearch({
			year: yearInputValue.toString(),
			government_level: "all",
			state: location.state,
			county: location.county,
			city: location.city,
			name: name,
			election_date: "",
			status: ""
		});

	};

	// if option is selected, run filters

	let searchbarOptionSelected: boolean = $state(false);

	$effect(() => {
        if (searchbarOptionSelected) {
            searchByStreetAddressInputValueChangeHandler();
            searchbarOptionSelected = false;
        };
    });	

	const selectYearInputValueChangeHandler = () => {

		currentPage = 1;

		endorsedReferendumsSearchStore.setSearch({
            year: yearInputValue.toString(),
            government_level: "all",
            state: location.state,
            county: location.county,
            city: location.city,
            name: name,
            election_date: "",
            status: ""
        });

	};

	let endorsementTabPanels: EndorsementTabPanel[] = $derived([
		{
			id: uuidv4(),
			index: 0,
			label: "all",
			hasCapitol: true,
			data: filteredEndorsedReferendums.all,
		},
		{
			id: uuidv4(),
			index: 1,
			label: "federal",
			hasCapitol: true,
			data: filteredEndorsedReferendums.federal,
		},
		{
			id: uuidv4(),
			index: 2,
			label: "state",
			hasCapitol: true,
			data: filteredEndorsedReferendums.state,
		},
		{
			id: uuidv4(),
			index: 3,
			label: "county",
			hasCapitol: true,
			data: filteredEndorsedReferendums.county,
		},
		{
			id: uuidv4(),
			index: 4,
			label: "city",
			hasCapitol: true,
			data: filteredEndorsedReferendums.city,
		},
	]);

	let openFilters: boolean = $state(true);

	let searchHeight: number = $state(0);

	// innerWidth is the width of the inner window
	let innerWidth: number = $state(0);

	let clearFiltersClicked: boolean = $state(false);

	$effect(() => {
        if (clearFiltersClicked) {
            page.url.pathname = "/endorsements/referendums-endorsed";
            goto(page.url.pathname);
            useCurrentLocationChecked = false;
            searchByStreetAddressInputValue = "";
			searchByStreetAddressInputValueChangeHandler();
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

	let disableClearFiltersButton: boolean = $state(false);

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
	<title>endorsed referendums - public arts commission</title>
	<meta name="description" content="find public arts commission-endorsed referendums" />
	<meta property="og:image" content={PublicArtsCommissionBanner} 
/>

</svelte:head>
<svelte:window 
	bind:innerHeight
	bind:innerWidth 
	bind:scrollY={y} 
/>
<section class="page">
	<h1 bind:this={endorsementsHeadingElement}>
		endorsed referendums
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
										searchInputValueChange={() => searchByStreetAddressInputValueChangeHandler()}
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
							{#if pendingUSCongressionalDistrict}
								<p style="font-size: 1rem">getting U.S. Congressional District</p>
							{:else if getUSCongressionalDistrictResponse.error}
								<p style="font-size: 1rem">failed to get U.S. Congressional District</p>
							{:else if location.USCongressionalDistrict}
								<p style="font-size: 1rem">
									<span>U.S. Congressional District: </span>
									<span style={"font-weight: bold"}>{location.USCongressionalDistrict}</span>
								</p>
								<p style="font-size: 1rem">
									<span>State Senate District: </span>
									<span style={"font-weight: bold"}>{location.StateSenateDistrict}</span>
								</p>
								<p style="font-size: 1rem">
									<span>State House District: </span>
									<span style={"font-weight: bold"}>{location.StateHouseDistrict}</span>
								</p>
							{/if}
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
									searchInputValueChange={() => searchByStreetAddressInputValueChangeHandler()}
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
						{#if pendingUSCongressionalDistrict}
							<p style="font-size: 1rem">getting U.S. Congressional District</p>
						{:else if getUSCongressionalDistrictResponse.error}
							<p style="font-size: 1rem">failed to get U.S. Congressional District</p>
						{:else if location.USCongressionalDistrict}
							<p style="font-size: 1rem">
								<span>U.S. Congressional District: </span>
								<span style={"font-weight: bold"}>{location.USCongressionalDistrict}</span>
							</p>
							<p style="font-size: 1rem">
								<span>State Senate District: </span>
								<span style={"font-weight: bold"}>{location.StateSenateDistrict}</span>
							</p>
							<p style="font-size: 1rem">
								<span>State House District: </span>
								<span style={"font-weight: bold"}>{location.StateHouseDistrict}</span>
							</p>
						{/if}
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
				{#if pendingEndorsedReferendumsData}
					<LoaderAnimation />
				{:else if getEndorsedReferendumsDataSuccess}
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
			category="referendum"
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