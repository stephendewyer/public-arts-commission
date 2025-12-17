<script lang="ts">
    import { EndorsedReferendumOpenStore } from '$lib/stores/EndorsedReferendumOpenStore';
    import { EndorsedReferendumSelectedStore } from '$lib/stores/EndorsedReferendumSelectedStore';
    import CloseIcon from '$lib/images/icons/close_icon.svg?raw';
    import ExternalLinkIcon from '$lib/images/icons/external_link_icon.svg?raw';
    import { page } from '$app/state';
    import { reverseHtmlEntities } from "$lib/utils/reverseHtmlEntities";
  import { afterNavigate } from '$app/navigation';

    export let pageSearch;

    $: if (!pageSearch) {
        $EndorsedReferendumOpenStore = false;
        $EndorsedReferendumSelectedStore = null;
    };

    let URLPathName: string = "";

    $: if ($EndorsedReferendumSelectedStore) {
        URLPathName = page.url.pathname;
    };

    const closeClickHandler = () => {
        $EndorsedReferendumOpenStore = false;
        $EndorsedReferendumSelectedStore = null;
    };

    let rawElectionDate: Date | string = "";

    let electionDate: string = "";

    $: if ($EndorsedReferendumSelectedStore?.election_date) {
        rawElectionDate = new Date($EndorsedReferendumSelectedStore?.election_date);
        electionDate = rawElectionDate?.toUTCString().substring(0, 16);
    };

    let referendumStatus: string[] = [];

    afterNavigate(() => {

        if ($EndorsedReferendumSelectedStore?.elected === 1) {

            referendumStatus = [...referendumStatus, " elected by voters"];

        };

        if ($EndorsedReferendumSelectedStore?.rejected === 1) {

            referendumStatus = [...referendumStatus, " rejected by voters"];

        };

        if ($EndorsedReferendumSelectedStore?.pending_election === 1) {

            referendumStatus = [...referendumStatus, " pending election by voters"];

        };

    });

    $: if ($EndorsedReferendumOpenStore) {
        referendumStatus = [];
    };

</script>

<aside 
    class={ ($EndorsedReferendumOpenStore) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ ($EndorsedReferendumOpenStore) ? 'false' : 'true'}
>
    {#key $EndorsedReferendumSelectedStore}
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
                <img src={$EndorsedReferendumSelectedStore?.image_URL} alt={reverseHtmlEntities($EndorsedReferendumSelectedStore?.alt_text)} />
            </picture>
            <h3 class="referendum_name">
                {reverseHtmlEntities($EndorsedReferendumSelectedStore?.referendum_name)}
            </h3>
            <table>
                <colgroup>
                    <col style="width:40%">
                    <col style="width:60%">
                </colgroup>  
                <tbody>
                    <tr>
                        <td>
                            starting year if enacted:
                        </td>
                        <td>
                            {$EndorsedReferendumSelectedStore?.starting_year_if_enacted ? $EndorsedReferendumSelectedStore.starting_year_if_enacted : ""}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            election date:
                        </td>
                        <td>
                            {electionDate ? electionDate : ""}
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
                    {#if ($EndorsedReferendumSelectedStore?.state)}
                        <tr>
                            <td>
                                state: 
                            </td>
                            <td>
                                {reverseHtmlEntities($EndorsedReferendumSelectedStore.state)}
                            </td>
                        </tr>
                    {/if}
                    {#if ($EndorsedReferendumSelectedStore?.county)}
                        <tr>
                            <td>
                                county: 
                            </td>
                            <td>
                                {reverseHtmlEntities($EndorsedReferendumSelectedStore.county)}
                            </td>
                        </tr>
                    {/if}
                    {#if ($EndorsedReferendumSelectedStore?.city)}
                        <tr>
                            <td>
                                city: 
                            </td>
                            <td>
                                {reverseHtmlEntities($EndorsedReferendumSelectedStore.city)}
                            </td>
                        </tr>
                    {/if}
                    <tr>
                        <td>
                            website: 
                        </td>
                        <td>
                            {#if ($EndorsedReferendumSelectedStore?.website_URL)}
                                <a 
                                    class="external_link_container"
                                    href={$EndorsedReferendumSelectedStore.website_URL} 
                                    target="_blank"
                                >
                                    <div class="external_link_icon">
                                        {@html ExternalLinkIcon}
                                    </div>
                                    <div class="website_URL">
                                        {$EndorsedReferendumSelectedStore.website_URL} 
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
                            {#key referendumStatus}
                                {reverseHtmlEntities(referendumStatus.toString())}
                            {/key}
                        </td>
                    </tr>
                </tbody>
            </table>  
            <div class="details_row">
                <p class="details_header">details</p>
                <p>
                    {reverseHtmlEntities($EndorsedReferendumSelectedStore?.details)} 
                </p>
            </div>    
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

    .referendum_name {
        padding: 1rem;
        text-align: left;
    }

    table {
        border-spacing: 0;
        width: 100%;
        table-layout: fixed;
    }

    tbody tr:nth-child(odd) {
        background-color: #DBE4D7;
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

    .details_row {
        background-color: #CBC6C2;
        padding: 1rem;
    }

    .details_row > p {
        hyphens: auto;
        font-size: 1.25rem;
    }

    .details_header {
        font-weight: 600;
        color: #28387C;
        text-align: center;
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

        .details_row > p {
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

        .details_row > p {
            font-size: 1rem;
        }

        .external_link_icon {
            width: 1rem;
            min-width: 1rem;
        }

    }

</style>