<script lang="ts">
    import MoreInfoButton from "$lib/components/buttons/MoreInfoButton.svelte";
    import Pagination from "$lib/components/pagination/Pagination.svelte";
    import { EndorsedReferendumOpenStore } from "$lib/stores/EndorsedReferendumOpenStore";
    import { EndorsedReferendumSelectedStore } from "$lib/stores/EndorsedReferendumSelectedStore";
    import TableActionButton from "$lib/components/buttons/TableActionButton.svelte";

    export let panel_data: any;

    let nominatedReferendums: ReferendumWithImageNominated[] = [];

    $: nominatedReferendums = [...panel_data.table];

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

    let paginatedNominatedReferendums: ReferendumWithImageNominated[];

    // use the first page index and last page index to slice the correct items to appear on the page
    $: paginatedNominatedReferendums = nominatedReferendums.slice(firstPageIndex, lastPageIndex);

    const moreInfoClickHandler = (referendumID: number | undefined, index: number ) => {

        $EndorsedReferendumSelectedStore = nominatedReferendums[index];

        $EndorsedReferendumOpenStore = true;

    };
</script>

<div class="frame_table">
    <table class="table">
        <tbody>
            <tr>
                <th>
                    <h5>
                        referendum name
                    </h5>
                </th>
                <th>
                    <h5>
                        election date
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
            {#each paginatedNominatedReferendums as referendum, i}
                <tr>
                    <td>
                        {referendum?.referendum_name}
                    </td>
                    <td>
                        {new Date(referendum?.election_date).toUTCString().substring(0, 16)}
                    </td>
                    <td>
                        {#if (referendum.city)}
                            {referendum.city}
                        {/if}
                        {#if (referendum.county)}
                            {referendum.county}
                        {/if}
                        {#if (referendum.state)}
                            {referendum.state}
                        {/if}
                        United States of America
                    </td>
                    <td>
                        {referendum?.name_first} {referendum?.name_last}
                    </td>
                    <td>
                        {new Date(referendum?.date_nominated).toUTCString()}
                    </td>
                    <td>
                        {referendum?.status}
                    </td>
                    <td>
                        <TableActionButton>action</TableActionButton>
                    </td>
                    <td>
                        <button 
                            on:click={() => moreInfoClickHandler(referendum.referendum_ID, i)}
                            on:keyup={() => moreInfoClickHandler(referendum.referendum_ID, i)}
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
        totalCount={nominatedReferendums.length}
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