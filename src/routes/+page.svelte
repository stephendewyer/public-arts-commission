<script lang="ts">
	import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
	import LoginBackground from '$lib/images/11_December_2012_take_Lansing,_Michigan.jpg';
  	import Checkbox from '$lib/components/inputs/checkbox.svelte';
	import Input from '$lib/components/inputs/input.svelte';
	import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';


    export let data;

	// console.log(data);

	const searchSubmitHandler = () => {
		console.log('search submit clicked!S')
	}
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
				<Checkbox>
					use my current location
				</Checkbox>
			</div>
			<div class="search_endorsements_by_address_input">
				<Input 
					placeholder="1000 MyStreet, MyCity, MyState  10000"
					inputID="address"
					inputName="address"
					inputType="text"
				/>
			</div>
		</div>
		<SubmitButton>
			search endorsements
		</SubmitButton>
	</form>
	<div 
		class="login_container"
		style="background-image: url({LoginBackground});"
	>
		<div class="login_section">
			<h2>
				I'm a ...
			</h2>
			<h3>
				voter
			</h3>
			<h4>
				organize with your community
			</h4>
			<div class="login_email_input">
				<Input 
					placeholder="myEmail@myDomain.com"
					inputID="voter_email"
					inputName="voter_email"
					inputType="email"
				>email</Input>
			</div>
		</div>
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
