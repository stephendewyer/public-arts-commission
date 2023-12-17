<script lang="ts">
	import MainHeader from '$lib/components/MainHeader.svelte';
	import MainFooter from '$lib/components/MainFooter.svelte';
	import SideDrawer from '$lib/components/navigation/sideDrawer/SideDrawer.svelte';
	import Backdrop from '$lib/components/overlays/Backdrop.svelte';
	import TeamMemberSideDrawer from '$lib/components/team/teamMemberSidedrawer/TeamMemberSidedrawer.svelte'
	import { TeamMemberSidedrawerOpenStore } from '$lib/stores/TeamMemberSidedrawerOpenStore';
	import { TeamMemberSelectedStore } from '$lib/stores/TeamMemberSelectedStore';
  	import { onDestroy } from 'svelte';
	import './styles.css';
  	import CreateVoterAccountPromptModal from '$lib/components/endorsements/createVoterAccountModal/CreateVoterAccountPromptModal.svelte';
  	import { CreateVoterAccountPromptStore } from '$lib/stores/CreateVoterAccountPromptStore';
	import { ModalOpenStore } from '$lib/stores/ModelOpenStore';
	
	let openMobileNav: boolean = false;

	let openCreateVoterAccountPrompt: boolean = false;

	let teamMemberSideDrawerOpen: boolean = false;
	
	let footerElHeight: number = 0;

	let selectedTeamMemberId: number | null = null;

	let nominationCategory: string = "";

	let backdrop: boolean = false;

	$: if (

		openMobileNav || 

		teamMemberSideDrawerOpen || 

		openCreateVoterAccountPrompt

	) {

		backdrop = true;

	} else {

		backdrop = false;
		
	};

	const unsubscribeTeamMemberSelectedStore = TeamMemberSelectedStore.subscribe((value) => {
		
		selectedTeamMemberId = value;

	});

	const unsubscribeCreateVoterAccountPromptStore = CreateVoterAccountPromptStore.subscribe((value) => {
		
		nominationCategory = value;

	});

	const unsubscribeTeamMemberSidedrawerOpenStore = TeamMemberSidedrawerOpenStore.subscribe((value) => {
		
		teamMemberSideDrawerOpen = value;

	});

	$: console.log("team member sidedrawer open is ", teamMemberSideDrawerOpen)

	const unsubscribeModalOpenStore = ModalOpenStore.subscribe((value) => {

		openCreateVoterAccountPrompt = value;

	});

	onDestroy(() => {

		unsubscribeTeamMemberSelectedStore();

		unsubscribeCreateVoterAccountPromptStore();

		unsubscribeTeamMemberSidedrawerOpenStore();

		unsubscribeModalOpenStore();

	});



</script>

<div class="app">
	<MainHeader 
		bind:sideDrawer={openMobileNav}
	/>

	<main style="padding-bottom: {footerElHeight}px">
		<slot />
	</main>

	<MainFooter 
		bind:footerHeight={footerElHeight}
	/>
	{#if (backdrop)}
		<Backdrop 
			bind:openMobileNav 
		/>
	{/if}
	<SideDrawer bind:openMobileNav />
	<TeamMemberSideDrawer />
	<CreateVoterAccountPromptModal />
</div>

<style>

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		position: relative;
		overflow-x: hidden;
	}

	main {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
	}

</style>
