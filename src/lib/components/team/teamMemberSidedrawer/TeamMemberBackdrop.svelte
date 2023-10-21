<script lang="ts">
    import { TeamMemberSelectedStore } from '$lib/stores/TeamMemberSelectedStore';
    import { onDestroy } from 'svelte';
    import { SidedrawerOpenStore } from '$lib/stores/SidedrawerOpenStore';

    export let open: boolean = false;

    const backdropClickedHandler = () => {
        SidedrawerOpenStore.update((value) => value = !value);
        TeamMemberSelectedStore.update((value) => value = null);
    }

	let selectedTeamMemberId: number | null = null;

    // $: console.log(selectedTeamMemberId);
	
	const unsubscribeTeamMemberSelectedStore = TeamMemberSelectedStore.subscribe((value) => {
		selectedTeamMemberId = value;
	});

	onDestroy(() => {
		unsubscribeTeamMemberSelectedStore();
	});

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

    @media (min-width: 1140px) {

        /* .backdrop {
            display: none;
        } */

    }
</style>