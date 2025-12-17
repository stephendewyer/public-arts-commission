<script lang="ts">
    import MoreInfoButton from "$lib/components/buttons/MoreInfoButton.svelte";
    import EditIcon from "$lib/images/icons/edit_icon.svg?raw";
    import DeleteIcon from "$lib/images/icons/delete_icon.svg?raw";
    import Pagination from "$lib/components/pagination/Pagination.svelte";
    import { EndorsedLegislationOpenStore } from "$lib/stores/EndorsedLegislationOpenStore";
    import { EndorsedLegislationSelectedStore } from "$lib/stores/EndorsedLegislationSelectedStore";

    export let panel_data: any;

    let nominatedLegislation: LegislationWithSponsorsAndImageNominated[] = [];

    $: nominatedLegislation = [...panel_data.table];

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

    let paginatedNominatedLegislation: LegislationWithSponsorsAndImageNominated[];

    // use the first page index and last page index to slice the correct items to appear on the page
    $: paginatedNominatedLegislation = nominatedLegislation.slice(firstPageIndex, lastPageIndex);

    let activeTab: number = 0;

    $: activeTab;

    const moreInfoClickHandler = (legislationID: number | undefined, index: number ) => {

        $EndorsedLegislationSelectedStore = nominatedLegislation[index];

        $EndorsedLegislationOpenStore = true;

    };

</script>

<div class="frame_table">
    <table class="table">
        <tbody>
            <tr>
                <th>
                    <h5>
                        legislation name
                    </h5>
                </th>
                <th>
                    <h5>
                        year released
                    </h5>
                </th>
                <th>
                    <h5>
                        electorate/jurisdiction
                    </h5>
                </th>
                <th>
                    <h5>
                        nomination author
                    </h5>
                </th>
                <th>
                    <h5>
                        date nominated
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
            {#each paginatedNominatedLegislation as legislation, i}
                <tr>
                    <td>
                        {legislation?.legislation_name}
                    </td>
                    <td>
                        {legislation?.year_released}
                    </td>
                    <td>
                        {#if (legislation.city)}
                            {legislation.city}
                        {/if}
                        {#if (legislation.county)}
                            {legislation.county}
                        {/if}
                        {#if (legislation.state)}
                            {legislation.state}
                        {/if}
                        United States of America
                    </td>
                    <td>
                        {legislation?.name_first} {legislation?.name_last}
                    </td>
                    <td>
                        {new Date(legislation?.date_nominated).toUTCString()}
                    </td>
                    <td>
                        {legislation?.status}
                    </td>
                    <td>
                        action
                    </td>
                    <td>
                        <button 
                            on:click={() => moreInfoClickHandler(legislation.legislation_ID, i)}
                            on:keyup={() => moreInfoClickHandler(legislation.legislation_ID, i)}
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
        totalCount={nominatedLegislation.length}
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