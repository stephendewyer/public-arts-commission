<script lang="ts">
	import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
	import LoginBackground from '$lib/images/backgrounds/11_December_2012_take_Lansing,_Michigan.jpg';
  	import Checkbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
	import SearchInput from '$lib/components/inputs/SearchInput.svelte';
	import ActionButton from '$lib/components/buttons/ActionButton.svelte';
	import LoginCampaign from '$lib/components/logins/LoginCampaign.svelte';
	import LoginVoter from '$lib/components/logins/LoginVoter.svelte';
	import Tabs from '$lib/components/tabPanels/Tabs.svelte';
	import Panel from '$lib/components/tabPanels/Panel.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { afterNavigate, goto } from '$app/navigation';
  	import { onMount } from 'svelte';
  	import ActionEndorsementCard from '$lib/components/cards/endorsementCards/ActionEndorsementCard.svelte';
	import LoaderAnimation from '$lib/components/loaders/LoaderAnimation.svelte';
	import { EndorsedActionOpenStore } from '$lib/stores/EndorsedActionOpenStore.js';
	import { EndorsedActionSelectedStore } from '$lib/stores/EndorsedActionSelectedStore.js';
	import { page } from '$app/state';
	import GeolocationIcon from "$lib/images/icons/geolocation_icon.svg?raw";
	import CampaignHighlights from '$lib/components/sliders/CampaignHighlights.svelte';
  	import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';

	let URLPathName: string = page.url.pathname;

	const currentDate: Date = new Date();

	// load all the endorsed actions

	let endorsedActions: ActionWithImage[] = [];

	// load all the future actions

	let futureEndorsedActions: ActionWithImage[] = [];

	// begin get endorsed candidates data from database

	let pendingEndorsedActionsData: boolean = false;

	let getEndorsedActionsDataSuccess: boolean | null = null;

	async function getEndorsedActionsData() {

		pendingEndorsedActionsData = true;
		
		const response = await fetch("/api/getEndorsedActions");

		endorsedActions= await response.json();

		if (response.ok) {

			pendingEndorsedActionsData = false;

			getEndorsedActionsDataSuccess = true;

		} else if (!response.ok) {

			pendingEndorsedActionsData = false;

			getEndorsedActionsDataSuccess = false;

		};

		endorsedActions.forEach((action: ActionWithImage) => {

			const actionEndDate = new Date(action.date_end);
			const actionAllDayDate = new Date(action.all_day_event_date);

			if ((actionEndDate >= currentDate) || (actionAllDayDate >= currentDate)) {

				futureEndorsedActions = [...futureEndorsedActions, action];

			};

		});

	};

	onMount(() => {

		getEndorsedActionsData();

	});

	afterNavigate(() => {
		let searchParams: URLSearchParams = new URLSearchParams(page.url.search);

		if (searchParams.get("action_ID") !== null) {

			const actionID: string | null = searchParams.get("action_ID");

			endorsedActions.filter((action, i) => {

				if (action.action_ID.toString() === actionID) {

					$EndorsedActionSelectedStore = action;
					$EndorsedActionOpenStore = true;

				};

			});

		};
	});	
	
	let activeLoginTab: number;

	let useCurrentLocationChecked: boolean;

	let disableButton: boolean = true;

	$: activeLoginTab = 0;

	$: useCurrentLocationChecked;

	// once user clicks "use my current location" checkbox, 

	let searchValue: string;
    
	// define the latitude and longitude variables
	let latitude: number | null = null;
	let longitude: number | null = null;	

	// set the latitude and longitude with user's position.coords

	let reversedGeolocation: ReverseGeoLocation;

	// after submit

	let addressLoadSuccess: boolean | null = null;

	let pending: boolean = false;

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

		if (response.ok) {

			pending = false;

			addressLoadSuccess = true;

		} else if (!response.ok) {

			pending = false;

			addressLoadSuccess = false;

		};

		// show the user's address as the value in the searchEndorsements searchInput

		searchValue = reversedGeolocation.addresses[0].address.freeformAddress;

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

		pending = false;

		addressLoadSuccess = false;

		console.log("Unable to retrieve your location!" + error);

	};

	// get user's location using JavaScript geolocation

	const findUserLocation = () => {

		navigator.geolocation.getCurrentPosition(success, error)

	};

	// if user activates the get current location checkbox, call the findUserLocation checkbox, else clear the searchValue

	$: if (useCurrentLocationChecked) { 

		pending = true;

		findUserLocation() 
	} 

	const searchInputValueChangeHandler = () => {

		if (searchValue !== "") {
			disableButton = false;
		} else if (searchValue === "") {
			disableButton = true;
		};

		if (useCurrentLocationChecked && (reversedGeolocation.addresses[0].address.freeformAddress !== searchValue)) {

			useCurrentLocationChecked = false;

			return useCurrentLocationChecked;

		};

	};

	const searchSubmitHandler = () => {

		const addressSlug = searchValue.replace(/ /g,"_");

		goto(`/endorsements?current_address_checked=${useCurrentLocationChecked}&address=${addressSlug}`);

	};

	const loginTabPanels: tabPanels[] = [
		{
			id: uuidv4(),
			index: 0,
			label: "voter",
			hasCapitol: false,
			panel: LoginVoter,
			data: []
		},
		{
			id: uuidv4(),
			index: 1,
			label: "campaign",
			hasCapitol: false,
			panel: LoginCampaign,
			data: []
		}
	];

</script>

