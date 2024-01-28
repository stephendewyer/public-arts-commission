<script lang="ts">
    import { EndorsedAmendmentSelectedStore } from '$lib/stores/EndorsedAmendmentSelectedStore';
    import { EndorsedAmendmentOpenStore } from '$lib/stores/EndorsedAmendmentOpenStore';
    import { onDestroy } from 'svelte';
    import CloseIcon from '$lib/images/icons/close_icon.svg?raw';
    import ExternalLinkIcon from '$lib/images/icons/external_link_icon.svg?raw';
    import { page } from '$app/stores';

    let endorsedAmendmentData: AmendmentWithSponsorsAndImage | null = null;

    let URLPathName: string;

    $: if (endorsedAmendmentData) {

        URLPathName = $page.url.pathname;

    };    

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
    };

    let rawElectionDate: Date;
    let electionDate: Date | string;
    let blankDate = new Date("2016-01-01T06:00:00.000Z");

    $: if (endorsedAmendmentData?.election_date) {

        rawElectionDate = new Date (endorsedAmendmentData.election_date);

        if (rawElectionDate < blankDate) {

            electionDate = "";
            
        } else {

            electionDate = rawElectionDate.toUTCString().substring(0, 16);

        };

    };

    let amendmentStatus: string[] = [];

    $: if (endorsedAmendmentData?.introduced_in_House === 1) {

        amendmentStatus = [...amendmentStatus, " introduced in the House"];

    };
    
    $: if (endorsedAmendmentData?.introduced_in_Senate === 1) {

        amendmentStatus = [...amendmentStatus, " introduced in the Senate"];

    };
    
    $: if (endorsedAmendmentData?.twothirds_House_and_Senate_passed === 1) {

        amendmentStatus = [...amendmentStatus, " passed by two-thirds majorities in the House and Senate"];

    };
    
    $: if (endorsedAmendmentData?.simple_majority_House_and_Senate_passed === 1) {

        amendmentStatus = [...amendmentStatus, " passed by simple majorities in the House and Senate"];

    };
    
    $: if (endorsedAmendmentData?.simple_majority_voters_passed === 1) {

        amendmentStatus = [...amendmentStatus, " passed by a simple majority of voters"];

    };
    
    $: if (endorsedAmendmentData?.ratified_by_state_convenctions === 1) {

        amendmentStatus = [...amendmentStatus, " ratified by three-fourths of state conventions called in each state"];

    };

    $: if (endorsedAmendmentData?.ratified_by_state_legislatures === 1) {

        amendmentStatus = [...amendmentStatus, " ratified by three-fourths of state legislatures"];

    };

    $: if (endorsedAmendmentData === null) {
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

    let sponsorsHouse: SponsorHouse[];
    let sponsorsSenate: SponsorSenate[];
    let coSponsorsHouse: CoSponsorHouse[];
    let coSponsorsSenate: CoSponsorSenate[];

    let sponsorsHouseNames: string[] = [];
    let sponsorsSenateNames: string[] = [];
    let coSponsorsHouseNames: string[] = [];
    let coSponsorsSenateNames: string[] = [];


    $: if (endorsedAmendmentData?.sponsors_House) {

        sponsorsHouse = endorsedAmendmentData?.sponsors_House;

        sponsorsHouse.forEach((sponsor) => {

            sponsorsHouseNames = [...sponsorsHouseNames, sponsor.sponsor_name];
        
        });

    };

    $: if (endorsedAmendmentData?.sponsors_Senate) {

        sponsorsSenate = endorsedAmendmentData?.sponsors_Senate;

        sponsorsSenate.forEach((sponsor) => {

            sponsorsSenateNames = [...sponsorsSenateNames, sponsor.sponsor_name];

        });

    };
    
    $: if (endorsedAmendmentData?.co_sponsors_House) {

        coSponsorsHouse = endorsedAmendmentData?.co_sponsors_House;

        coSponsorsHouse.forEach((sponsor) => {

            coSponsorsHouseNames = [...coSponsorsHouseNames, sponsor.co_sponsor_name];

        });

    };

    $: if (endorsedAmendmentData?.co_sponsors_Senate) {

        coSponsorsSenate = endorsedAmendmentData?.co_sponsors_Senate;

        coSponsorsSenate.forEach((sponsor) => {

            coSponsorsSenateNames = [...coSponsorsSenateNames, sponsor.co_sponsor_name];

        });

    };

</script>

<aside 
    class={ (endorsedAmendmentOpen) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ (endorsedAmendmentOpen) ? 'false' : 'true'}
>
    <div class="close_button_container">
        <a href={URLPathName}>
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
            <img src={endorsedAmendmentData?.image_URL} alt={endorsedAmendmentData?.alt_text} />
        </picture>
        <h3 class="amendment_name">
            {endorsedAmendmentData?.amendment_name}
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
                        {endorsedAmendmentData?.year_released}
                    </td>
                </tr>
                <tr>
                    <td>
                        year introduced in the House:
                    </td>
                    <td>
                        {#if (endorsedAmendmentData?.year_introduced_House)}
                            {endorsedAmendmentData?.year_introduced_House}
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        year introduced in the Senate:
                    </td>
                    <td>
                        {#if (endorsedAmendmentData?.year_introduced_Senate)}
                            {endorsedAmendmentData?.year_introduced_Senate}
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        House session:
                    </td>
                    <td>
                        {#if (endorsedAmendmentData?.session_House)}
                            {endorsedAmendmentData?.session_House}
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        Senate session:
                    </td>
                    <td>
                        {#if (endorsedAmendmentData?.session_Senate)}
                            {endorsedAmendmentData?.session_Senate}
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        election date:
                    </td>
                    <td>
                        {#if (electionDate)}
                            {electionDate}
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
                {#if (endorsedAmendmentData?.state)}
                    <tr>
                        <td>
                            state: 
                        </td>
                        <td>
                            {endorsedAmendmentData?.state}
                        </td>
                    </tr>
                {/if}
                {#if (endorsedAmendmentData?.county)}
                    <tr>
                        <td>
                            county: 
                        </td>
                        <td>
                            {endorsedAmendmentData?.county}
                        </td>
                    </tr>
                {/if}
                {#if (endorsedAmendmentData?.city)}
                    <tr>
                        <td>
                            city: 
                        </td>
                        <td>
                            {endorsedAmendmentData?.city}
                        </td>
                    </tr>
                {/if}
                <tr>
                    <td>
                        House sponsor: 
                    </td>
                    <td>
                        {#if (sponsorsHouseNames)}
                            {sponsorsHouseNames.join(', ').toString()}
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        House co-sponsor(s): 
                    </td>
                    <td>
                        {#if (coSponsorsHouseNames)}
                            {coSponsorsHouseNames.join(', ').toString()}
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        Senate sponsor: 
                    </td>
                    <td>
                        {#if (sponsorsSenateNames)}
                            {sponsorsSenateNames.join(', ').toString()}
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        Senate co-sponsor(s): 
                    </td>
                    <td>
                        {#if (coSponsorsSenateNames)}
                            {coSponsorsSenateNames.join(', ').toString()}
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        details: 
                    </td>
                    <td>
                        {#if (endorsedAmendmentData?.details)}
                            {endorsedAmendmentData?.details}
                        {/if}
                    </td>
                </tr>
                <tr>
                    <td>
                        website: 
                    </td>
                    <td>
                        {#if (endorsedAmendmentData?.website_URL)}
                            <a 
                                class="external_link_container"
                                href={endorsedAmendmentData?.website_URL} 
                                target="_blank"
                            >
                                <div class="external_link_icon">
                                    {@html ExternalLinkIcon}
                                </div>
                                <div class="website_URL">
                                    {endorsedAmendmentData?.website_URL} 
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
                        {amendmentStatus.toString()}
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

    .amendment_name {
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