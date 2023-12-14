<script lang="ts">
	import MainHeader from '$lib/components/MainHeader.svelte';
	import MainFooter from '$lib/components/MainFooter.svelte';
	import SideDrawer from '$lib/components/navigation/sideDrawer/SideDrawer.svelte';
	import Backdrop from '$lib/components/navigation/sideDrawer/Backdrop.svelte';
	import TeamMemberBackdrop from '$lib/components/team/teamMemberSidedrawer/TeamMemberBackdrop.svelte'
	import TeamMemberSideDrawer from '$lib/components/team/teamMemberSidedrawer/TeamMemberSidedrawer.svelte'
	import { TeamMemberSelectedStore } from '$lib/stores/TeamMemberSelectedStore';
	import { SidedrawerOpenStore } from '$lib/stores/SidedrawerOpenStore';
  	import { onDestroy } from 'svelte';
	import './styles.css';
  	import CreateVoterAccountPromptModal from '$lib/components/endorsements/createVoterAccountModal/CreateVoterAccountPromptModal.svelte';
  	import { CreateVoterAccountPromptStore } from '$lib/stores/CreateVoterAccountPromptStore';
	import { ModalOpenStore } from '$lib/stores/ModelOpenStore';
	import CreateVoterAccountPromptBackdrop from '$lib/components/endorsements/createVoterAccountModal/CreateVoterAccountPromptBackdrop.svelte';

	let open: boolean = false;
	
	let footerElHeight: number = 0;

	let selectedTeamMemberId: number | null = null;

	let nominationCategory: string = "";

	let sideDrawerOpen: boolean = false;

	let modalOpen: boolean = false;

	const unsubscribeTeamMemberSelectedStore = TeamMemberSelectedStore.subscribe((value) => {
		selectedTeamMemberId = value;
	});

	const unsubscribeCreateVoterAccountPromptStore = CreateVoterAccountPromptStore.subscribe((value) => {
		nominationCategory = value;
	})

	const unsubscribeSidedrawerOpenStore = SidedrawerOpenStore.subscribe((value) => {
		sideDrawerOpen = value;
	});

	const unsubscribeModalOpenStore = ModalOpenStore.subscribe((value) => {
		modalOpen = value;
	});

	onDestroy(() => {
		unsubscribeTeamMemberSelectedStore();
		unsubscribeCreateVoterAccountPromptStore();
		unsubscribeSidedrawerOpenStore();
		unsubscribeModalOpenStore();
	});

</script>

<div class="app">
	<MainHeader 
		bind:sideDrawer={open}
	/>

	<main style="padding-bottom: {footerElHeight}px">
		<slot />
	</main>

	<MainFooter 
		bind:footerHeight={footerElHeight}
	/>
	{#if (open)}
		<Backdrop bind:open />
	{/if}
	<SideDrawer bind:open />
	{#if (sideDrawerOpen)}
		<TeamMemberBackdrop />
	{:else if (modalOpen)}
		<CreateVoterAccountPromptBackdrop />
	{/if}
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
