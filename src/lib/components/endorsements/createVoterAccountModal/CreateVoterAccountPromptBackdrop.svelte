<script lang="ts">
    import { CreateVoterAccountPromptStore } from '$lib/stores/CreateVoterAccountPromptStore';
    import { ModalOpenStore } from '$lib/stores/ModelOpenStore';
    import { onDestroy } from 'svelte';

    export let open: boolean = false;

    const backdropClickedHandler = () => {
        ModalOpenStore.update((value) => value = !value);
        CreateVoterAccountPromptStore.update((value) => value = null);
    }

	let selectedNominationCategory: string = "";
	
	const unsubscribeCreateVoterAccountPromptStore = CreateVoterAccountPromptStore.subscribe((value) => {
		selectedNominationCategory = value;
	});

	onDestroy(() => {
		unsubscribeCreateVoterAccountPromptStore();
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

    }
</style>