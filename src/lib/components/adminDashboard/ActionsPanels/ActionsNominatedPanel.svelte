<script lang="ts">
    import MoreInfoButton from "../../buttons/MoreInfoButton.svelte";
    import EditIcon from "$lib/images/icons/edit_icon.svg?raw";
    import Pagination from "$lib/components/pagination/Pagination.svelte";
    import { EndorsedActionSelectedStore } from "$lib/stores/EndorsedActionSelectedStore";
    import { EndorsedActionOpenStore } from "$lib/stores/EndorsedActionOpenStore";
    import { goto } from "$app/navigation";

    export let panel_data: any;

    $: panel_data;

    let nominatedActions: ActionWithImageNominated[];

    $: nominatedActions = [...panel_data.table];

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

    let paginatedNominatedActions: ActionWithImageNominated[];

    // use the first page index and last page index to slice the correct items to appear on the page
    $: paginatedNominatedActions = nominatedActions.slice(firstPageIndex, lastPageIndex);

    const moreInfoClickHandler = (actionID: number | undefined, index: number ) => {

        $EndorsedActionSelectedStore = nominatedActions[index];

        $EndorsedActionOpenStore = true;

    };

    const editClickHandler = (actionID: number | undefined) => {

        goto(`/authenticated-administrator/admin/edit-action-endorsement/${actionID}`);

    };

</script>

<div class="frame_table">
    <table class="table">
        <tbody>
            <tr>
                <th>
                    <h5>
                        action name
                    </h5>
                </th>
                <th>
                    <h5>
                        date(s)
                    </h5>
                </th>
                <th>
                    <h5>
                        time
                    </h5>
                </th>
                <th>
                    <h5>
                        time zone
                    </h5>
                </th>
                <th>
                    <h5>
                        location
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
            {#each paginatedNominatedActions as action, i}
                <tr>
                    <td>
                        {action?.action_name}
                    </td>
                    <td>
                        {#if (action?.all_day_event)}
                            {action?.all_day_event_date.toString().slice(0, 4)}
                        {:else if (!action?.all_day_event)}
                            {new Date(action?.date_start).toUTCString().substring(0, 16)} - {new Date(action?.date_end).toUTCString().substring(0, 16)}
                        {/if}
                    </td>
                    <td>
                        {#if (action?.all_day_event)}
                            all day
                        {:else if (!action?.all_day_event)}
                            {action?.time_start} - {action?.time_end}
                        {/if}
                    </td>
                    <td>
                        {action?.time_zone}
                    </td>
                    <td>
                        {#if action?.action_street_address}
                            {action?.action_street_address}, 
                        {/if}
                        {#if action?.action_street_address_02}
                            {action?.action_street_address_02}, 
                        {/if}
                        {#if action?.action_city}
                            {action?.action_city}, 
                        {/if}
                        {#if action?.action_state}
                            {action?.action_state}, 
                        {/if}
                        {#if action?.action_zip_code}
                            {action?.action_zip_code}, 
                        {/if}
                        United States
                    </td>
                    <td>
                        {action?.name_first} {action?.name_last}
                    </td>
                    <td>
                        {action?.date_nominated}
                    </td>
                    <td>
                        {action?.status}
                    </td>
                    <td>
                        action {@html EditIcon}
                    </td>
                    <td>
                        <button 
                            on:click={() => moreInfoClickHandler(action.action_ID, i)}
                            on:keyup={() => moreInfoClickHandler(action.action_ID, i)}
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
        totalCount={nominatedActions.length}
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