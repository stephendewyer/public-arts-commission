<script lang="ts">
    import { EndorsedAmendmentSelectedStore } from '$lib/stores/EndorsedAmendmentSelectedStore';
    import { EndorsedAmendmentOpenStore } from '$lib/stores/EndorsedAmendmentOpenStore';
    import CloseIcon from '$lib/images/icons/close_icon.svg?raw';
    import ExternalLinkIcon from '$lib/images/icons/external_link_icon.svg?raw';
    import { page } from '$app/state';
    import { reverseHtmlEntities } from "$lib/utils/reverseHtmlEntities";
    import { afterNavigate } from '$app/navigation';

    export let pageSearch;

    $: if (!pageSearch) {
        $EndorsedAmendmentOpenStore = false;
        $EndorsedAmendmentSelectedStore = null;
    };

    let URLPathName: string = "";

    $: if ($EndorsedAmendmentSelectedStore) {
        URLPathName = page.url.pathname;
    };

    const closeClickHandler = () => {
        $EndorsedAmendmentOpenStore = false;
        $EndorsedAmendmentSelectedStore = null;
    };

    let rawElectionDate: Date | string = "";
    let electionDate: Date | string = "";
    let blankDate = new Date("2016-01-01T06:00:00.000Z");

    $: if ($EndorsedAmendmentSelectedStore?.election_date) {
        rawElectionDate = new Date ($EndorsedAmendmentSelectedStore.election_date);
        if (rawElectionDate < blankDate) {
            electionDate = ""; 
        } else {
            electionDate = rawElectionDate.toUTCString().substring(0, 16);
        };
    };

    let amendmentStatus: string[] = [];

    afterNavigate(() => {

        if ($EndorsedAmendmentSelectedStore?.introduced_in_House === 1) {

            amendmentStatus = [...amendmentStatus, " introduced in the House"];

        };

        if ($EndorsedAmendmentSelectedStore?.introduced_in_Senate === 1) {

            amendmentStatus = [...amendmentStatus, " introduced in the Senate"];

        };

        if ($EndorsedAmendmentSelectedStore?.twothirds_House_and_Senate_passed === 1) {

            amendmentStatus = [...amendmentStatus, " passed by two-thirds majorities in the House and Senate"];

        };

        if ($EndorsedAmendmentSelectedStore?.simple_majority_House_and_Senate_passed === 1) {

            amendmentStatus = [...amendmentStatus, " passed by simple majorities in the House and Senate"];

        };

        if ($EndorsedAmendmentSelectedStore?.simple_majority_voters_passed === 1) {

            amendmentStatus = [...amendmentStatus, " passed by a simple majority of voters"];

        };


        if ($EndorsedAmendmentSelectedStore?.ratified_by_state_convenctions === 1) {

            amendmentStatus = [...amendmentStatus, " ratified by three-fourths of state conventions called in each state"];

        };

        if ($EndorsedAmendmentSelectedStore?.ratified_by_state_legislatures === 1) {

            amendmentStatus = [...amendmentStatus, " ratified by three-fourths of state legislatures"];

        };

    });

    let sponsorsHouse: SponsorHouse[];
    let sponsorsSenate: SponsorSenate[];
    let coSponsorsHouse: CoSponsorHouse[];
    let coSponsorsSenate: CoSponsorSenate[];

    let sponsorsHouseNames: string[] = [];
    let sponsorsSenateNames: string[] = [];
    let coSponsorsHouseNames: string[] = [];
    let coSponsorsSenateNames: string[] = [];

    afterNavigate(() => {
        if ($EndorsedAmendmentSelectedStore?.sponsors_House) {

            sponsorsHouse = $EndorsedAmendmentSelectedStore?.sponsors_House;

            sponsorsHouse.forEach((sponsor) => {

                sponsorsHouseNames = [...sponsorsHouseNames, sponsor.sponsor_name];
            
            });

        };

        if ($EndorsedAmendmentSelectedStore?.sponsors_Senate) {

            sponsorsSenate = $EndorsedAmendmentSelectedStore?.sponsors_Senate;

            sponsorsSenate.forEach((sponsor) => {

                sponsorsSenateNames = [...sponsorsSenateNames, sponsor.sponsor_name];

            });

        };

        if ($EndorsedAmendmentSelectedStore?.co_sponsors_House) {

            coSponsorsHouse = $EndorsedAmendmentSelectedStore?.co_sponsors_House;

            coSponsorsHouse.forEach((sponsor) => {

                coSponsorsHouseNames = [...coSponsorsHouseNames, sponsor.co_sponsor_name];

            });

        };

        if ($EndorsedAmendmentSelectedStore?.co_sponsors_Senate) {

            coSponsorsSenate = $EndorsedAmendmentSelectedStore?.co_sponsors_Senate;

            coSponsorsSenate.forEach((sponsor) => {

                coSponsorsSenateNames = [...coSponsorsSenateNames, sponsor.co_sponsor_name];

            });

        };

    });

    $: if (!$EndorsedAmendmentOpenStore) {
        amendmentStatus = [];
        sponsorsHouse = [];
        sponsorsSenate = [];
        coSponsorsHouse = [];
        coSponsorsSenate = [];
        sponsorsHouseNames = [];
        sponsorsSenateNames = [];
        coSponsorsHouseNames = [];
        coSponsorsSenateNames = [];
    };

