<script lang="ts">
    import { EndorsedCandidateOpenStore } from '$lib/stores/EndorsedCandidateOpenStore';
    import { EndorsedCandidateSelectedStore } from '$lib/stores/EndorsedCandidateSelectedStore';
    import { onDestroy } from 'svelte';

    let endorsedCandidateData: CandidateWithImage | null = null;

    const unsubscribeEndorsedCandidateSelectedStore = EndorsedCandidateSelectedStore.subscribe(value => {
		endorsedCandidateData = value;
    });

    // set the value for the sidedrawer open value from store

    let endorsedCandidateOpen: boolean = false;

    // get the value for the sidedrawer open value from store

	const unsubscribeEndorsedCandidateOpenStore = EndorsedCandidateOpenStore.subscribe((value) => {
		endorsedCandidateOpen = value;
	});

    onDestroy(() => {
        unsubscribeEndorsedCandidateSelectedStore();
        unsubscribeEndorsedCandidateOpenStore();
    });

    const closeClickHandler = () => {
        endorsedCandidateOpen = false;
        EndorsedCandidateOpenStore.update((value) => value = endorsedCandidateOpen);
        EndorsedCandidateSelectedStore.update((value) => value = null);
    };

    let primaryIsValid: boolean = true;

    let primaryElectionDate: Date | string;

    $: rawPrimaryElectionDate = new Date(endorsedCandidateData?.election_date_primary);

    let blankDate = new Date("2016-01-01T06:00:00.000Z");
    
    $: if (rawPrimaryElectionDate < blankDate) {

        primaryElectionDate = "";

        primaryIsValid = false;

    } else {

        primaryElectionDate = rawPrimaryElectionDate.toUTCString().substring(0, 16);;

    };

    let generalElectionDate: string = "";

    let rawGeneralElectionDate: Date;

    $: rawGeneralElectionDate = new Date(endorsedCandidateData?.election_date_general);

    $: generalElectionDate = rawGeneralElectionDate.toUTCString().substring(0, 16);

    let status: string[] = [];

    $: status;

    $: if (endorsedCandidateData?.running_in_primary === 1) {

        status.push(" running in the primary");

    };
    
    $: if (endorsedCandidateData?.elected_in_primary === 1) {

        status.push(" elected in the primary");

    };
    
    $: if (endorsedCandidateData?.rejected_in_primary === 1) {

        status.push(" rejected in the primary");

    };
    
    $: if (endorsedCandidateData?.running_in_general === 1) {

        status.push(" running in the general");

    };
    
    $: if (endorsedCandidateData?.rejected_in_general === 1) {

        status.push(" rejected in the general");

    };
    
    $: if (endorsedCandidateData?.elected_in_general === 1) {
        
        status.push(" elected in the general");

    };

    $: if (endorsedCandidateData?.campaign_ended === 1) {
        
        status.push(" campaign ended");

    };
    
</script>

<aside 
    class={ (endorsedCandidateOpen) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ (endorsedCandidateOpen) ? 'false' : 'true'}
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
            <img src={endorsedCandidateData?.image_URL} alt={endorsedCandidateData?.alt_text} />
        </picture>
        <h3>{endorsedCandidateData?.campaign_name}</h3>
        <table>
            <tr>
                <td>
                    primary election date:
                </td>
                <td>
                    {primaryElectionDate}
                </td>
            </tr>
            <tr>
                <td>
                    general election date:
                </td>
                <td>
                    {generalElectionDate}
                </td>
            </tr>
            <tr>
                <td>
                    starting year for office sought:
                </td>
                <td>
                    {endorsedCandidateData?.office_sought_starting_year}
                </td>
            </tr>
            <tr>
                <td>
                    electorate: 
                </td>
                <td>
                    {endorsedCandidateData?.electorate}
                </td>
            </tr>
            {#if (endorsedCandidateData?.state)}
                <tr>
                    <td>
                        state: 
                    </td>
                    <td>
                        {endorsedCandidateData?.state}
                    </td>
                </tr>
            {/if}
            {#if (endorsedCandidateData?.county)}
                <tr>
                    <td>
                        county: 
                    </td>
                    <td>
                        {endorsedCandidateData?.county}
                    </td>
                </tr>
            {/if}
            {#if (endorsedCandidateData?.city)}
                <tr>
                    <td>
                        city: 
                    </td>
                    <td>
                        {endorsedCandidateData?.city}
                    </td>
                </tr>
            {/if}
            <tr>
                <td>
                    party: 
                </td>
                <td>
                    {endorsedCandidateData?.party}
                </td>
            </tr>
            <tr>
                <td>
                    website: 
                </td>
                <td>
                    {endorsedCandidateData?.website_URL}
                </td>
            </tr>
            <tr>
                <td>
                    status: 
                </td>
                <td>
                    {#each status as item, i}
                        {#if (i === status.length -1)}
                            {item}
                        {:else}
                            {item},
                        {/if}
                    {/each}
                </td>
            </tr>
        </table>
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
        background-color: #FBEFF6;
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
        background-color: #FBEFF6;
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
        background-color: #FBEFF6;
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