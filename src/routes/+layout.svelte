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
	import { EndorsedActionOpenStore } from '$lib/stores/EndorsedActionOpenStore';
	import { EndorsedAmendmentOpenStore } from '$lib/stores/EndorsedAmendmentOpenStore';
	import { EndorsedLegislationOpenStore } from '$lib/stores/EndorsedLegislationOpenStore';
	import { EndorsedCandidateOpenStore } from '$lib/stores/EndorsedCandidateOpenStore';
	import { EndorsedReferendumOpenStore } from '$lib/stores/EndorsedReferendumOpenStore';
  	import EndorsedActionSidedrawer from '$lib/components/endorsements/endorsementSidedrawer/EndorsedActionSidedrawer.svelte';
  	import EndorsedAmendmentSidedrawer from '$lib/components/endorsements/endorsementSidedrawer/EndorsedAmendmentSidedrawer.svelte';
  	import EndorsedCandidateSidedrawer from '$lib/components/endorsements/endorsementSidedrawer/EndorsedCandidateSidedrawer.svelte';
  	import EndorsedLegislationSidedrawer from '$lib/components/endorsements/endorsementSidedrawer/EndorsedLegislationSidedrawer.svelte';
  	import EndorsedReferendumSidedrawer from '$lib/components/endorsements/endorsementSidedrawer/EndorsedReferendumSidedrawer.svelte';
  	import DeleteConfirmationModal from '$lib/components/modals/DeleteConfirmationModal.svelte';

	let openMobileNav: boolean = false;

	let openCreateVoterAccountPrompt: boolean = false;

	let teamMemberSideDrawerOpen: boolean = false;

	let endorsedCandidateSideDrawerOpen: boolean = false;

	let endorsedAmendmentSideDrawerOpen: boolean = false;

	let endorsedReferendumSideDrawerOpen: boolean = false;

	let endorsedLegislationSideDrawerOpen: boolean = false;

	let endorsedActionSideDrawerOpen: boolean = false;
	
	let footerElHeight: number = 0;

	let selectedTeamMemberId: number | null = null;

	let nominationCategory: string = "";

	let backdrop: boolean = false;

	$: if (

		openMobileNav || 

		teamMemberSideDrawerOpen || 

		openCreateVoterAccountPrompt ||

		endorsedActionSideDrawerOpen ||

		endorsedAmendmentSideDrawerOpen ||

		endorsedCandidateSideDrawerOpen ||

		endorsedLegislationSideDrawerOpen ||

		endorsedReferendumSideDrawerOpen

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

	const unsubscribeModalOpenStore = ModalOpenStore.subscribe((value) => {

		openCreateVoterAccountPrompt = value;

	});

	const unsubscripeEndorsedCandidateOpenStore = EndorsedCandidateOpenStore.subscribe((value => {

		endorsedCandidateSideDrawerOpen = value;

	}));

	const unsubscribeEndorsedLegislationOpenStore = EndorsedLegislationOpenStore.subscribe((value) => {

		endorsedLegislationSideDrawerOpen = value;

	});

	const unsubscribeEndorsedReferendumOpenStore = EndorsedReferendumOpenStore.subscribe((value) => {

		endorsedReferendumSideDrawerOpen = value;

	});

	const unsubscribeEndorsedAmendmentOpenStore = EndorsedAmendmentOpenStore.subscribe((value) => {

		endorsedAmendmentSideDrawerOpen = value;

	});

	const unsubscribeEndorsedActionOpenStore = EndorsedActionOpenStore.subscribe((value) => {

		endorsedActionSideDrawerOpen = value;

	})


	onDestroy(() => {

		unsubscribeTeamMemberSelectedStore();
		unsubscribeCreateVoterAccountPromptStore();
		unsubscribeTeamMemberSidedrawerOpenStore();
		unsubscribeModalOpenStore();
		unsubscripeEndorsedCandidateOpenStore();
		unsubscribeEndorsedLegislationOpenStore();
		unsubscribeEndorsedReferendumOpenStore();
		unsubscribeEndorsedAmendmentOpenStore();
		unsubscribeEndorsedActionOpenStore();

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
	<EndorsedActionSidedrawer />
	<EndorsedAmendmentSidedrawer />
	<EndorsedCandidateSidedrawer />
	<EndorsedLegislationSidedrawer />
	<EndorsedReferendumSidedrawer />
	<DeleteConfirmationModal />
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
