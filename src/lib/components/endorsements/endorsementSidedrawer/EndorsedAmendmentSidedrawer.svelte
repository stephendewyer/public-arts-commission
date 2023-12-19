<script lang="ts">
    import { EndorsedAmendmentSelectedStore } from '$lib/stores/EndorsedAmendmentSelectedStore';
    import { EndorsedAmendmentOpenStore } from '$lib/stores/EndorsedAmendmentOpenStore';
    import { onDestroy } from 'svelte';
    import CloseIcon from '$lib/images/icons/close_icon.svg?raw';


    let endorsedAmendmentData: AmendmentWithImage | null = null;

    const unsubscribeTeamMemberSelectedStore = EndorsedAmendmentSelectedStore.subscribe(value => {
		endorsedAmendmentData =value;
    });

    // set the value for the sidedrawer open value from store

    let endorsedAmendmentOpen: boolean = false;

    // get the value for the sidedrawer open value from store

	const unsubscribeEndorsedAmendmentOpenStore = EndorsedAmendmentOpenStore.subscribe((value) => {
		endorsedAmendmentOpen = value;
	});

    onDestroy(() => {
        unsubscribeTeamMemberSelectedStore();
        unsubscribeEndorsedAmendmentOpenStore();
    });

    const closeClickHandler = () => {
        endorsedAmendmentOpen = false;
        EndorsedAmendmentOpenStore.update((value) => value = endorsedAmendmentOpen);
        EndorsedAmendmentSelectedStore.update((value) => value = null);
    }

</script>

<aside 
    class={ (endorsedAmendmentOpen) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ (endorsedAmendmentOpen) ? 'false' : 'true'}
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
    <div>
        <picture>
            <img src={endorsedAmendmentData?.image_URL} alt={endorsedAmendmentData?.alt_text} />
        </picture>
    </div>
</aside>

<style>

    aside {
        z-index: 52;
    }

    .side_drawer_closed {
        position: fixed;
        height: 100vh;
        overflow-y: scroll;
        width: 100%;
        max-width: 40rem;
        background-color: #F4F4DB;
        top: 0;
        left: auto;
        right: 0;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    }

    .side_drawer_open {
        position: fixed;
        height: 100vh;
        overflow-y: scroll;
        width: 100%;
        max-width: 40rem;
        background-color: #F4F4DB;
        top: 0;
        right: 0;
        left: auto;
        transform: translateX(0);
        transition: transform 0.3s ease-in-out;
    }

    .close_button_container {
        position: sticky;
        position: -webkit-sticky;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        display: flex;
        background-color: #F4F4DB;
        justify-content: flex-end;
        border-bottom: #1C2226 2px solid;
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
        padding: 1rem 2rem;
    }

    .info_heading {
        text-decoration: underline;
        font-size: 1.5rem;
    }

    .urlAddress {
        overflow-wrap: break-word;
    }
    
    @media (max-width: 1140px) {

        .close_button {
            width: 2rem;
            margin: 1rem;
        }
        
        .side_drawer_closed {
            left: auto;
        }

        .side_drawer_open {
            left: auto;
        }

        .info_heading {
            font-size: 1.3rem;
        }

    }

    @media (max-width: 720px) {

        .info_heading {
            font-size: 1rem;
        }

    }

</style>