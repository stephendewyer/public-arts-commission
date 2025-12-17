<script lang="ts">
    import { EndorsedCandidateOpenStore } from '$lib/stores/EndorsedCandidateOpenStore';
    import { EndorsedCandidateSelectedStore } from '$lib/stores/EndorsedCandidateSelectedStore';
    import CloseIcon from '$lib/images/icons/close_icon.svg?raw';
    import ExternalLinkIcon from '$lib/images/icons/external_link_icon.svg?raw';
    import { page } from '$app/state';
    import { reverseHtmlEntities } from "$lib/utils/reverseHtmlEntities";
    import { afterNavigate } from '$app/navigation';
    
    export let pageSearch;

    $: if (!pageSearch) {
        $EndorsedCandidateOpenStore = false;
        $EndorsedCandidateSelectedStore = null;
    };

    let URLPathName: string = "";

    $: if ($EndorsedCandidateSelectedStore) {
        URLPathName = page.url.pathname;
    };

    const closeClickHandler = () => {
        $EndorsedCandidateOpenStore = false;
        $EndorsedCandidateSelectedStore = null;
    };

    let primaryElectionDate: Date | string = "";

    $: rawPrimaryElectionDate = new Date($EndorsedCandidateSelectedStore?.election_date_primary);

    let blankDate = new Date("2016-01-01T06:00:00.000Z");
    
    $: if (rawPrimaryElectionDate < blankDate) {
        primaryElectionDate = "";
    } else {
        primaryElectionDate = rawPrimaryElectionDate.toUTCString().substring(0, 16);;
    };

    let generalElectionDate: string = "";

    let rawGeneralElectionDate: Date | string = "";

    $: rawGeneralElectionDate = new Date($EndorsedCandidateSelectedStore?.election_date_general);

    $: generalElectionDate = rawGeneralElectionDate.toUTCString().substring(0, 16);

    let candidateStatus: string[] = [];

    afterNavigate(() => {
        if ($EndorsedCandidateSelectedStore?.running_in_primary === 1) {
            candidateStatus = [ ...candidateStatus, " running in the primary"];
        };

        if ($EndorsedCandidateSelectedStore?.elected_in_primary === 1) {
            candidateStatus = [ ...candidateStatus, " elected in the primary"];
        };

        if ($EndorsedCandidateSelectedStore?.rejected_in_primary === 1) {
            candidateStatus = [ ...candidateStatus, " rejected in the primary"];
        };
        
        if ($EndorsedCandidateSelectedStore?.running_in_general === 1) {
            candidateStatus = [ ...candidateStatus, " running in the general"];
        };

        if ($EndorsedCandidateSelectedStore?.rejected_in_general === 1) {
            candidateStatus = [ ...candidateStatus, " rejected in the general"];
        };

        if ($EndorsedCandidateSelectedStore?.elected_in_general === 1) {
            candidateStatus = [ ...candidateStatus, " elected in the general"];
        };

        if ($EndorsedCandidateSelectedStore?.campaign_ended === 1) {
            candidateStatus = [ ...candidateStatus, " campaign ended"];
        };
    })

    $: if (!$EndorsedCandidateOpenStore) {
        candidateStatus = [];
    };

</script>


<aside 
    class={ ($EndorsedCandidateOpenStore) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ ($EndorsedCandidateOpenStore) ? 'false' : 'true'}
>
    {#key $EndorsedCandidateSelectedStore}
        <div class="close_button_container">
            <a 
                href={URLPathName}
                data-sveltekit-noscroll
            >
                <button 
                    class="close_button"
                    on:click={() => closeClickHandler()}
                    on:keyup={() => closeClickHandler()}
                >
                    {@html CloseIcon}
                </button>
            </a>
        </div>
        <div>
            <picture>
                <img src={$EndorsedCandidateSelectedStore?.image_URL} alt={reverseHtmlEntities($EndorsedCandidateSelectedStore?.alt_text)} />
            </picture>
            <h3 class="campaign_name">{reverseHtmlEntities($EndorsedCandidateSelectedStore?.campaign_name)}</h3>
            <table>
                <colgroup>
                    <col style="width:40%">
                    <col style="width:60%">
                </colgroup>  
                <tbody>
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
                            {$EndorsedCandidateSelectedStore?.office_sought_starting_year}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            electorate: 
                        </td>
                        <td>
                            {reverseHtmlEntities($EndorsedCandidateSelectedStore?.electorate)}
                        </td>
                    </tr>
                    {#if ($EndorsedCandidateSelectedStore?.state)}
                        <tr>
                            <td>
                                state: 
                            </td>
                            <td>
                                {reverseHtmlEntities($EndorsedCandidateSelectedStore?.state)}
                            </td>
                        </tr>
                    {/if}
                    {#if ($EndorsedCandidateSelectedStore?.county)}
                        <tr>
                            <td>
                                county: 
                            </td>
                            <td>
                                {reverseHtmlEntities($EndorsedCandidateSelectedStore?.county)}
                            </td>
                        </tr>
                    {/if}
                    {#if ($EndorsedCandidateSelectedStore?.city)}
                        <tr>
                            <td>
                                city: 
                            </td>
                            <td>
                                {reverseHtmlEntities($EndorsedCandidateSelectedStore?.city)}
                            </td>
                        </tr>
                    {/if}
                    <tr>
                        <td>
                            party: 
                        </td>
                        <td>
                            {reverseHtmlEntities($EndorsedCandidateSelectedStore?.party)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            website: 
                        </td>
                        <td>
                            {#if ($EndorsedCandidateSelectedStore?.website_URL)}
                                <a 
                                    class="external_link_container"
                                    href={$EndorsedCandidateSelectedStore?.website_URL} 
                                    target="_blank"
                                >
                                    <div class="external_link_icon">
                                        {@html ExternalLinkIcon}
                                    </div>
                                    <div class="website_URL">
                                        {$EndorsedCandidateSelectedStore?.website_URL} 
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
                            {#key candidateStatus}
                                {reverseHtmlEntities(candidateStatus.toString())}
                            {/key}
                        </td>
                    </tr>
                </tbody>
                
            </table>
        </div>
    {/key}
</aside>

<style>

    aside {
        z-index: 52;
    }

    .side_drawer_closed {
        position: fixed;
        height: 100vh;
        overflow-y: auto;
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
        overflow-y: auto;
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

    .campaign_name {
        padding: 1rem;
        text-align: left;
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