<script lang="ts">
    import { CampaignActionConfirmationStore } from '$lib/stores/CampaignActionConfirmationStore';
    import { CampaignActionConfirmedStore } from '$lib/stores/CampaignActionConfirmedStore';
    import { ModalOpenStore } from '$lib/stores/ModelOpenStore';
    import SubmitButtonSecondary from '../buttons/SubmitButtonSecondary.svelte';
    import CloseIcon from '$lib/images/icons/close_icon.svg?raw';

    let campaignApplication: CampaignApplicationWithImageRow | any;

    const closeClickHandler = () => {

        $ModalOpenStore = false;

        $CampaignActionConfirmationStore = {
            candidate_application: null,
            selected: null
        };

    };    

    const actionSubmitHandler = async () => {
        // confirm delete in store
        if ($CampaignActionConfirmationStore.candidate_application === null) {

            return;

        };

        $CampaignActionConfirmedStore = true;

        $ModalOpenStore = false;

        $CampaignActionConfirmationStore = {
            candidate_application: null,
            selected: null
        };

    };

    let actionConfirmationModalOpen: boolean = false;

    let campaignName: string;

    $: if ($ModalOpenStore && ($CampaignActionConfirmationStore.candidate_application !== null)) {

        actionConfirmationModalOpen = true;

        campaignApplication = $CampaignActionConfirmationStore.candidate_application;

        campaignName = campaignApplication.campaign_name;

    } else {

        actionConfirmationModalOpen = false;

    };

</script>

<dialog open={actionConfirmationModalOpen}
    class={(actionConfirmationModalOpen) ? "dialog_open" : "dialog_closed"}
    aria-hidden={ (actionConfirmationModalOpen) ? 'false' : 'true'}
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
        <h1 class="modal_heading">
            {#if $CampaignActionConfirmationStore.selected === "yes"}
                confirm endorsement for {campaignName}
            {:else if $CampaignActionConfirmationStore.selected === "no"}
                confirm do not endorse {campaignName}
            {/if}
        </h1>
        <form on:submit|preventDefault={actionSubmitHandler}>
            <SubmitButtonSecondary 
                disable={false}
            >
                {#if $CampaignActionConfirmationStore.selected === "yes"}
                    endorse
                {:else if $CampaignActionConfirmationStore.selected === "no"}
                    do not endorse
                {/if}
            </SubmitButtonSecondary>
        </form>
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
        text-align: center;
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