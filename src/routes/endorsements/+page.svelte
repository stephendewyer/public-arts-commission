<script lang="ts">
    import Checkbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import ActionButton from '$lib/components/buttons/ActionButton.svelte';
    import YearSelection from '$lib/components/selections/YearSelection.svelte';
    import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Tabs from '$lib/components/tabPanels/Tabs.svelte';
	import TabPanel from '$lib/components/tabPanels/Panel.svelte';
    import { v4 as uuidv4 } from 'uuid';
	import CityEndorsementsPanel from '$lib/components/endorsements/endorsementPanels/CityEndorsementsPanel.svelte';
	import CountyEndorsementsPanel from '$lib/components/endorsements/endorsementPanels/CountyEndorsementsPanel.svelte';
	import StateEndorsementsPanel from '$lib/components/endorsements/endorsementPanels/StateEndorsementsPanel.svelte';
	import FederalEndorsementsPanel from '$lib/components/endorsements/endorsementPanels/FederalEndorsementsPanel.svelte';

    let searchValue: string;

    let useCurrentLocationChecked: boolean;

    let disableButton: boolean = true;

	let activeEndorsementsTab: number;

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
                }
            }    
        }
    })
    
    // once user clicks "use my current location" checkbox, 

	// define the latitude and longitude variables
	let latitude: number | null = null;
	let longitude: number | null = null;	

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

		return searchValue;

	}

	const success = (position: GeoLocationPosition) => {

		disableButton = false;

		latitude = position.coords.latitude;
		longitude = position.coords.longitude;

		reverseGeocode(latitude, longitude);

	}

	// log an error if getCurrentPosition fails

	const error = (error: any) => {
		console.log("Unable to retrieve your location!" + error);
	}

	// get user's location using JavaScript geolocation

	const findUserLocation = () => {

		navigator.geolocation.getCurrentPosition(success, error)

	}

	// if user activates the get current location checkbox, call the findUserLocation checkbox, else clear the searchValue

	$: if (useCurrentLocationChecked) { findUserLocation() } 

	const searchInputValueChangeHandler = () => {

		if (searchValue !== "" ) {
			disableButton = false;
		} else if (searchValue == "") {
			disableButton = true;
		}

		if (useCurrentLocationChecked && (reversedGeolocation.addresses[0].address.freeformAddress !== searchValue)) {

			useCurrentLocationChecked = false;

			return useCurrentLocationChecked;

		}
	}

	// console.log(data);

	const searchSubmitHandler = () => {

	}

	const endorsementTabPanels: tabPanels[] = [
		{
			id: uuidv4(),
			index: 0,
			label: "federal",
			hasCapitol: true,
			panel: FederalEndorsementsPanel
		},
		{
			id: uuidv4(),
			index: 1,
			label: "state",
			hasCapitol: true,
			panel: StateEndorsementsPanel
		},
		{
			id: uuidv4(),
			index: 2,
			label: "county",
			hasCapitol: true,
			panel: CountyEndorsementsPanel
		},
		{
			id: uuidv4(),
			index: 3,
			label: "city",
			hasCapitol: true,
			panel: CityEndorsementsPanel
		}
	]

</script>

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
        <YearSelection>
            select election year
        </YearSelection>
        
		<ActionButton
			bind:disable={disableButton}
		>
			search endorsements
		</ActionButton>
	</form>
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
		padding: 0 1rem 1rem 1rem;
	}

	.search_endorsement_fields {
		display: flex;
		flex-direction: row;
		width: 100%;
        justify-content: center;
        padding: 2rem 0;
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

    @media (max-width: 1140px) {

		.search_endorsement_fields {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;
			width: 100%;
			
		}

		.use_current_location_checkbox {
			width:20rem;
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