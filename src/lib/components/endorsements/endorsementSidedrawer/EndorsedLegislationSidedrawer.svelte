<script lang="ts">
    import { EndorsedLegislationSelectedStore } from '$lib/stores/EndorsedLegislationSelectedStore';
    import { EndorsedLegislationOpenStore } from '$lib/stores/EndorsedLegislationOpenStore';
    import { onDestroy } from 'svelte';
    import CloseIcon from '$lib/images/icons/close_icon.svg?raw';
    import ExternalLinkIcon from '$lib/images/icons/external_link_icon.svg?raw';


    let endorsedLegislationData: LegislationWithImage | null = null;

    $: endorsedLegislationData;

    const unsubscribeEndorsedLegislationSelectedStore = EndorsedLegislationSelectedStore.subscribe(value => {
		endorsedLegislationData = value;
    });

    // set the value for the sidedrawer open value from store

    let endorsedLegislationOpen: boolean = false;

    // get the value for the sidedrawer open value from store

	const unsubscribeEndorsedLegislationOpenStore = EndorsedLegislationOpenStore.subscribe((value) => {
		endorsedLegislationOpen = value;
	});

    onDestroy(() => {
        unsubscribeEndorsedLegislationSelectedStore();
        unsubscribeEndorsedLegislationOpenStore();
    });

    const closeClickHandler = () => {
        endorsedLegislationOpen = false;
        EndorsedLegislationOpenStore.update((value) => value = endorsedLegislationOpen);
        EndorsedLegislationSelectedStore.update((value) => value = null);
    };

    let legislationStatus: string[] = [];

    $: legislationStatus;

    $: if (endorsedLegislationData?.passed_in_House === 1) {

        legislationStatus.push(" passed in the House");

    };
    
    $: if (endorsedLegislationData?.passed_in_Senate === 1) {

        legislationStatus.push(" passed in the Senate");

    };
    
    $: if (endorsedLegislationData?.rejected_in_House === 1) {

        legislationStatus.push(" rejected in the House");

    };
    
    $: if (endorsedLegislationData?.rejected_in_Senate === 1) {

        legislationStatus.push(" rejected in the Senate");

    };
    
    $: if (endorsedLegislationData?.vetoed_by_Executive === 1) {

        legislationStatus.push(" vetoed by the Executive");

    };
    
    $: if (endorsedLegislationData?.signed_by_Executive === 1) {
        
        legislationStatus.push(" signed into law by the Executive");

    };

    let statusString: string;

    $: if (legislationStatus.length > 0) {
        
        statusString = legislationStatus.toString();

    };

</script>

<aside 
    class={ (endorsedLegislationOpen) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ (endorsedLegislationOpen) ? 'false' : 'true'}
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
            <img src={endorsedLegislationData?.image_URL} alt={endorsedLegislationData?.alt_text} />
        </picture>
        <h3 class="legislation_name">
            {endorsedLegislationData?.legislation_name}
        </h3>
        <table>
            <colgroup>
                <col style="width:40%">
                <col style="width:60%">
            </colgroup>  
            <tbody>
                <tr>
                    <td>
                        year released:
                    </td>
                    <td>
                        {endorsedLegislationData?.year_released}
                    </td>
                </tr>
                <tr>
                    <td>
                        year introduced in the House:
                    </td>
                    <td>
                        {#if (endorsedLegislationData?.year_introduced_House)}
                            {endorsedLegislationData?.year_introduced_House}
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        year introduced in the Senate:
                    </td>
                    <td>
                        {#if (endorsedLegislationData?.year_introduced_Senate)}
                            {endorsedLegislationData?.year_introduced_Senate}
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        House session:
                    </td>
                    <td>
                        {#if (endorsedLegislationData?.session_House)}
                            {endorsedLegislationData?.session_House}
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        Senate session:
                    </td>
                    <td>
                        {#if (endorsedLegislationData?.session_Senate)}
                            {endorsedLegislationData?.session_Senate}
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        country: 
                    </td>
                    <td>
                        United States of America
                    </td>
                </tr>
                {#if (endorsedLegislationData?.state)}
                    <tr>
                        <td>
                            state: 
                        </td>
                        <td>
                            {endorsedLegislationData?.state}
                        </td>
                    </tr>
                {/if}
                {#if (endorsedLegislationData?.county)}
                    <tr>
                        <td>
                            county: 
                        </td>
                        <td>
                            {endorsedLegislationData?.county}
                        </td>
                    </tr>
                {/if}
                {#if (endorsedLegislationData?.city)}
                    <tr>
                        <td>
                            city: 
                        </td>
                        <td>
                            {endorsedLegislationData?.city}
                        </td>
                    </tr>
                {/if}
                
                <tr>
                    <td>
                        details: 
                    </td>
                    <td>
                        {#if (endorsedLegislationData?.details)}
                            {endorsedLegislationData?.details}
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        website: 
                    </td>
                    <td>
                        {#if (endorsedLegislationData?.website_URL)}
                            <a 
                                class="external_link_container"
                                href={endorsedLegislationData?.website_URL} 
                                target="_blank"
                            >
                                <div class="external_link_icon">
                                    {@html ExternalLinkIcon}
                                </div>
                                <div class="website_URL">
                                    {endorsedLegislationData?.website_URL} 
                                </div>
                            </a>
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        status: 
                    </td>
                    <td>
                        {#if (statusString)}
                            {statusString}
                        {/if}
                    </td>
                </tr>
            </tbody>
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
        background-color: #F8FAF7;
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
        background-color: #F8FAF7;
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
        background-color: #F8FAF7;
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

    .legislation_name {
        padding: 0 1rem;
        text-align: center;
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
        min-width: 1.5rem;
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