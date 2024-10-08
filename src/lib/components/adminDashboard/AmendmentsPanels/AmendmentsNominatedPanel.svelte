<script lang="ts">
    import MoreInfoButton from "$lib/components/buttons/MoreInfoButton.svelte";
    import Pagination from "$lib/components/pagination/Pagination.svelte";
    import { EndorsedAmendmentSelectedStore } from "$lib/stores/EndorsedAmendmentSelectedStore";
    import { EndorsedAmendmentOpenStore } from "$lib/stores/EndorsedAmendmentOpenStore";
    import { goto } from "$app/navigation";

    export let panel_data: any;

    let activeTab: number = 0;

    $: activeTab;

    let nominatedAmendments: AmendmentWithSponsorsAndImageNominated[] = [];

    $: nominatedAmendments = [...panel_data.table];

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

    let paginatedNominatedAmendments: AmendmentWithSponsorsAndImageNominated[];

    // use the first page index and last page index to slice the correct items to appear on the page
    $: paginatedNominatedAmendments = nominatedAmendments.slice(firstPageIndex, lastPageIndex);

    const moreInfoClickHandler = (amendmentID: number | undefined, index: number ) => {

        $EndorsedAmendmentSelectedStore = nominatedAmendments[index];

        $EndorsedAmendmentOpenStore = true;

    };

</script>

<div class="frame_table">
    <table class="table">
        <tbody>
            <tr>
                <th>
                    <h5>
                        amendment name
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
            {#each paginatedNominatedAmendments as amendment, i}
                <tr>
                    <td>
                        {amendment?.amendment_name}
                    </td>
                    <td>
                        {amendment?.year_released}
                    </td>
                    <td>
                        {#if (amendment.city)}
                            {amendment.city}
                        {/if}
                        {#if (amendment.county)}
                            {amendment.county}
                        {/if}
                        {#if (amendment.state)}
                            {amendment.state}
                        {/if}
                        United States of America
                    </td>
                    <td>
                        {amendment?.name_first} {amendment?.name_last}
                    </td>
                    <td>
                        {new Date(amendment?.date_nominated).toUTCString()}
                    </td>
                    <td>
                        {amendment?.status}
                    </td>
                    <td>
                        action
                    </td>
                    <td>
                        <button 
                            on:click={() => moreInfoClickHandler(amendment.amendment_ID, i)}
                            on:keyup={() => moreInfoClickHandler(amendment.amendment_ID, i)}
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
        totalCount={nominatedAmendments.length}
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