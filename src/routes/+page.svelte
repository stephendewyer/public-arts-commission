<script lang="ts">
	import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
	import LoginBackground from '$lib/images/11_December_2012_take_Lansing,_Michigan.jpg';
  	import Checkbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
	import SearchInput from '$lib/components/inputs/SearchInput.svelte';
	import ActionButton from '$lib/components/buttons/ActionButton.svelte';
	import LoginCampaign from '$lib/components/logins/LoginCampaign.svelte';
	import LoginVoter from '$lib/components/logins/LoginVoter.svelte';
	import Tabs from '$lib/components/tabPanels/Tabs.svelte';
	import Panel from '$lib/components/tabPanels/Panel.svelte';
	import { v4 as uuidv4 } from 'uuid';

    export let data;

	let activeLoginTab: number;

	$: activeLoginTab = 0;

	let campaignLoginClicked: string = "";
	let voterLoginClicked: string = "";

	let useCurrentLocationChecked: boolean;

	$: campaignLoginClicked;
	$: voterLoginClicked;

	$: useCurrentLocationChecked;

	$: if (campaignLoginClicked !== "") { console.log(campaignLoginClicked) };
	$: if (voterLoginClicked !== "") { console.log(voterLoginClicked) };

	// once user clicks "use my current location" checkbox, 
    
	// define the latitude and longitude variables
	let latitude: string = "";
	let longitude: string = "";	

	// set the latitude and longitude with user's position.coords

	let reversedGeolocation: any;

	// use the user's geolocation to get the user's address

	async function reverseGeocode(latitude: string, longitude: string): Promise<string> {
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
		return reversedGeolocation;
	}

	const success = (position: any) => {

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
		if (useCurrentLocationChecked && (reversedGeolocation !== searchValue)) {
			useCurrentLocationChecked = false;
			return useCurrentLocationChecked;
		}
	}

	// console.log(data);

	let searchValue: string;

	const searchSubmitHandler = () => {
		console.log('search submit clicked!');
		console.log(`search value is ${searchValue}`);
	}

	const loginTabPanels: tabPanels[] = [
		{
			id: uuidv4(),
			index: 0,
			label: "voter",
			panel: LoginVoter
		},
		{
			id: uuidv4(),
			index: 1,
			label: "campaign",
			panel: LoginCampaign
		}
	]

	

</script>

<svelte:head>
	<title>public arts commission - welcome</title>
	<meta name="description" content="public arts commission index" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>

<section>
	<p>
		{#each data.data as voter}
			{voter.email}
		{/each}
	</p>
	<picture class="banner">
		<img src={PublicArtsCommissionBanner} alt="public arts commission banner" />
	</picture>
	<h1 class="heading01">
		Art for everyone is fundamental to democracy.  We help grow our political imagination to support a more egalitarian society.
	</h1>
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
		<ActionButton>
			search endorsements
		</ActionButton>
	</form>
	<div 
		class="login_container"
		style="background-image: url({LoginBackground});"
	>
		<div class="login_section">
			<h2>
				I'm a ...
			</h2>
			<Tabs 
				tabPanels={loginTabPanels} 
				bind:activeTab={activeLoginTab}
			/>
			<Panel 
				tabPanels={loginTabPanels} 
				bind:activeTab={activeLoginTab}
				bind:campaignLoginClicked
				bind:voterLoginClicked
			/>			
		</div>
	</div>
	<div class="forthcoming actions">
		<h2>
			forthcoming actions
		</h2>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.banner {
		width: 100%;
		max-width: 60rem;
		padding: 1rem 0;
	}

	.heading01 {
		max-width: 60rem;
		padding: 0 1rem;
	}

	.search_endorsements_by_address_form {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 1rem 1rem 1rem;
	}

	.search_endorsement_fields {
		display: flex;
		flex-direction: row;
		width: 100%;
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

	.login_container {
		width: 100%;
		background-size: cover;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem 1rem;
		background-repeat: no-repeat;
		background-position: center;
	}

	.login_section {
		background-color: rgba(239,249,242,0.7);
		max-width: 40rem;
		width: 100%;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	@media (max-width: 1140px) {
		.search_endorsement_fields {
			display: flex;
			flex-direction: column;
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
