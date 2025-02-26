<script lang="ts">
    import MoreInfoButton from "../../buttons/MoreInfoButton.svelte";
    import { EndorsedCandidateSelectedStore } from "$lib/stores/EndorsedCandidateSelectedStore";
    import { EndorsedCandidateOpenStore } from "$lib/stores/EndorsedCandidateOpenStore";
    import Pagination from "../../pagination/Pagination.svelte";
    import TableActionButton from "$lib/components/buttons/TableActionButton.svelte";
    import { page } from "$app/stores";

    let pathName: string = $page.url.pathname;

    export let panel_data: any;

    $: panel_data;

    let candidateApplications: CampaignApplication[];

    $: candidateApplications = [...panel_data.table];

    // set the amount of items to appear on the page
    let pageSize: number = 10;

    let currentPage: number;

    $: currentPage = 1;

    // set the index of the first item to appear on the page
    let firstPageIndex: number;
    $: firstPageIndex = (currentPage -1) * pageSize;

    // set the index for the page after the first page
    let lastPageIndex: number;
    $: lastPageIndex = firstPageIndex + pageSize;

    let paginatedCandidateApplications: CampaignApplication[];

    // use the first page index and last page index to slice the correct items to appear on the page
    $: paginatedCandidateApplications = candidateApplications.slice(firstPageIndex, lastPageIndex);

    const moreInfoClickHandler = (campaignID: number | undefined, index: number ) => {

        $EndorsedCandidateSelectedStore = candidateApplications[index];

        $EndorsedCandidateOpenStore = true;

    };

</script>

<div class="frame_table">
    <table class="table">
        <tbody>
            <tr>
                <th>
                    <h5>
                        campaign name
                    </h5>
                </th>
                <th>
                    <h5>
                        election year
                    </h5>
                </th>
                <th>
                    <h5>
                        electorate
                    </h5>
                </th>
                <th>
                    <h5>
                        date submitted
                    </h5>
                </th>
                <th>
                    <h5>
                        status
                    </h5>
                </th>
                <th>
                    <h5>
                        action
                    </h5>
                </th>
                <th>
                    <h5>
                        more info
                    </h5>
                </th>
            </tr>
            {#each paginatedCandidateApplications as campaign, i}
                <tr>
                    <td>
                        {campaign?.campaign_name}
                    </td>
                    <td>
                        {campaign?.general_election_date.toString().slice(0, 4)}
                    </td>
                    <td>
                        {campaign?.electorate}
                    </td>
                    <td>
                        {new Date(campaign?.date_submitted).toUTCString()}
                    </td>
                    <td>
                        {campaign?.application_status}
                    </td>
                    <td>
                        {#if (campaign?.application_status === "submitted")}
                        <!-- IMPORTANT! use underscore before campaign.campaign_application_ID to indicate campaign application ID -->
                            <a href={`${pathName}/submitted-candidate-endorsement-application-candidate-application-ID_${campaign.campaign_application_ID}`}>
                                <TableActionButton>pending</TableActionButton>
                            </a>
                        {:else if (campaign?.application_status === "endorsed")}
                            withdraw endorsement
                        {/if}
                    </td>
                    <td>
                        <button 
                            on:click={() => moreInfoClickHandler(campaign.campaign_application_ID, i)}
                            on:keyup={() => moreInfoClickHandler(campaign.campaign_application_ID, i)}
                            class="more_info_container"
                        >
                            <MoreInfoButton />
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
    <Pagination 
        bind:currentPage={currentPage}
        totalCount={candidateApplications.length}
        pageSize={pageSize}
    />
</div>

<style>
    .frame_table {
        width: 100%;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .table {
        width: 100%;
        margin: 0 0 1rem 0;
        border-spacing: 0;
    }

    tbody tr:nth-child(even) {
        background-color: #FBF4F9;
    }

    tbody > tr > td {
        padding: 1rem;
        font-size: 1.25rem;
        overflow-wrap: break-word;
        hyphens: auto;
    }

    .more_info_container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0 auto;
        cursor: pointer;
        border: none;
        padding: 0;
        background-color: transparent;
    }

    .icon_container {
        max-width: 1.5rem;
        min-width: 1.5rem;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        fill: #4C4239;
        margin: 0 auto;
        transition: fill 0.2s linear;
        cursor: pointer;
        border: none;
        padding: 0;
        background-color: transparent;
    }

    .icon_container:hover {
        fill: #28387C;
    }

    @media (max-width: 1440px) {

        tbody > tr > th {
            padding: 0.5rem;
            font-size: 1rem;
        }

        tbody > tr > th > h5 {
            margin: 0;
            padding: 0;
            font-size: 1rem;
        }

        tbody > tr > td {
            padding: 0.5rem;
            font-size: 1rem;
        }

        .icon_container {
            max-width: 1.25rem;
            min-width: 1.25rem;
        }
    }

    @media (max-width: 720px) {

        .frame_table {
            width: 100%;
            overflow-x: scroll;
        }

        .table {
            width: auto;
            min-width: 40rem;
        }

        tbody > tr > th {
            padding: 0.25rem;
            font-size: 0.8rem;
        }

        tbody > tr > th > h5 {
            margin: 0;
            padding: 0;
            font-size: 0.8rem;
        }

        tbody > tr > td {
            padding: 0.25rem;
            font-size: 0.8rem;
        }

        .icon_container {
            max-width: 1rem;
            min-width: 1rem;
        }

    }
</style>