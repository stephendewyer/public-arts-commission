<script lang="ts">
    import { EndorsedActionOpenStore } from '$lib/stores/EndorsedActionOpenStore';
    import { EndorsedActionSelectedStore } from '$lib/stores/EndorsedActionSelectedStore';
    import CloseIcon from '$lib/images/icons/close_icon.svg?raw';
    import ExternalLinkIcon from '$lib/images/icons/external_link_icon.svg?raw';
    import { page } from '$app/state';
    import { reverseHtmlEntities } from "$lib/utils/reverseHtmlEntities";
    
    export let pageSearch;

    $: if (!pageSearch) {
        $EndorsedActionOpenStore = false;
        $EndorsedActionSelectedStore = null;
    };

    let URLPathName: string;

    $: if ($EndorsedActionSelectedStore) {
        URLPathName = page.url.pathname;
    };

    const closeClickHandler = () => {
        $EndorsedActionOpenStore = false;
        $EndorsedActionSelectedStore = null;
    };

    let actionIsAllDay: boolean = false;
    let rawAllDayActionDate: Date | string = "";
    let allDayActionDate: string = "";
    let actionRawStartDate: Date | string = "";
    let actionStartDate: string = "";
    let actionRawEndDate: Date | string = "";
    let actionEndDate: string = ""

    $: if ($EndorsedActionSelectedStore?.all_day_event) {
        actionIsAllDay = $EndorsedActionSelectedStore?.all_day_event;
    };

    $: if ($EndorsedActionSelectedStore?.all_day_event_date) {
        rawAllDayActionDate = new Date($EndorsedActionSelectedStore?.all_day_event_date);
        allDayActionDate = rawAllDayActionDate?.toUTCString().substring(0, 16);
    };

    $: if ($EndorsedActionSelectedStore?.date_start) {
        actionRawStartDate = new Date($EndorsedActionSelectedStore?.date_start);
        actionStartDate = actionRawStartDate.toUTCString();
    };

    $: if ($EndorsedActionSelectedStore?.date_end) {
        actionRawEndDate = new Date($EndorsedActionSelectedStore?.date_end);
        actionEndDate = actionRawEndDate.toUTCString();
    };

</script>

<aside 
    class={ ($EndorsedActionOpenStore) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ ($EndorsedActionOpenStore) ? 'false' : 'true'}
>
    {#key $EndorsedActionOpenStore}
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
                <img src={$EndorsedActionSelectedStore?.image_URL} alt={reverseHtmlEntities($EndorsedActionSelectedStore?.alt_text)} />
            </picture>
            <h3 class="action_name">{reverseHtmlEntities($EndorsedActionSelectedStore?.action_name)}</h3>
            <table>
                <colgroup>
                    <col style="width:40%">
                    <col style="width:60%">
                </colgroup>  
                <tbody>
                    <tr>
                        <td>
                            date(s):
                        </td>
                        <td>
                            {#if (actionIsAllDay)}
                                {allDayActionDate}
                            {:else if (!actionIsAllDay)}
                                {actionStartDate} - {actionEndDate}
                            {/if}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            time:
                        </td>
                        <td>
                            {#if (actionIsAllDay)}
                            all day
                            {:else}
                                {$EndorsedActionSelectedStore?.time_start} - {$EndorsedActionSelectedStore?.time_end}
                            {/if}
                        </td>
                    </tr>
                    {#if ($EndorsedActionSelectedStore?.time_zone)}
                        <tr>
                            <td>
                                time zone:
                            </td>
                            <td>
                                
                                {$EndorsedActionSelectedStore?.time_zone}
                            </td>
                        </tr>
                    {/if}
                    {#if ($EndorsedActionSelectedStore?.action_street_address)}
                        <tr>
                            <td>
                                street address: 
                            </td>
                            <td>
                                {reverseHtmlEntities($EndorsedActionSelectedStore?.action_street_address)}
                            </td>
                        </tr>
                    {/if}
                    {#if ($EndorsedActionSelectedStore?.action_street_address_02)}
                        <tr>
                            <td>
                                street address 02: 
                            </td>
                            <td>
                                {reverseHtmlEntities($EndorsedActionSelectedStore?.action_street_address_02)}
                            </td>
                        </tr>
                    {/if}
                    {#if ($EndorsedActionSelectedStore?.action_city)}
                        <tr>
                            <td>
                                city: 
                            </td>
                            <td>
                                {reverseHtmlEntities($EndorsedActionSelectedStore?.action_city)}
                            </td>
                        </tr>
                    {/if}
                    {#if ($EndorsedActionSelectedStore?.action_state)}
                        <tr>
                            <td>
                                state: 
                            </td>
                            <td>
                                {reverseHtmlEntities($EndorsedActionSelectedStore?.action_state)}
                            </td>
                        </tr>
                    {/if}
                    {#if ($EndorsedActionSelectedStore?.action_zip_code)}
                        <tr>
                            <td>
                                zip code: 
                            </td>
                            <td>
                                {$EndorsedActionSelectedStore?.action_zip_code}
                            </td>
                        </tr>
                    {/if}
                    <tr>
                        <td>
                            country:
                        </td>
                        <td>
                            United States of America
                        </td>
                    </tr>
                    <tr>
                        <td>
                            website: 
                        </td>
                        <td>
                            {#if ($EndorsedActionSelectedStore?.website_URL)}
                                <a 
                                    class="external_link_container"
                                    href={$EndorsedActionSelectedStore?.website_URL} 
                                    target="_blank"
                                >
                                    <div class="external_link_icon">
                                        {@html ExternalLinkIcon}
                                    </div>
                                    <div class="website_URL">
                                        {$EndorsedActionSelectedStore?.website_URL} 
                                    </div>
                                </a>
                            {/if}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="details_row">
                <p class="details_header">details</p>
                <p>
                    {reverseHtmlEntities($EndorsedActionSelectedStore?.details)} 
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
        overflow-y: auto;
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
        overflow-y: auto;
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

    .action_name {
        padding: 1rem;
        text-align: left;
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

        .details_row > p {
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