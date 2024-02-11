<script lang="ts">
    import MoreInfoButton from "../../buttons/MoreInfoButton.svelte";
    import EditIcon from "$lib/images/icons/edit_icon.svg?raw";
    import DeleteIcon from "$lib/images/icons/delete_icon.svg?raw";
    import Pagination from "../../pagination/Pagination.svelte";
    import { EndorsedCandidateSelectedStore } from "$lib/stores/EndorsedCandidateSelectedStore";
    import { EndorsedCandidateOpenStore } from "$lib/stores/EndorsedCandidateOpenStore";
    import { ModalOpenStore } from "$lib/stores/ModelOpenStore";
    import { DeleteConfirmationStore } from "$lib/stores/DeleteConfirmationStore";
    import { DeleteConfirmedStore } from "$lib/stores/DeleteConfirmedStore";
    import { goto } from "$app/navigation";

    export let panel_data: any;

    $: panel_data;

    let endorsedCandidates: CandidateWithImage[];

    $: endorsedCandidates = [...panel_data.table];

    // set the amount of items to appear on the page
    let pageSize: number = 10;

    let endorsedCandidatesCurrentPage: number;

    $: endorsedCandidatesCurrentPage = 1;

    // set the index of the first item to appear on the page
    let firstPageIndexEndorsedCandidates: number;
    $: firstPageIndexEndorsedCandidates = (endorsedCandidatesCurrentPage -1) * pageSize;

    // set the index for the page after the first page
    let lastPageIndexEndorsedCandidates: number;
    $: lastPageIndexEndorsedCandidates = firstPageIndexEndorsedCandidates + pageSize;

    let paginatedEndorsedCandidates: CandidateWithImage[];

    // use the first page index and last page index to slice the correct items to appear on the page
    $: paginatedEndorsedCandidates = endorsedCandidates.slice(firstPageIndexEndorsedCandidates, lastPageIndexEndorsedCandidates);

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

        $DeleteConfirmationStore = campaign_name;

        $ModalOpenStore = true;

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

            await fetch("../../../../authenticated-administrator/api/loadCandidateEndorsements")
            
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

        $DeleteConfirmedStore = false;

    };

    const moreInfoClickHandler = (campaignID: number | undefined, index: number ) => {

        $EndorsedCandidateSelectedStore = endorsedCandidates[index];

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
            {#each paginatedEndorsedCandidates as campaign, i}
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
        bind:currentPage={endorsedCandidatesCurrentPage}
        totalCount={endorsedCandidates.length}
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