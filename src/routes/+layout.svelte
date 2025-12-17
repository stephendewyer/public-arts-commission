<script lang="ts">
	import MainHeader from '$lib/components/MainHeader.svelte';
	import MainFooter from '$lib/components/MainFooter.svelte';
	import SideDrawer from '$lib/components/navigation/sideDrawer/SideDrawer.svelte';
	import Backdrop from '$lib/components/overlays/Backdrop.svelte';
	import TeamMemberSideDrawer from '$lib/components/team/teamMemberSidedrawer/TeamMemberSidedrawer.svelte'
	import { TeamMemberSidedrawerOpenStore } from '$lib/stores/TeamMemberSidedrawerOpenStore';
	import './styles.css';
  	import CreateVoterAccountPromptModal from '$lib/components/modals/CreateVoterAccountPromptModal.svelte';
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
  	import CampaignApplicationActionConfirmModal from '$lib/components/modals/CampaignApplicationActionConfirmModal.svelte';
	import { page } from '$app/state';

	let pageSearch: string = "";

	$: pageSearch = page.url.search;

	let openMobileNav: boolean = false;

	let footerElHeight: number = 0;

	let backdrop: boolean = false;

	let openCreateVoterAccountPrompt: boolean = $ModalOpenStore;

	$: openCreateVoterAccountPrompt = $ModalOpenStore;

	let teamMemberSideDrawerOpen: boolean;

	$: teamMemberSideDrawerOpen = $TeamMemberSidedrawerOpenStore;

	let endorsedCandidateSideDrawerOpen: boolean;

	$: endorsedCandidateSideDrawerOpen = $EndorsedCandidateOpenStore;

	let endorsedAmendmentSideDrawerOpen: boolean;

	$: endorsedAmendmentSideDrawerOpen = $EndorsedAmendmentOpenStore;

	let endorsedReferendumSideDrawerOpen: boolean;

	$: endorsedReferendumSideDrawerOpen = $EndorsedReferendumOpenStore;

	let endorsedLegislationSideDrawerOpen: boolean;

	$: endorsedLegislationSideDrawerOpen = $EndorsedLegislationOpenStore;

	let endorsedActionSideDrawerOpen: boolean;

	$: endorsedActionSideDrawerOpen = $EndorsedActionOpenStore;

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

</script>

<div class="app">
	<MainHeader 
		bind:sideDrawer={openMobileNav}
	/>

	<main style="padding-bottom: {footerElHeight}px;">
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
	<TeamMemberSideDrawer pageSearch={pageSearch}/>
	<CreateVoterAccountPromptModal />
	<EndorsedActionSidedrawer pageSearch={pageSearch}/>
	<EndorsedAmendmentSidedrawer pageSearch={pageSearch}/>
	<EndorsedCandidateSidedrawer pageSearch={pageSearch}/>
	<EndorsedLegislationSidedrawer pageSearch={pageSearch}/>
	<EndorsedReferendumSidedrawer pageSearch={pageSearch}/>
	<DeleteConfirmationModal />
	<CampaignApplicationActionConfirmModal />
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
