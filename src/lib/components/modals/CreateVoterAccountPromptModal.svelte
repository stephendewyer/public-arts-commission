<script lang="ts">
    import { CreateVoterAccountPromptStore } from '$lib/stores/CreateVoterAccountPromptStore';
    import { ModalOpenStore } from '$lib/stores/ModelOpenStore';
    import { onDestroy } from 'svelte';
    import ActionButton from '$lib/components/buttons/ActionButton.svelte';
    import CloseIcon from '$lib/images/icons/close_icon.svg?raw';


    let nominationCategory: string | null = null;

    const unsubscribeCreateVoterAccountPromptStore = CreateVoterAccountPromptStore.subscribe(n => {
		nominationCategory = n;
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
        CreateVoterAccountPromptStore.update((value) => value = null);
    };

    let action: string = "";

    $: if (nominationCategory === "actions") {

        action = "propose an action";

    } else if (
        nominationCategory === "candidate" ||
        nominationCategory === "legislation" ||
        nominationCategory === "referendum" ||
        nominationCategory === "amendment"
    ) {
        action = "make a nomination";
    };

    let openCreateVoterAccountPromptModal: boolean = false;

    $: if (modalOpen && (nominationCategory !== null)) {
        openCreateVoterAccountPromptModal = true;
    } else {
        openCreateVoterAccountPromptModal = false;
    };

</script>

<dialog open={openCreateVoterAccountPromptModal}
    class={(openCreateVoterAccountPromptModal) ? "dialog_open" : "dialog_closed"}
    aria-hidden={ (openCreateVoterAccountPromptModal) ? 'false' : 'true'}
>
    <div class="close_button_container">
        <button 
            class="close_button"
            on:click={() => closeClickHandler()}
            on:keyup={() => closeClickHandler()}
        >
            {@html CloseIcon}
        </button>
    </div>
    <div class="info_container">
        <h1 class="modal_heading">must have a voter account to {action}.</h1>
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
        margin: 0;
        padding: 1rem;
        top: 50%;
        left: 50%;
        -webkit-transform: translateX(-50%) translateY(-50%);
        -moz-transform: translateX(-50%) translateY(-50%);
        -ms-transform: translateX(-50%) translateY(-50%);
        transform: translateX(-50%) translateY(-50%);
        display: flex;
        flex-direction: column;
    }

    .dialog_open {
        display: flex;
    }

    .dialog_closed {
        display: none;
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

        .close_button {
            width: 2rem;
            margin: 1rem;
        }

    }

    @media (max-width: 720px) {

    }

</style>