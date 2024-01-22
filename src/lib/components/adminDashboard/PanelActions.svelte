<script lang="ts">
    import EditIcon from "$lib/images/icons/edit_icon.svg?raw";
    import DeleteIcon from "$lib/images/icons/delete_icon.svg?raw";
    import Pagination from "../pagination/Pagination.svelte";
    import MoreInfoButton from "../buttons/MoreInfoButton.svelte";
    import { EndorsedActionSelectedStore } from "$lib/stores/EndorsedActionSelectedStore";
    import { EndorsedActionOpenStore } from "$lib/stores/EndorsedActionOpenStore";
    import { ModalOpenStore } from "$lib/stores/ModelOpenStore";
    import { DeleteConfirmationStore } from "$lib/stores/DeleteConfirmationStore";
    import { DeleteConfirmedStore } from "$lib/stores/DeleteConfirmedStore";
    import { goto } from "$app/navigation";
    
    export let panel_data: ActionWithImage[] = [];

    let activeTab: number = 0;

    $: activeTab;

    let endorsedActions: ActionWithImage[] = [];

    $: endorsedActions = [...panel_data];

    // set the amount of items to appear on the page
    let pageSize: number = 10;

    let endorsedActionsCurrentPage: number;

    $: endorsedActionsCurrentPage = 1;

    // set the index of the first item to appear on the page
    let firstPageIndexEndorsedActions: number;
    $: firstPageIndexEndorsedActions = (endorsedActionsCurrentPage -1) * pageSize;

    // set the index for the page after the first page
    let lastPageIndexEndorsedActions: number;
    $: lastPageIndexEndorsedActions = firstPageIndexEndorsedActions + pageSize;

    let paginatedEndorsedActions: ActionWithImage[];

    // use the first page index and last page index to slice the correct items to appear on the page for each category
    $: paginatedEndorsedActions = endorsedActions.slice(firstPageIndexEndorsedActions, lastPageIndexEndorsedActions);

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

        const response = await fetch("../../../authenticated-administrator/api/deleteEndorsement", {
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

        DeleteConfirmationStore.update((value) => value = action_name);

        ModalOpenStore.update((value) => value = true);

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

            await fetch("../../../authenticated-administrator/api/loadActionEndorsements")
            
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

        DeleteConfirmedStore.update(value => value = false);

    };

    const moreInfoClickHandler = (actionID: number | undefined, index: number ) => {

        EndorsedActionSelectedStore.update((value) => value = endorsedActions[index]);

        EndorsedActionOpenStore.update((value) => value = true);

    };

</script>
<div class="tabpanel_container">
    <div class="tabs_container">
        <a
            on:click={() => activeTab = 0} 
            on:keydown={() => activeTab = 0}
            id="tabpanel_header_{0}"
            role="tab"
            aria-selected={activeTab === 0 ? true : false}
            aria-controls="{0}_tabpanel"
            tabindex={0}
        >
            <h3 class={(activeTab === 0) ? "active_tab" : "tab"} >
                endorsed
            </h3>
        </a>
        <a
            on:click={() => activeTab = 1} 
            on:keydown={() => activeTab = 1}
            id="tabpanel_header_{1}"
            role="tab"
            aria-selected={activeTab === 1 ? true : false}
            aria-controls="{1}_tabpanel"
            tabindex={1}
        >
            <h3 class={(activeTab === 1) ? "active_tab" : "tab"}>
                nominated
            </h3>
        </a>
    </div>
    {#if (activeTab === 0)}
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
                                government level
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
                                    {new Date(action?.all_day_event_date).toUTCString().substring(0, 16)}
                                {:else if (!action?.all_day_event)}
                                    {new Date(action?.date_start).toUTCString().substring(0, 16)} - {new Date(action?.date_end).toUTCString().substring(0, 16)}
                                {/if}
                            </td>
                            <td>
                                {action?.government_level}
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
        </div>
        <Pagination 
            bind:currentPage={endorsedActionsCurrentPage}
            totalCount={endorsedActions.length}
            pageSize={pageSize}
        />
    {:else if (activeTab === 1)}
        nominated actions
    {/if}
</div>
<style>

    .tabpanel_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .frame_table {
        width: 100%;
        overflow-x: hidden;
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

    .tabs_container {
        display: flex;
        justify-content: center;
        list-style: none;
        margin: 0;
        padding: 0 1rem;
    }

    .tab {
        color: #212121;
        opacity: 50%;
        cursor: pointer;
        background-color: transparent;
        border: none;
        font-size: 1.25rem;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 1rem;
        transition: color 0.2s linear, opacity 0.2s linear;
        position: relative;
    }

    .tab:hover {
        color: #28387C;
        opacity: 100%;
    }

    .active_tab {
        color: #4C4239;
        opacity: 100%;
        cursor: pointer;
        background-color: transparent;
        border: none;
        font-size: 1.25rem;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 1rem;
        position: relative;
    }

    .tab::after {
        --size: 6px;
		content: '';
		height: 6px;
		position: relative;
		top: 0;
		left: 0;
		right: 0;
        bottom: 0;
        width: 100%;
		border: var(--size) solid transparent;
		border-top: none;
		overflow: visible;
    }

    .active_tab::after {
		--size: 6px;
		content: '';
		height: 0;
		position: relative;
		top: 0;
		left: 0;
		right: 0;
        bottom: 0;
        width: 100%;
		border: var(--size) solid transparent;
		border-top: 6px solid #4C4239;
		overflow: visible;
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

        .active_tab {
            font-size: 1.1rem;
        }

        .tab {
            font-size: 1.1rem;
        }

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

        .tabs_container {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-wrap: wrap;
            list-style: none;
        }

        .tab {
            font-size: 0.8rem;
            padding: 0 0.5rem;
        }

        .active_tab {
            font-size: 0.8rem;
            padding: 0 0.5rem;
        }

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