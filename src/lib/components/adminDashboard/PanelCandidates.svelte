<script lang="ts">
    import { EndorsedCandidateSelectedStore } from "$lib/stores/EndorsedCandidateSelectedStore";
    import { EndorsedCandidateOpenStore } from "$lib/stores/EndorsedCandidateOpenStore";
    import { ModalOpenStore } from "$lib/stores/ModelOpenStore";
    import { DeleteConfirmationStore } from "$lib/stores/DeleteConfirmationStore";
    import { DeleteConfirmedStore } from "$lib/stores/DeleteConfirmedStore";
    import MeatballsIcon from "$lib/images/icons/meaballs.svg?raw";
    import EditIcon from "$lib/images/icons/edit_icon.svg?raw";
    import DeleteIcon from "$lib/images/icons/delete_icon.svg?raw";
    import { goto } from "$app/navigation";

    export let panel_data: CandidateWithImage[] = [];
        
    let activeTab: number = 0;

    $: activeTab;

    let endorsedCandidates: CandidateWithImage[] = [];

    $: endorsedCandidates = [...panel_data];

    const editClickHandler = (campaignID: number | undefined) => {

        goto(`/authenticated-administrator/admin/edit-candidate-endorsement/${campaignID}`);

    };

    let endorsementCategory: string = "candidate";

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
            campaign_ID: number, 
            campaign_name: any,
            campaign_image_ID: number,
            campaign_image_public_ID: string
    ) => {

        // set the values for the open modal stores

        DeleteConfirmationStore.update((value) => value = campaign_name);

        ModalOpenStore.update((value) => value = true);

        // set the values for the item to be deleted

        deleteItemID = campaign_ID;
        deleteItemName = campaign_name;
        deleteItemImageID = campaign_image_ID;
        deleteItemImagePublicID =  campaign_image_public_ID;
        deleteItemCategory = endorsementCategory;

    };

    const GetCandidateEndorsements = async () => {

        let newCandidatesData: CandidateWithImage[] = [];

        try {

            await fetch("../../../authenticated-administrator/api/loadCandidateEndorsements")
            
            .then((res) => res.json())

            .then((data) => newCandidatesData = [...data])

            endorsedCandidates = [...newCandidatesData];

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

        GetCandidateEndorsements();

        // load the DeleteConfirmedStore to false

        DeleteConfirmedStore.update(value => value = false);

    };

    const moreInfoClickHandler = (campaignID: number | undefined, index: number ) => {

        EndorsedCandidateSelectedStore.update((value) => value = endorsedCandidates[index]);

        EndorsedCandidateOpenStore.update((value) => value = true);

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
                {#each endorsedCandidates as campaign, i}
                    <tr>
                        <td>
                            {campaign?.campaign_name}
                        </td>
                        <td>
                            {campaign?.election_date_general.slice(0, 4)}
                        </td>
                        <td>
                            {campaign?.electorate}
                        </td>
                        <td>
                            <button 
                                on:click={() => editClickHandler(campaign.candidate_ID)}
                                on:keyup={() => editClickHandler(campaign.candidate_ID)}
                                class="icon_container"
                            >
                                {@html EditIcon}
                            </button>
                        </td>
                        <td>
                            <button 
                                on:click={() => deleteClickHandler(
                                    campaign.candidate_ID, 
                                    campaign.campaign_name,
                                    campaign.image_ID,
                                    campaign.public_ID
                                )}
                                on:keyup={() => deleteClickHandler(
                                    campaign.candidate_ID, 
                                    campaign.campaign_name,
                                    campaign.image_ID,
                                    campaign.public_ID
                                )}
                                class="icon_container"
                            >
                                {@html DeleteIcon}
                            </button>
                        </td>
                        <td>
                            <button 
                                on:click={() => moreInfoClickHandler(campaign.candidate_ID, i)}
                                on:keyup={() => moreInfoClickHandler(campaign.candidate_ID, i)}
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
        nominated candidates
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