</script>

<aside 
    class={ ($EndorsedAmendmentOpenStore) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ ($EndorsedAmendmentOpenStore) ? 'false' : 'true'}
>
    {#key $EndorsedAmendmentSelectedStore}
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
                <img src={$EndorsedAmendmentSelectedStore?.image_URL} alt={reverseHtmlEntities($EndorsedAmendmentSelectedStore?.alt_text)} />
            </picture>
            <h3 class="amendment_name">
                {reverseHtmlEntities($EndorsedAmendmentSelectedStore?.amendment_name)}
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
                            {$EndorsedAmendmentSelectedStore?.year_released ? $EndorsedAmendmentSelectedStore.year_released : ""}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            year introduced in the House:
                        </td>
                        <td>
                            {$EndorsedAmendmentSelectedStore?.year_introduced_House ? $EndorsedAmendmentSelectedStore.year_introduced_House : ""}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            year introduced in the Senate:
                        </td>
                        <td>
                            {$EndorsedAmendmentSelectedStore?.year_introduced_Senate ? $EndorsedAmendmentSelectedStore.year_introduced_Senate : ""}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            House session:
                        </td>
                        <td>
                            {$EndorsedAmendmentSelectedStore?.session_House ? $EndorsedAmendmentSelectedStore.session_House : ""}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Senate session:
                        </td>
                        <td>
                            {$EndorsedAmendmentSelectedStore?.session_Senate ? $EndorsedAmendmentSelectedStore.session_Senate : ""}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            election date:
                        </td>
                        <td>
                            {#key (electionDate)}
                                {electionDate ? electionDate : ""}
                            {/key}
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
                    {#if ($EndorsedAmendmentSelectedStore?.state)}
                        <tr>
                            <td>
                                state: 
                            </td>
                            <td>
                                {reverseHtmlEntities($EndorsedAmendmentSelectedStore.state)}
                            </td>
                        </tr>
                    {/if}
                    {#if ($EndorsedAmendmentSelectedStore?.county)}
                        <tr>
                            <td>
                                county: 
                            </td>
                            <td>
                                {reverseHtmlEntities($EndorsedAmendmentSelectedStore.county)}
                            </td>
                        </tr>
                    {/if}
                    {#if ($EndorsedAmendmentSelectedStore?.city)}
                        <tr>
                            <td>
                                city: 
                            </td>
                            <td>
                                {reverseHtmlEntities($EndorsedAmendmentSelectedStore.city)}
                            </td>
                        </tr>
                    {/if}
                    <tr>
                        <td>
                            House sponsor: 
                        </td>
                        <td>
                            {#key sponsorsHouseNames}
                                {sponsorsHouseNames.length > 0 ? reverseHtmlEntities(sponsorsHouseNames.join(', ').toString()) : ""}
                            {/key}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            House co-sponsor(s): 
                        </td>
                        <td>
                            <ol class="co-sponsors">
                                {#key coSponsorsHouseNames}
                                    {#each coSponsorsHouseNames as coSponsorHouseName, i}
                                        <li>
                                            {reverseHtmlEntities(coSponsorHouseName)}
                                        </li>
                                    {/each}
                                {/key}
                            </ol>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Senate sponsor: 
                        </td>
                        <td>
                            {#key sponsorsSenateNames}
                                {sponsorsSenateNames.length > 0 ? reverseHtmlEntities(sponsorsSenateNames.join(', ').toString()) : ""}
                            {/key}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Senate co-sponsor(s): 
                        </td>
                        <td>
                            <ol class="co-sponsors">
                                {#key coSponsorsSenateNames}
                                    {#each coSponsorsSenateNames as coSponsorSenateName, i}
                                        <li>
                                            {reverseHtmlEntities(coSponsorSenateName)}
                                        </li>
                                    {/each}
                                {/key}
                            </ol>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            website: 
                        </td>
                        <td>
                            {#if ($EndorsedAmendmentSelectedStore?.website_URL)}
                                <a 
                                    class="external_link_container"
                                    href={$EndorsedAmendmentSelectedStore.website_URL} 
                                    target="_blank"
                                >
                                    <div class="external_link_icon">
                                        {@html ExternalLinkIcon}
                                    </div>
                                    <div class="website_URL">
                                        {$EndorsedAmendmentSelectedStore.website_URL} 
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
                            {#key amendmentStatus}
                                {amendmentStatus.length > 0 ? reverseHtmlEntities(amendmentStatus.toString()) : ""}
                            {/key}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="details_row">
                <p class="details_header">details</p>
                <p>
                    {$EndorsedAmendmentSelectedStore ? reverseHtmlEntities($EndorsedAmendmentSelectedStore.details) : ""} 
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
        overflow-y: auto;
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

    .amendment_name {
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

    .co-sponsors {
        width: 100%;
        height: auto;
        max-height: 16rem;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        overflow-x: auto;
        list-style-position: inside;
        padding: 0;
    }

    .co-sponsors > li {
        margin: 0;
        padding: 0 1rem 0 0;
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

    ol {
        margin: 0;
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