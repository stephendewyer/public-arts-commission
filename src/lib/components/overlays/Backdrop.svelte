<script lang="ts">
    import { TeamMemberSelectedStore } from '$lib/stores/TeamMemberSelectedStore';
    import { onDestroy } from 'svelte';
    import { TeamMemberSidedrawerOpenStore } from '$lib/stores/TeamMemberSidedrawerOpenStore';
    import { ModalOpenStore } from '$lib/stores/ModelOpenStore';

    export let openMobileNav: boolean = false;

    export let openTeamMember: boolean = false;

    export let openCreateVoterAccountPrompt: boolean = false;

    let open: boolean = false;

    let selectedTeamMemberId: number | null = null;


    const backdropClickedHandler = () => {
        openMobileNav = false;
        ModalOpenStore.update((value) => value = false);
        TeamMemberSidedrawerOpenStore.update((value) => value = false);
        TeamMemberSelectedStore.update((value) => value = null);

    };

    const unsubscribeModalOpenStore = ModalOpenStore.subscribe((value) => {
		openCreateVoterAccountPrompt = value;
	});

    const unsubscribeSidedrawerOpenStore = TeamMemberSidedrawerOpenStore.subscribe((value) => {
		openTeamMember = value;
	});

	const unsubscribeTeamMemberSelectedStore = TeamMemberSelectedStore.subscribe((value) => {
		selectedTeamMemberId = value;
	});

	onDestroy(() => {
        unsubscribeModalOpenStore();
        unsubscribeSidedrawerOpenStore();
		unsubscribeTeamMemberSelectedStore();
	});

    $: if (
        openMobileNav ||
        openTeamMember ||
        openCreateVoterAccountPrompt
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