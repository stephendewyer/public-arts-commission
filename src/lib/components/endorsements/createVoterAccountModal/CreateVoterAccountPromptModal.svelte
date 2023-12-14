<script lang="ts">
    import { CreateVoterAccountPromptStore } from '$lib/stores/CreateVoterAccountPromptStore';
    import { ModalOpenStore } from '$lib/stores/ModelOpenStore';
    import { onDestroy } from 'svelte';
    import ActionButton from '$lib/components/buttons/ActionButton.svelte';

    let nomainationCategory: string = "";

    const unsubscribeCreateVoterAccountPromptStore = CreateVoterAccountPromptStore.subscribe(n => {
		nomainationCategory = n;
    });

    // set the value for the sidedrawer open value from store

    let modalOpen: boolean = false;

    // get the value for the sidedrawer open value from store

	const unsubscribeModalOpenStore = ModalOpenStore.subscribe((value) => {
		modalOpen = value;
	});

    onDestroy(() => {
        unsubscribeCreateVoterAccountPromptStore();
        unsubscribeModalOpenStore();
    });

    const closeClickHandler = () => {
        modalOpen = false;
        ModalOpenStore.update((value) => value = modalOpen);
        CreateVoterAccountPromptStore.update((value) => value = "");
    };

</script>

<dialog open={modalOpen}
    aria-hidden={ (modalOpen) ? 'false' : 'true'}
>
    <div class="close_button_container">
        <button 
            class="close_button"
            on:click={() => closeClickHandler()}
            on:keyup={() => closeClickHandler()}
        >
            <svg 
                id="Layer_1" 
                data-name="Layer 1" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 442.55 442.56"
            >
                <defs>
                <style>
                    .cls-10 {
                    fill: inherit;
                    stroke-width: 0px;
                    }
                </style>
                </defs>
                <polygon class="cls-10" points="278.2 221.28 442.55 385.63 385.63 442.56 221.28 278.21 56.93 442.56 0 385.63 164.35 221.28 0 56.93 56.93 0 221.28 164.35 385.63 0 442.55 56.93 278.2 221.28"/>
            </svg>
        </button>
    </div>
    <div class="info_container">
        <h1 class="modal_heading">must have a voter account to make a nomination.</h1>
        <h2 class="modal_heading_02">already have an account?</h2>
        <a 
            href="/login-voter"
            on:click={() => closeClickHandler()}
            on:keyup={() => closeClickHandler()}
        >
            <ActionButton 
                disable={false}
            >
                voter login
            </ActionButton>
        </a>
        <h2 class="modal_heading_02">don't have an account?</h2>
        <a 
            href="/create-account-voter"
            on:click={() => closeClickHandler()}
            on:keyup={() => closeClickHandler()}
        >
            <ActionButton
                disable={false}
            >
                create voter account
            </ActionButton>
        </a>
    </div>
</dialog>

<style>

    dialog {
        z-index: 52;
        border: none;
        position: fixed;
        background-color: #F4F5FB;
        width: 100%;
        max-width: 40rem;
        padding: 1rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        flex-direction: column;
    }

    .close_button_container {
        position: sticky;
        position: -webkit-sticky;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        display: flex;
        background-color: #F4F5FB;
        justify-content: flex-end;
    }

    .close_button {
        outline: none;
        border: none;
        background-color: transparent;
        fill: #4C4239;
        transition: fill 0.2s linear;
        width: 3rem;
        margin: 1rem;
        cursor: pointer;
        
    }

    .close_button:hover {
        fill: #CB6D44;
    }

    .info_container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0 1rem;
    }

    .modal_heading{
        margin: 0;
    }

    .modal_heading_02 {
        margin: 0;
        text-align: center;
    }
    
    @media (max-width: 1140px) {

        dialog {

        }

        .close_button {
            width: 2rem;
            margin: 1rem;
        }

    }

    @media (max-width: 720px) {

    }

</style>