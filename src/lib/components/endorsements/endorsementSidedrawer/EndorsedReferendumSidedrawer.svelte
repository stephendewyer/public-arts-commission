<script lang="ts">
    import { EndorsedReferendumOpenStore } from '$lib/stores/EndorsedReferendumOpenStore';
    import { EndorsedReferendumSelectedStore } from '$lib/stores/EndorsedReferendumSelectedStore';
    import { onDestroy } from 'svelte';
    import CloseIcon from '$lib/images/icons/close_icon.svg?raw';
    import ExternalLinkIcon from '$lib/images/icons/external_link_icon.svg?raw';


    let endorsedReferendumSelected: ReferendumWithImage | null = null;

    const unsubscribeEndorsedReferendumSelectedStore = EndorsedReferendumSelectedStore.subscribe(value => {
		endorsedReferendumSelected = value;
    });

    // set the value for the sidedrawer open value from store

    let endorsedReferendumSidedrawerOpen: boolean = false;

    // get the value for the sidedrawer open value from store

	const unsubscribeEndorsedReferendumOpenStore = EndorsedReferendumOpenStore.subscribe((value) => {
		endorsedReferendumSidedrawerOpen = value;
	});

    onDestroy(() => {
        unsubscribeEndorsedReferendumSelectedStore();
        unsubscribeEndorsedReferendumOpenStore();
    });

    const closeClickHandler = () => {
        endorsedReferendumSidedrawerOpen = false;
        EndorsedReferendumOpenStore.update((value) => value = endorsedReferendumSidedrawerOpen);
        EndorsedReferendumSelectedStore.update((value) => value = null);
    }

</script>

<aside 
    class={ (endorsedReferendumSidedrawerOpen) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ (endorsedReferendumSidedrawerOpen) ? 'false' : 'true'}
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
            <img src={endorsedReferendumSelected?.image_URL} alt={endorsedReferendumSelected?.alt_text} />
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
        background-color: #CBC6C2;
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
        background-color: #CBC6C2;
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
        background-color: #CBC6C2;
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

    table {
        border-spacing: 0;
        width: 100%;
        table-layout: fixed;
    }

    tbody tr:nth-child(odd) {
        background-color: #CBC6C2;
    }

    tbody > tr > td {
        padding: 1rem;
        overflow-wrap: break-word;
        hyphens: auto;
        font-size: 1.25rem;
    }

    tbody td:nth-child(odd) {
        overflow-wrap: break-word;
        hyphens: auto;
        font-weight: 600;
        color: #28387C;
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-start;
    }

    .external_link_container {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        margin-right: 2rem;
    }

    .external_link_icon {
        width: 1.5rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .website_URL {
        overflow-wrap: break-word;
        width: 100%;
        font-size: 1.25rem;
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

        tbody > tr > td {
            padding: 0.75rem 1rem;
            overflow-wrap: break-word;
            hyphens: auto;
            font-size: 1.125rem;
        }

        .website_URL {
            font-size: 1.125rem;
        }

    }

    @media (max-width: 720px) {

        tbody > tr > td {
            padding: 0.5rem 1rem;
            overflow-wrap: break-word;
            hyphens: auto;
            font-size: 1rem;
        }

        .website_URL {
            font-size: 1rem;
        }

        .external_link_icon {
            width: 1rem;
            min-width: 1rem;
        }

    }

</style>