<svelte:head>
	<title>public arts commission - welcome to the art community platform in politics</title>
	<meta name="description" content="public arts commission index" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>

<section class="index_page_container">
	<div class="banner_and_logins">
		<picture class="banner_container">
			<img class="banner" src={PublicArtsCommissionBanner} alt="public arts commission banner" />
		</picture>
		<div class="logins">
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
					/>			
				</div>
			</div>
		</div>
	</div>
	<div class="introduction">
		<h1 class="heading01">
			The platform for the art community in politics.
		</h1>
		<h2 class="heading02">
			The American Dream wasn't just imagined.  People made it happen.  We reimagine the American Dream and help make it happen for a stronger, more democratic society by giving the art community a platform in politics.
		</h2>
		<h3 class="heading03">
			Strengthening our political imagination is necessary to overcome the political cynicism that prevents us from coming together to solve our most demanding problems.  The art community plays a pivotal role in defining the American Dream, but largely has had no platform in politics.
			We are building the political platform for the art community.
		</h3>
	</div>
	
	<form 
		on:submit|preventDefault={searchSubmitHandler}
		class="search_endorsements_by_address_form"
	>
		<h2>
		search endorsements by street address
		</h2>
		<div class="search_endorsement_fields">
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
							bind:searchInputValue={searchValue}
							searchInputValueChange={() => searchInputValueChangeHandler()}
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
						bind:searchInputValue={searchValue}
						searchInputValueChange={() => searchInputValueChangeHandler()}
					/>
				{/if}
			</div>
			<div class="use_current_location_checkbox">
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
		</div>
		<ActionButton
			bind:disable={disableButton}
		>
			search endorsements
		</ActionButton>
	</form>
	<div class="highlighted_campaigns">
		<h2>
			highlighted campaigns
		</h2>
		<CampaignHighlights/>
	</div>
	<div 
		id="forthcoming_actions"
		class="forthcoming actions"
	>
		<h2 class="forthcoming_actions_heading">
			forthcoming actions
		</h2>
		<div class="action_cards_frame">
			<div class="action_cards">
				{#if pendingEndorsedActionsData}
					<LoaderAnimation />
				{:else if getEndorsedActionsDataSuccess}
					{#each futureEndorsedActions as action, i}
						<a 
							href={`${URLPathName}?action_ID=${action.action_ID}&action_name=${action.action_name.replace(/ /g,"_")}`}
							data-sveltekit-noscroll
						> 
							<ActionEndorsementCard endorsedActionData={action} />
						</a>
					{/each}
				{:else if !getEndorsedActionsDataSuccess}
					<p>failed to load endorsed forthcoming actions</p>
				{/if}
			</div>
		</div>
	</div>
	<div class="about">
		<h2>
			We are revolutionizing civic technology from the grassroots using the best of art, technology and design.
		</h2>
		<a href="/story">
			<ActionButtonSecondary>
				learn our story
			</ActionButtonSecondary>
		</a>
	</div>
</section>

<style>
	.index_page_container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.banner_and_logins {
		width: 100%;
		display: flex;
		flex-direction: row;
		gap: 1rem;
		max-width: 2000px;
	}

	.banner_container {
		width: 60%;
	}

	.banner {
		object-fit: cover;
		height: 100%;
		width: 100%;
	}

	.introduction {
		width: 100%;
		max-width: 60rem;
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.about {
		width: 100%;
		max-width: 60rem;
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.search_endorsements_by_address_form {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 1rem 1rem 1rem;
		gap: 1rem;
	}

	.search_endorsement_fields {
		display: flex;
		flex-direction: row;
		width: 100%;
		padding: 0 1rem;
		gap: 1rem;
	}

	.use_current_location_checkbox {
		width:20rem;
		display: inline;
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

	.search_endorsements_by_address_input {
		width: 40rem;
		display: inline-flex;
		justify-content: center;
		align-items: center;
	}

	.logins {
		width: 40%;
	}

	.login_container {
		width: auto;
		background-size: cover;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		padding: 1rem;
		background-repeat: no-repeat;
		background-position: center;
	}

	.login_section {
		background-color: rgba(239,249,242,0.7);
		width: 100%;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#forthcoming_actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.forthcoming_actions_heading {
		text-align: center;
	}

	.action_cards_frame {
        width: 100%;
        overflow-x: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
    }

    .action_cards {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;      
        gap: 1rem;
        padding: 0 1rem 1rem 1rem;
        width: 100%;
    }

	.highlighted_campaigns {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	@media screen and (max-width: 1140px) {
		.search_endorsement_fields {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;
			width: 100%;
		}

		.use_current_location_checkbox {
			width:auto;
			display: flex;
			margin: 0;
		}

		.use_current_location_label {
            font-size: 1.2rem;
        }

		.geolocation_container {
			width: 1.125rem;
		}

		.search_endorsements_by_address_input {
			width: 40rem;
			display: flex;
		}

        .action_cards {
            flex-wrap: nowrap;
            justify-content: flex-start;
        }
	}

	@media screen and (max-width: 1080px) {

		.banner_and_logins {
			flex-direction: column;
		}

		.banner_container {
			width: 100%;
		}

		.logins {
			width: 100%;
		}
	}

	@media screen and (max-width: 720px) {

		.search_endorsements_by_address_form {
			width: 100%;
		}

		.search_endorsement_fields {
			flex-direction: column;
		}

		.search_endorsements_by_address_input {
			width: 100%;
		}

		.use_current_location_label {
            font-size: 1rem;
        }

		.geolocation_container {
			width: 1rem;
		}
	}

</style>
