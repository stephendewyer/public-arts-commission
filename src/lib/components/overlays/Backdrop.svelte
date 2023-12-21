<script lang="ts">
    import { TeamMemberSelectedStore } from '$lib/stores/TeamMemberSelectedStore';
    import { onDestroy } from 'svelte';
    import { TeamMemberSidedrawerOpenStore } from '$lib/stores/TeamMemberSidedrawerOpenStore';
    import { ModalOpenStore } from '$lib/stores/ModelOpenStore';
    import { EndorsedActionOpenStore } from '$lib/stores/EndorsedActionOpenStore';
	import { EndorsedAmendmentOpenStore } from '$lib/stores/EndorsedAmendmentOpenStore';
	import { EndorsedLegislationOpenStore } from '$lib/stores/EndorsedLegislationOpenStore';
	import { EndorsedCandidateOpenStore } from '$lib/stores/EndorsedCandidateOpenStore';
	import { EndorsedReferendumOpenStore } from '$lib/stores/EndorsedReferendumOpenStore';
    import { EndorsedActionSelectedStore } from '$lib/stores/EndorsedActionSelectedStore';
    import { EndorsedAmendmentSelectedStore } from '$lib/stores/EndorsedAmendmentSelectedStore';
    import { EndorsedCandidateSelectedStore } from '$lib/stores/EndorsedCandidateSelectedStore';
    import { EndorsedLegislationSelectedStore } from '$lib/stores/EndorsedLegislationSelectedStore';
    import { EndorsedReferendumSelectedStore } from '$lib/stores/EndorsedReferendumSelectedStore';

    export let openMobileNav: boolean = false;

    let openTeamMember: boolean = false;

    let modalOpen: boolean = false;

    let openEndorsedAction: boolean = false;

    let openEndorsedAmendment: boolean = false;

    let openEndorsedCandidate: boolean = false;

    let openEndorsedLegislation: boolean = false;

    let openEndorsedReferendum: boolean = false;

    let open: boolean = false;

    let selectedTeamMemberId: number | null = null;

    const backdropClickedHandler = () => {
        openMobileNav = false;
        ModalOpenStore.update((value) => value = false);
        TeamMemberSidedrawerOpenStore.update((value) => value = false);
        EndorsedActionOpenStore.update((value) => value = false);
        EndorsedAmendmentOpenStore.update((value) => value = false);
        EndorsedLegislationOpenStore.update((value) => value = false);
        EndorsedCandidateOpenStore.update((value) => value = false);
        EndorsedReferendumOpenStore.update((value) => value = false);
        TeamMemberSelectedStore.update((value) => value = null);
        EndorsedActionSelectedStore.update((value => value = null));
        EndorsedAmendmentSelectedStore.update((value => value = null));
        EndorsedCandidateSelectedStore.update((value => value = null));
        EndorsedLegislationSelectedStore.update((value => value = null));
        EndorsedReferendumSelectedStore.update((value => value = null));
    };

    const unsubscribeModalOpenStore = ModalOpenStore.subscribe((value) => {
		modalOpen = value;
	});

    const unsubscribeSidedrawerOpenStore = TeamMemberSidedrawerOpenStore.subscribe((value) => {
		openTeamMember = value;
	});

	const unsubscribeTeamMemberSelectedStore = TeamMemberSelectedStore.subscribe((value) => {
		selectedTeamMemberId = value;
	});

    const unsubscribeEndorsedActionOpenStore = EndorsedActionOpenStore.subscribe((value) => {
		openEndorsedAction = value;
	});
    const unsubscribeEndorsedAmendmentOpenStore = EndorsedAmendmentOpenStore.subscribe((value) => {
		openEndorsedAmendment = value;
	});
    const unsubscribeEndorsedCandidateOpenStore = EndorsedCandidateOpenStore.subscribe((value) => {
		openEndorsedCandidate = value;
	});
    const unsubscribeEndorsedLegislationOpenStore = EndorsedLegislationOpenStore.subscribe((value) => {
		openEndorsedLegislation = value;
	});
    const unsubscribeEndorsedReferendumOpenStore = EndorsedReferendumOpenStore.subscribe((value) => {
		openEndorsedReferendum = value;
	});


	onDestroy(() => {
        unsubscribeModalOpenStore();
        unsubscribeSidedrawerOpenStore();
		unsubscribeTeamMemberSelectedStore();
        unsubscribeEndorsedActionOpenStore();
        unsubscribeEndorsedAmendmentOpenStore();
        unsubscribeEndorsedCandidateOpenStore();
        unsubscribeEndorsedLegislationOpenStore();
        unsubscribeEndorsedReferendumOpenStore();
	});

    $: if (
        openMobileNav ||
        openTeamMember ||
        modalOpen ||
        openEndorsedReferendum ||
        openEndorsedLegislation ||
        openEndorsedCandidate ||
        openEndorsedAmendment ||
        openEndorsedAction
    ) {
        open = !open;
    };

</script>

<div 
    class="backdrop"
    on:click={() => backdropClickedHandler()} 
    on:keydown={() => backdropClickedHandler()}
    aria-hidden={!open}
/>

<style>
    .backdrop {
        z-index: 49;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        background: #000000;
        opacity: 50%;
        cursor: pointer;
    }
</style>