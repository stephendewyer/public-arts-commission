<script lang="ts">
    import Checkbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import ActionButton from '$lib/components/buttons/ActionButton.svelte';
    import YearSelection from '$lib/components/selections/YearSelection.svelte';
    import { onMount } from 'svelte';

    import { page } from '$app/stores';

    let searchValue: string;

    let useCurrentLocationChecked: boolean;

    let disableButton: boolean = true;

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


</script>
    
    <form 
		on:submit|preventDefault={searchSubmitHandler}
		class="search_endorsements_by_address_form"
	>
		<h2>
		    search endorsements by address
		</h2>
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

</style>