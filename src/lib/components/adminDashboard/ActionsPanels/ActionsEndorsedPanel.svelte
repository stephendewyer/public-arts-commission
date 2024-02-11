<script lang="ts">
    import MoreInfoButton from "../../buttons/MoreInfoButton.svelte";
    import EditIcon from "$lib/images/icons/edit_icon.svg?raw";
    import DeleteIcon from "$lib/images/icons/delete_icon.svg?raw";
    import Pagination from "$lib/components/pagination/Pagination.svelte";
    import { EndorsedActionSelectedStore } from "$lib/stores/EndorsedActionSelectedStore";
    import { EndorsedActionOpenStore } from "$lib/stores/EndorsedActionOpenStore";
    import { ModalOpenStore } from "$lib/stores/ModelOpenStore";
    import { DeleteConfirmationStore } from "$lib/stores/DeleteConfirmationStore";
    import { DeleteConfirmedStore } from "$lib/stores/DeleteConfirmedStore";
    import { goto } from "$app/navigation";

    export let panel_data: any;

    $: panel_data;

    let endorsedActions: ActionWithImage[];

    $: endorsedActions = [...panel_data.table];

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

    let paginatedEndorsedActions: ActionWithImage[];

    // use the first page index and last page index to slice the correct items to appear on the page
    $: paginatedEndorsedActions = endorsedActions.slice(firstPageIndex, lastPageIndex);

    const moreInfoClickHandler = (actionID: number | undefined, index: number ) => {

        $EndorsedActionSelectedStore = endorsedActions[index];

        $EndorsedActionOpenStore = true;

    };

    const editClickHandler = (actionID: number | undefined) => {

        goto(`/authenticated-administrator/admin/edit-action-endorsement/${actionID}`);

    };

    let endorsementCategory: string = "action";

    let deleteItemID: number | null = null;
    let deleteItemName: string | null = null;
    let deleteItemImageID: number | null = null;
    let deleteItemImagePublicID: string | null = null;
    let deleteItemCategory: string | null = null;

    const deleteEndorsement = async (
        deleteItemID: number | null,
        deleteItemName: string | null,
        deleteItemImageID: number | null,
        deleteItemImagePublicID: string | null,
        deleteItemCategory: string | null
    ) => {        

        const response = await fetch("/authenticated-administrator/api/deleteEndorsement", {
            method: 'DELETE',
            body: JSON.stringify({
                deleteItemID,
                deleteItemName,
                deleteItemImageID,
                deleteItemImagePublicID,
                deleteItemCategory
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response) {

            console.log(response);

        };

    };

    const deleteClickHandler = async (
        action_ID: number, 
        action_name: any,
        action_image_ID: number,
        action_image_public_ID: string
    ) => {

        // set the values for the open modal stores

        $DeleteConfirmationStore = action_name;

        $ModalOpenStore = true;

        // set the values for the item to be deleted

        deleteItemID = action_ID;
        deleteItemName = action_name;
        deleteItemImageID = action_image_ID;
        deleteItemImagePublicID =  action_image_public_ID;
        deleteItemCategory = endorsementCategory;

    };

    const GetActionEndorsements = async () => {

        let newActionsData: ActionWithImage[] = [];

        try {

            await fetch("/authenticated-administrator/api/loadActionEndorsements")
            
            .then((res) => res.json())

            .then((data) => newActionsData = [...data])

            endorsedActions = [...newActionsData];

        } catch (error) {

            console.log(error);

        };

    };

    const ConfirmedDelete = async () => {

        try {

            await deleteEndorsement(
                deleteItemID,
                deleteItemName,
                deleteItemImageID,
                deleteItemImagePublicID,
                deleteItemCategory
            );

        } catch (error) {

            console.log(error);

        };

    };

    $: if ($DeleteConfirmedStore === true) {

        // delete the candidate row from the database

        ConfirmedDelete();  

        // load new data from endorsed candidates table in database

        GetActionEndorsements();

        // load the DeleteConfirmedStore to false

        $DeleteConfirmedStore = false;

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
                        edit
                    </h5>
                </th>
                <th>
                    <h5>
                        delete
                    </h5>
                </th>
                <th>
                    <h5>
                        more info
                    </h5>
                </th>
            </tr>
            {#each paginatedEndorsedActions as action, i}
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
                        <button 
                            on:click={() => editClickHandler(action.action_ID)}
                            on:keyup={() => editClickHandler(action.action_ID)}
                            class="icon_container"
                        >
                            {@html EditIcon}
                        </button>
                    </td>
                    <td>
                        <button 
                            on:click={() => deleteClickHandler(
                                action.action_ID, 
                                action.action_name,
                                action.image_ID,
                                action.public_ID
                            )}
                            on:keyup={() => deleteClickHandler(
                                action.action_ID, 
                                action.action_name,
                                action.image_ID,
                                action.public_ID
                            )}
                            class="icon_container"
                        >
                            {@html DeleteIcon}
                        </button>
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
        totalCount={endorsedActions.length}
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