<script lang="ts">
    import MeatballsIcon from "$lib/images/icons/meaballs.svg?raw";
    import EditIcon from "$lib/images/icons/edit_icon.svg?raw";
    import DeleteIcon from "$lib/images/icons/delete_icon.svg?raw";
    import { DeleteConfirmationStore } from "$lib/stores/DeleteConfirmationStore";
    import { DeleteConfirmedStore } from "$lib/stores/DeleteConfirmedStore";
    import { ModalOpenStore } from "$lib/stores/ModelOpenStore";
    import { EndorsedReferendumOpenStore } from "$lib/stores/EndorsedReferendumOpenStore";
    import { EndorsedReferendumSelectedStore } from "$lib/stores/EndorsedReferendumSelectedStore";
    import { goto } from "$app/navigation";

    export let panel_data: ReferendumWithImage[] = [];

    let activeTab: number = 0;

    $: activeTab;

    let endorsedReferendums: ReferendumWithImage[] = [];

    $: endorsedReferendums = [...panel_data];

    const editClickHandler = (referendumID: number | undefined) => {

        goto(`/authenticated-administrator/admin/edit-referendum-endorsement/${referendumID}`);

    };

    let endorsementCategory: string = "referendum";

    let deleteItemID: number | null = null;
    let deleteItemName: string | null = null;
    let deleteItemImageID: number | null = null;
    let deleteItemImagePublicID: string | null = null;
    let deleteItemCategory: string | null = null;

    const deleteReferendum = async (
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
            referendum_ID: number, 
            referendum_name: any,
            referendum_image_ID: number,
            referendum_image_public_ID: string
    ) => {

        // set the values for the open modal stores

        DeleteConfirmationStore.update((value) => value = referendum_name);

        ModalOpenStore.update((value) => value = true);

        // set the values for the item to be deleted

        deleteItemID = referendum_ID;
        deleteItemName = referendum_name;
        deleteItemImageID = referendum_image_ID;
        deleteItemImagePublicID =  referendum_image_public_ID;
        deleteItemCategory = endorsementCategory;

    };

    const GetReferendumEndorsements = async () => {

        let newReferendumsData: ReferendumWithImage[] = [];

        try {

            await fetch("../../../authenticated-administrator/api/loadReferendumEndorsements")
            
            .then((res) => res.json())

            .then((data) => newReferendumsData = [...data])

            endorsedReferendums = [...newReferendumsData];

        } catch (error) {

            console.log(error);

        };

    };

    const ConfirmedDelete = async () => {

        try {

            await deleteReferendum(
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

        GetReferendumEndorsements();

        // load the DeleteConfirmedStore to false

        DeleteConfirmedStore.update(value => value = false);

    };

    const moreInfoClickHandler = (referendumID: number | undefined, index: number ) => {

        EndorsedReferendumSelectedStore.update((value) => value = endorsedReferendums[index]);

        EndorsedReferendumOpenStore.update((value) => value = true);

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
        <table>
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
                {#each endorsedReferendums as referendum, i}
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
                            <button 
                                on:click={() => editClickHandler(referendum.referendum_ID)}
                                on:keyup={() => editClickHandler(referendum.referendum_ID)}
                                class="icon_container"
                            >
                                {@html EditIcon}
                            </button>
                        </td>
                        <td>
                            <button 
                                on:click={() => deleteClickHandler(
                                    referendum.referendum_ID, 
                                    referendum.referendum_name,
                                    referendum.image_ID,
                                    referendum.public_ID
                                )}
                                on:keyup={() => deleteClickHandler(
                                    referendum.referendum_ID, 
                                    referendum.referendum_name,
                                    referendum.image_ID,
                                    referendum.public_ID
                                )}
                                class="icon_container"
                            >
                                {@html DeleteIcon}
                            </button>
                        </td>
                        <td>
                            <button 
                                on:click={() => moreInfoClickHandler(referendum.referendum_ID, i)}
                                on:keyup={() => moreInfoClickHandler(referendum.referendum_ID, i)}
                                class="icon_container"
                            >
                                {@html MeatballsIcon}
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else if (activeTab === 1)}
        nominated referendums
    {/if}
</div>
<style>
    table {
        border-spacing: 0;
        width: 100%;
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

    .tabpanel_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
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

    .icon_container {
        max-width: 1.5rem;
        width: 100%;
        height: 100%;
        width: 100%;
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
        }

    }
</style>