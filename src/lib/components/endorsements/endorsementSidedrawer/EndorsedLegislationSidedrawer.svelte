<script lang="ts">
    import { EndorsedLegislationSelectedStore } from '$lib/stores/EndorsedLegislationSelectedStore';
    import { EndorsedLegislationOpenStore } from '$lib/stores/EndorsedLegislationOpenStore';
    import CloseIcon from '$lib/images/icons/close_icon.svg?raw';
    import ExternalLinkIcon from '$lib/images/icons/external_link_icon.svg?raw';
    import { page } from '$app/stores';

    export let pageSearch;

    $: if (!pageSearch) {
        $EndorsedLegislationOpenStore = false;
        $EndorsedLegislationSelectedStore = null;
    };

    let endorsedLegislationData: LegislationWithSponsorsAndImage | null = null;

    $: endorsedLegislationData = $EndorsedLegislationSelectedStore;

    let URLPathName: string;

    $: if (endorsedLegislationData) {

        URLPathName = $page.url.pathname;

    }; 

    let sponsorsHouse: SponsorHouse[] = [];
    let sponsorsSenate: SponsorSenate[]  = [];
    let coSponsorsHouse: CoSponsorHouse[]  = [];
    let coSponsorsSenate: CoSponsorSenate[]  = [];

    let sponsorsHouseNames: string[] = [];
    let sponsorsSenateNames: string[] = [];
    let coSponsorsHouseNames: string[] = [];
    let coSponsorsSenateNames: string[] = [];

    let endorsedLegislationOpen: boolean = false;

    $: endorsedLegislationOpen = $EndorsedLegislationOpenStore;

    const closeClickHandler = () => {

        $EndorsedLegislationOpenStore = false;
        $EndorsedLegislationSelectedStore = null;

    };

    let legislationStatus: string[] = [];

    $: if (endorsedLegislationData?.passed_in_House === 1) {

        legislationStatus = [...legislationStatus, " passed in the House"];

    };
    
    $: if (endorsedLegislationData?.passed_in_Senate === 1) {

        legislationStatus = [...legislationStatus, " passed in the Senate"];

    };
    
    $: if (endorsedLegislationData?.rejected_in_House === 1) {

        legislationStatus = [...legislationStatus, " rejected in the House"];

    };
    
    $: if (endorsedLegislationData?.rejected_in_Senate === 1) {

        legislationStatus = [...legislationStatus, " rejected in the Senate"];

    };
    
    $: if (endorsedLegislationData?.vetoed_by_Executive === 1) {

        legislationStatus = [...legislationStatus, " vetoed by the Executive"];

    };
    
    $: if (endorsedLegislationData?.signed_by_Executive === 1) {

        legislationStatus = [...legislationStatus, " signed into law by the Executive"];

    };

    $: if (endorsedLegislationData === null) {

        legislationStatus = [];
        sponsorsHouse = [];
        sponsorsSenate = [];
        coSponsorsHouse = [];
        coSponsorsSenate = [];
        sponsorsHouseNames = [];
        sponsorsSenateNames = [];
        coSponsorsHouseNames = [];
        coSponsorsSenateNames = [];

    };

    $: if (endorsedLegislationData?.sponsors_House) {

        sponsorsHouse = endorsedLegislationData.sponsors_House;

        sponsorsHouse.forEach((sponsor) => {

            sponsorsHouseNames = [...sponsorsHouseNames, sponsor.sponsor_name];
        
        });

    };

    $: if (endorsedLegislationData?.sponsors_Senate) {

        sponsorsSenate = endorsedLegislationData.sponsors_Senate;

        sponsorsSenate.forEach((sponsor) => {

            sponsorsSenateNames = [...sponsorsSenateNames, sponsor.sponsor_name];

        });

    };
    
    $: if (endorsedLegislationData?.co_sponsors_House) {

        coSponsorsHouse = endorsedLegislationData.co_sponsors_House;

        coSponsorsHouse.forEach((sponsor) => {

            coSponsorsHouseNames = [...coSponsorsHouseNames, sponsor.co_sponsor_name];

        });

    };

    $: if (endorsedLegislationData?.co_sponsors_Senate) {

        coSponsorsSenate = endorsedLegislationData?.co_sponsors_Senate;

        coSponsorsSenate.forEach((sponsor) => {

            coSponsorsSenateNames = [...coSponsorsSenateNames, sponsor.co_sponsor_name];

        });

    };

</script>

<aside 
    class={ (endorsedLegislationOpen) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ (endorsedLegislationOpen) ? 'false' : 'true'}
>
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
            <img src={endorsedLegislationData?.image_URL} alt={endorsedLegislationData?.alt_text} />
        </picture>
        <h3 class="legislation_name">
            {endorsedLegislationData?.legislation_name}
        </h3>
        <table>
            <colgroup>
                <col span="1" style="width:40%">
                <col span="1" style="width:60%">
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
                        House sponsor: 
                    </td>
                    <td>
                        {sponsorsHouseNames}
                    </td>
                </tr>
                <tr>
                    <td >
                        House co-sponsor(s): 
                    </td>
                    <td>
                        <ol class="co-sponsors">
                            {#each coSponsorsHouseNames as coSponsorHouse, i}
                                <li>
                                    {coSponsorHouse}
                                </li>
                            {/each}
                        </ol>
                    </td>
                </tr>
                <tr>
                    <td>
                        Senate sponsor: 
                    </td>
                    <td>
                        {sponsorsSenateNames}
                    </td>
                </tr>
                <tr>
                    <td>
                        Senate co-sponsor(s): 
                    </td>
                    <td>
                        <ol class="co-sponsors">
                            {#each coSponsorsSenateNames as coSponsorName, i}
                                <li>
                                    {coSponsorName}
                                </li>
                            {/each}
                        </ol>
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
                        {legislationStatus.toString()}
                    </td>
                </tr>
            </tbody>
        </table>   
        <div class="details_row">
            <p class="details_header">details</p>
            <p>
                {endorsedLegislationData?.details} 
            </p>
        </div>              
    </div>
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
        overflow-y: auto;
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

    .details_row {
        padding: 1rem;
        background-color: #CBC6C2;
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

        .website_URL {
            font-size: 1.125rem;
        }

        .details_row > p {
            font-size: 1.125rem;
        }

    }

    @media (max-width: 720px) {

        tbody > tr > td {
            padding: 0.5rem 1rem;
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