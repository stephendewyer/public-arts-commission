<script lang="ts">
    import Checkbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import ActionButton from '$lib/components/buttons/ActionButton.svelte';
    import { onMount, onDestroy, getContext } from 'svelte';
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
	import SelectInput from '$lib/components/inputs/SelectInput.svelte';
	import { EndorsedCandidatesStore } from '$lib/stores/EndorsedCandidatesStore';
	import { EndorsedLegislationStore } from '$lib/stores/EndorsedLegislationStore';
	import { EndorsedAmendmentsStore } from '$lib/stores/EndorsedAmendmentsStore';
	import { EndorsedReferendumsStore } from '$lib/stores/EndorsedReferendumsStore';
	
	export let data;

	$: data;

	let candidatesFederal: CandidateWithImage[] = [];
	let candidatesState: CandidateWithImage[] = [];
	let candidatesCounty: CandidateWithImage[] = [];
	let candidatesCity: CandidateWithImage[] = [];

	let endorsedCandidates: CandidateWithImage[] = [];    

    const unsubscribeEndorsedCandidatesStore = EndorsedCandidatesStore.subscribe((value: CandidateWithImage[]) => {
        
        endorsedCandidates = value;

    });

	endorsedCandidates.forEach((candidate) => {
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

	const unsubscribeEndorsedLegislationStore = EndorsedLegislationStore.subscribe((value: LegislationWithSponsorsAndImage[]) => {
		
		endorsedLegislation = value;

	});

	endorsedLegislation.forEach((legislation) => {
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

	const unsubscribeEndorsedAmendmentsStore = EndorsedAmendmentsStore.subscribe((value: AmendmentWithSponsorsAndImage[]) => {
		
		endorsedAmendments = value;

	});

	endorsedAmendments.forEach((amendment) => {
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

	let referendumsFederal: Referendum[] = [];
	let referendumsState: Referendum[] = [];
	let referendumsCounty: Referendum[] = [];
	let referendumsCity: Referendum[] = [];

	let endorsedReferendums: ReferendumWithImage[] = [];

	const unsubscribeEndorsedReferendumsStore = EndorsedReferendumsStore.subscribe((value: ReferendumWithImage[]) => {
		
		endorsedReferendums = value;

	});

	endorsedReferendums.forEach((referendum) => {
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

	onDestroy(() => {
		unsubscribeEndorsedCandidatesStore();
		unsubscribeEndorsedLegislationStore();
		unsubscribeEndorsedAmendmentsStore();
		unsubscribeEndorsedReferendumsStore();
	});

    let searchValue: string;

    let useCurrentLocationChecked: boolean;

    let disableButton: boolean = true;

	let activeEndorsementsTab: number;

	let yearInputValue: number;

	$: activeEndorsementsTab = 0;

    // get string from url of whether get current location checkbox checked and address

    let searchQueries: string[];

    // use onMount to get data from params after page is prerendered

    onMount(() => {
        if ($page.url.search !== "") {
            searchQueries = $page.url.search.split("?");
            console.log(searchQueries);
            if (searchQueries[1] === "current_address_checked=true") {
                useCurrentLocationChecked = true;
            } else if (searchQueries[1] !== "current_address_checked=true") {
                searchValue = searchQueries[2].replace(/_/g, ' ');
                if (searchValue !== "") {
                    disableButton = false;
                };
            };
        };
    });
    
    // once user clicks "use my current location" checkbox, 

	// define the latitude and longitude variables
	let latitude: number | null = null;
	let longitude: number | null = null;

	// define the location variables

	let country: string = "";
	let zipcode: string = "";
	let state: string = "";
	let county: string = "";
	let city: string = "";
	let street: string = "";
	let streetNumber: string = "";

	// set the latitude and longitude with user's position.coords

	let reversedGeolocation: ReverseGeoLocation;

	// use the user's geolocation to get the user's address

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

		// show the user's address as the value in the searchEndorsements searchInput

		searchValue = reversedGeolocation.addresses[0].address.freeformAddress;

		country = reversedGeolocation.addresses[0].address.country;
		zipcode = reversedGeolocation.addresses[0].address.extendedPostalCode;
		state = reversedGeolocation.addresses[0].address.countrySubdivision;
		county = reversedGeolocation.addresses[0].address.countrySecondarySubdivision;
		city = reversedGeolocation.addresses[0].address.municipality;
		street= reversedGeolocation.addresses[0].address.street;
		streetNumber = reversedGeolocation.addresses[0].address.streetNumber;

		return searchValue;

	};

	const success = (position: GeoLocationPosition) => {

		disableButton = false;

		latitude = position.coords.latitude;
		longitude = position.coords.longitude;

		reverseGeocode(latitude, longitude);

	};

	// log an error if getCurrentPosition fails

	const error = (error: any) => {
		console.log("Unable to retrieve your location!" + error);
	};

	// get user's location using JavaScript geolocation

	const findUserLocation = () => {

		navigator.geolocation.getCurrentPosition(success, error);

	};

	// if user activates the get current location checkbox, call the findUserLocation checkbox, else clear the searchValue

	$: if (useCurrentLocationChecked) { findUserLocation() };

	const searchInputValueChangeHandler = () => {

		if (searchValue !== "" ) {
			disableButton = false;
		} else if (searchValue == "") {
			disableButton = true;
		};

		if (useCurrentLocationChecked && (reversedGeolocation.addresses[0].address.freeformAddress !== searchValue)) {

			useCurrentLocationChecked = false;

			return useCurrentLocationChecked;

		};
	};

	// console.log(data);

	const searchSubmitHandler = () => {

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
				endorsed_amendments: endorsedAmendments, 
				endorsed_candidates: endorsedCandidates,
				endorsed_legislation: endorsedLegislation,
				endorsed_referendums: endorsedReferendums
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
		on:submit|preventDefault={searchSubmitHandler}
		class="search_endorsements_by_address_form"
	>
		<h1>
		    search endorsements by address
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
				<SearchInput 
					placeholder="1000 MyStreet, MyCity, MyState  10000"
					inputID="address"
					inputName="address"
					inputLabel={false}
					bind:searchInputValue={searchValue}
					searchInputValueChange={() => searchInputValueChangeHandler()}
				/>
			</div>
		</div>	
		<ActionButton
			bind:disable={disableButton}
		>
			search endorsements
		</ActionButton>
	</form>
	<div class="election_year_field">
		<SelectInput 
			options={Years}
			bind:selectInputValue={yearInputValue}
			isValid={true}
			required={false}
			inputID="election_year"
			inputName="election_year"
			selectInputErrorMessage=""
			inputLabel={true}
		>
			election year
		</SelectInput>
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