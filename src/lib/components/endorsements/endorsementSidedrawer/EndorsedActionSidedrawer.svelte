<script lang="ts">
    import { EndorsedActionOpenStore } from '$lib/stores/EndorsedActionOpenStore';
    import { EndorsedActionSelectedStore } from '$lib/stores/EndorsedActionSelectedStore';
    import { onDestroy } from 'svelte';

    let endorsedActionData: ActionWithImage | null = null;

    const unsubscribeEndorsedActionSelectedStore = EndorsedActionSelectedStore.subscribe(value => {
		endorsedActionData = value;
    });

    // set the value for the sidedrawer open value from store

    let endorsedActionOpen: boolean = false;

    // get the value for the sidedrawer open value from store

	const unsubscribeEndorsedActionOpenStore = EndorsedActionOpenStore.subscribe((value) => {
		endorsedActionOpen = value;
	});

    onDestroy(() => {
        unsubscribeEndorsedActionSelectedStore();
        unsubscribeEndorsedActionOpenStore();
    });

    const closeClickHandler = () => {
        endorsedActionOpen = false;
        EndorsedActionOpenStore.update((value) => value = endorsedActionOpen);
        EndorsedActionSelectedStore.update((value) => value = null);
    }

</script>

<aside 
    class={ (endorsedActionOpen) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ (endorsedActionOpen) ? 'false' : 'true'}
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
    <div>
        <picture>
            <img src={endorsedActionData?.image_URL} alt={endorsedActionData?.alt_text} />
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
        background-color: #F4F5FB;
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
        background-color: #F4F5FB;
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
        background-color: #F4F5FB;
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