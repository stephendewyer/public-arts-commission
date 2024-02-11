<script lang="ts">
    import MoreInfoButton from "$lib/components/buttons/MoreInfoButton.svelte";
    import EditIcon from "$lib/images/icons/edit_icon.svg?raw";
    import DeleteIcon from "$lib/images/icons/delete_icon.svg?raw";
    import Pagination from "$lib/components/pagination/Pagination.svelte";
    import { DeleteConfirmationStore } from "$lib/stores/DeleteConfirmationStore";
    import { DeleteConfirmedStore } from "$lib/stores/DeleteConfirmedStore";
    import { EndorsedLegislationSelectedStore } from "$lib/stores/EndorsedLegislationSelectedStore";
    import { EndorsedLegislationOpenStore } from "$lib/stores/EndorsedLegislationOpenStore";
    import { ModalOpenStore } from "$lib/stores/ModelOpenStore";
    import { goto } from "$app/navigation";

    export let panel_data: any;

    let endorsedLegislation: LegislationWithSponsorsAndImage[] = [];

    $: endorsedLegislation = [...panel_data.table];

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

    let paginatedEndorsedLegislation: LegislationWithSponsorsAndImage[];

    // use the first page index and last page index to slice the correct items to appear on the page
    $: paginatedEndorsedLegislation = endorsedLegislation.slice(firstPageIndex, lastPageIndex);

    let activeTab: number = 0;

    $: activeTab;

    const editClickHandler = (legislationID: number | undefined) => {

        goto(`/authenticated-administrator/admin/edit-legislation-endorsement/${legislationID}`);

    };

    let endorsementCategory: string = "amendment";

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
            legislation_ID: number, 
            legislation_name: any,
            legislation_image_ID: number,
            legislation_image_public_ID: string
    ) => {

        // set the values for the open modal stores

        $DeleteConfirmationStore = legislation_name;

        $ModalOpenStore = true;

        // set the values for the item to be deleted

        deleteItemID = legislation_ID;
        deleteItemName = legislation_name;
        deleteItemImageID = legislation_image_ID;
        deleteItemImagePublicID =  legislation_image_public_ID;
        deleteItemCategory = endorsementCategory;

    };

    const GetLegislationEndorsements = async () => {

        let newLegislationData: LegislationWithSponsorsAndImage[] = [];

        try {

            await fetch("/authenticated-administrator/api/loadLegislationEndorsements")
            
            .then((res) => res.json())

            .then((data) => newLegislationData = [...data])

            endorsedLegislation = [...newLegislationData];

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

        GetLegislationEndorsements();

        // load the DeleteConfirmedStore to false

        $DeleteConfirmedStore = false;

    };

    const moreInfoClickHandler = (legislationID: number | undefined, index: number ) => {

        $EndorsedLegislationSelectedStore = endorsedLegislation[index];

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
            {#each paginatedEndorsedLegislation as legislation, i}
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
                        <button 
                            on:click={() => editClickHandler(legislation.legislation_ID)}
                            on:keyup={() => editClickHandler(legislation.legislation_ID)}
                            class="icon_container"
                        >
                            {@html EditIcon}
                        </button>
                    </td>
                    <td>
                        <button 
                            on:click={() => deleteClickHandler(
                                legislation.legislation_ID, 
                                legislation.legislation_name,
                                legislation.image_ID,
                                legislation.public_ID
                            )}
                            on:keyup={() => deleteClickHandler(
                                legislation.legislation_ID, 
                                legislation.legislation_name,
                                legislation.image_ID,
                                legislation.public_ID
                            )}
                            class="icon_container"
                        >
                            {@html DeleteIcon}
                        </button>
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
        totalCount={endorsedLegislation.length}
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