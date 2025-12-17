<script lang="ts">
    import { TeamMemberSelectedStore } from '$lib/stores/TeamMemberSelectedStore';
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
    import { page } from '$app/state';
 
    export let openMobileNav: boolean = false;

    let openTeamMember: boolean = false;

    let modalOpen: boolean = $ModalOpenStore;

    let openEndorsedAction: boolean = $EndorsedActionOpenStore;

    let openEndorsedAmendment: boolean = $EndorsedAmendmentOpenStore;

    let openEndorsedCandidate: boolean = $EndorsedCandidateOpenStore;

    let openEndorsedLegislation: boolean = $EndorsedLegislationOpenStore;

    let openEndorsedReferendum: boolean = $EndorsedReferendumOpenStore;

    let open: boolean = false;

    let URLPathName = page.url.pathname;

    const backdropClickedHandler = () => {
        openMobileNav = false;
        $ModalOpenStore = false;
        $TeamMemberSidedrawerOpenStore = false;
        $TeamMemberSelectedStore = null;
        $EndorsedActionOpenStore = false;
        $EndorsedAmendmentOpenStore = false;
        $EndorsedLegislationOpenStore = false;
        $EndorsedCandidateOpenStore = false;
        $EndorsedReferendumOpenStore = false;
        $EndorsedActionSelectedStore = null;
        $EndorsedAmendmentSelectedStore = null;
        $EndorsedCandidateSelectedStore = null;
        $EndorsedLegislationSelectedStore = null;
        $EndorsedReferendumSelectedStore = null;
    };

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

<a 
    href={URLPathName} 
    data-sveltekit-noscroll
>
    <div 
        class="backdrop"
        on:click={() => backdropClickedHandler()} 
        on:keydown={() => backdropClickedHandler()}
        aria-hidden={!open}
    />
</a>

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