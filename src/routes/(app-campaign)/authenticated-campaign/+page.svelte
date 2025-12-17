<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import { onMount } from 'svelte';
    import MoreInfoButton from '$lib/components/buttons/MoreInfoButton.svelte';
    import DeleteIcon from '$lib/images/icons/delete_icon.svg?raw';
    import AddItemButton from '$lib/components/buttons/AddItemButton.svelte';
    import LoaderAnimation from '$lib/components/loaders/LoaderAnimation.svelte';
    import TableActionButton from '$lib/components/buttons/TableActionButton.svelte';
    import { DeleteConfirmationStore } from '$lib/stores/DeleteConfirmationStore.js';
    import { DeleteConfirmedStore } from '$lib/stores/DeleteConfirmedStore.js';
    import { ModalOpenStore } from '$lib/stores/ModelOpenStore.js';
    import EditButton from '$lib/components/buttons/EditButton.svelte';

    export let data;

    const userEmail = data.streamed.user.email;

    // begin get user campaign applications

	let userCampaignApplications: CampaignApplication[] = [];

    // make userCampaignApplications reactive to rerender applications after change

    let pendingUserCampaignApplicationsData: boolean = false;

    let getUserCampaignApplicationsDataSuccess: boolean | null = null;

    async function getUserCampaignApplicationsData() {

        pendingUserCampaignApplicationsData = true;
        
        const response = await fetch("/authenticated-campaign/api/getUserCampaignApplications", {

            method: 'POST',
            body: JSON.stringify({
                userEmail
            }),
            headers: {
                'Content-Type': 'application/json',
            }

        });

        userCampaignApplications = await response.json();

        if (response.ok) {

            pendingUserCampaignApplicationsData = false;

            getUserCampaignApplicationsDataSuccess = true;

        } else if (!response.ok) {

            pendingUserCampaignApplicationsData = false;

            getUserCampaignApplicationsDataSuccess = false;

        };

    };

    // begin get campaign user information

	let campaignUserInformation: CampaignUserInformation;

    let pendingCampaignUserInformationData: boolean = false;

    let getCampaignUserInformationDataSuccess: boolean | null = null;

    async function getCampaignUserInformationData() {

        pendingCampaignUserInformationData = true;
        
        const response = await fetch("/authenticated-campaign/api/getUserInformation", {

            method: 'POST',
            body: JSON.stringify({
                userEmail
            }),
            headers: {
                'Content-Type': 'application/json',
            }

        });

        campaignUserInformation = await response.json();

        if (response.ok) {

            pendingCampaignUserInformationData = false;

            getCampaignUserInformationDataSuccess = true;

        } else if (!response.ok) {

            pendingCampaignUserInformationData = false;

            getCampaignUserInformationDataSuccess = false;

        };

    };

    onMount(() => {

        getCampaignUserInformationData();
        getUserCampaignApplicationsData();

    });

    const getElectionYear = (generalElectionDate: Date) => {

        let electionYear = new Date(generalElectionDate).getFullYear();

        return electionYear;

    };

    let deleteItem: CampaignApplication;

    const DeleteCampaignApplication = async (
        deleteItem: CampaignApplication
    ) => {        

        const response = await fetch("/authenticated-campaign/api/deleteCampaignApplication", {
            method: 'DELETE',
            body: JSON.stringify({
                deleteItem
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response) {

            console.log(response);

        };

    };

    const ConfirmedDelete = async () => {

        try {

            await DeleteCampaignApplication(
                deleteItem
            );

        } catch (error) {

            console.log(error);

        };

    };

    const deleteClickHandler = async (
        campaignApplication: CampaignApplication
    ) => {

        const campaignName: string | any = campaignApplication.campaign_name;

        // set the values for the open modal stores

        $DeleteConfirmationStore = campaignName;

        $ModalOpenStore = true;

        // set the values for the item to be deleted

        deleteItem = campaignApplication;

    };
    

    $: if ($DeleteConfirmedStore === true) {

        // delete the campaign row from the database

        ConfirmedDelete();  

        // load new data from campaign_applications table in database

        getUserCampaignApplicationsData();

        // load the DeleteConfirmedStore to false

        $DeleteConfirmedStore = false;

    };
    
</script>
<svelte:head>
	<title>campaign applications dashboard for {campaignUserInformation?.name_first} {campaignUserInformation?.name_last} - public arts commission</title>
	<meta name="description" content="manage campaign applications for endorsement" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<div class="tables_container">
    <h1 class="welcome_message">
        welcome, {campaignUserInformation?.name_first} {campaignUserInformation?.name_last}!
    </h1>
    <h2 class="my_campaigns">
        my campaigns
    </h2>
    <div class="add_campaign_button_container">
        <a href="/authenticated-campaign/campaign-registration">
            <AddItemButton>
                campaign
            </AddItemButton>
        </a>
    </div>
    {#if pendingUserCampaignApplicationsData}
        <LoaderAnimation />
    {:else if getUserCampaignApplicationsDataSuccess}
        <div class="frame_table">
            <table class="table">
                <tbody>
                    <tr>
                        <th>
                            <h5 class="table_column_header">
                                campaign name
                            </h5>
                        </th>
                        <th>
                            <h5 class="table_column_header">
                                electorate
                            </h5>
                        </th>
                        <th>
                            <h5 class="table_column_header">
                                election year
                            </h5>
                        </th>
                        <th>
                            <h5 class="table_column_header">
                                application status
                            </h5>
                        </th>
                        <th>
                            <h5 class="table_column_header">
                                action
                            </h5>
                        </th>
                        <th>
                        </th>
                    </tr>
                    {#each userCampaignApplications as campaignApplication, i}
                        <tr>
                            <td>
                                {campaignApplication?.campaign_name}
                            </td>
                            <td>
                                {campaignApplication?.electorate}
                            </td>
                            <td>
                                {getElectionYear(campaignApplication?.general_election_date)}
                            </td>
                            <td>
                                {#if !campaignApplication.application_status}
                                    started
                                {:else}
                                    {campaignApplication?.application_status}
                                {/if}
                            </td>
                            <td>
                                {#if (campaignApplication.application_status !== "started" && campaignApplication.application_status)}
                                    <a href={`/authenticated-campaign/view-campaign-application/campaign=${campaignApplication.campaign_application_ID}`}> 
                                        <div class="more_info_container">
                                            <MoreInfoButton />
                                        </div>
                                    </a>
                                {:else if (
                                    campaignApplication.application_status === "started" ||
                                    !campaignApplication.application_status
                                )}
                                    <a href={`/authenticated-campaign/campaign-registration/campaign=${campaignApplication.campaign_application_ID}`}>
                                        <TableActionButton>complete</TableActionButton>
                                    </a>
                                {/if}
                            </td>
                            <td>
                                {#if (
                                    campaignApplication.application_status === "started" ||
                                    !campaignApplication.application_status
                                )}
                                    <button 
                                        on:click={() => deleteClickHandler(
                                            campaignApplication
                                        )}
                                        on:keyup={() => deleteClickHandler(
                                            campaignApplication
                                        )}
                                        class="icon_container"
                                    >
                                        {@html DeleteIcon}
                                    </button>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        
    {:else if !getUserCampaignApplicationsDataSuccess}
        failed to load campaign applications
    {/if}
    <h2 class="my_contact_information">
        my contact information
    </h2>
    {#if pendingCampaignUserInformationData}
        <LoaderAnimation />
    {:else if getCampaignUserInformationDataSuccess}
        <div class="frame_table">
            <table class="table">
                <tbody>
                    <tr></tr>
                    <tr>
                        <td class="contact_info_heading">
                            first name:
                        </td>
                        <td>
                            {campaignUserInformation?.name_first}
                        </td>
                    </tr>
                    <tr>
                        <td class="contact_info_heading">
                            last name:
                        </td>
                        <td>
                            {campaignUserInformation?.name_last}
                        </td>
                    </tr>
                    <tr>
                        <td class="contact_info_heading">
                            email:
                        </td>
                        <td>
                            {userEmail}
                        </td>
                    </tr>
                    <tr>
                        <td class="contact_info_heading">
                            phone:
                        </td>
                        <td>
                            {campaignUserInformation?.phone_number}
                        </td>
                    </tr>
                    <tr>
                        <td class="contact_info_heading">
                            street address:
                        </td>
                        <td>
                            {campaignUserInformation?.street_address}
                        </td>
                    </tr>
                    <tr>
                        <td class="contact_info_heading">
                            street address 2:
                        </td>
                        <td>
                            {campaignUserInformation?.street_address_02}
                        </td>
                    </tr>
                    <tr>
                        <td class="contact_info_heading">
                            city:
                        </td>
                        <td>
                            {campaignUserInformation?.city}
                        </td>
                    </tr>
                    <tr>
                        <td class="contact_info_heading">
                            state:
                        </td>
                        <td>
                            {campaignUserInformation?.state}
                        </td>
                    </tr>
                    <tr>
                        <td class="contact_info_heading">
                            zip code:
                        </td>
                        <td>
                            {campaignUserInformation?.zip_code}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="edit_button">
            <a href="/authenticated-campaign/edit-campaign-user-contact-information">
                <EditButton>edit contact information</EditButton>
            </a>
        </div>
    {:else if !getCampaignUserInformationDataSuccess}
        failed to load campaign user information
    {/if}
</div>

<style>

    .tables_container {
        max-width: 58rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 auto;
    }

    .welcome_message {
        margin: 0 auto 1rem auto;
    }

    .my_campaigns {
        margin: 0 auto 1rem auto;
    }

    .add_campaign_button_container {
        margin: 0 auto 1rem auto;
    }

    .my_contact_information {
        margin: 1rem auto;
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

    .frame_table {
        width: 100%;
        overflow-x: hidden;
    }

    .table {
        margin: 0 0 1rem 0;
        border-spacing: 0;
        min-width: 100%;
        width: auto;
    }
    
    tbody tr:nth-child(even) {
        background-color: #FBF4F9;
    }

    tbody > tr > td {
        padding: 0.5rem;
        font-size: 1rem;
        overflow-wrap: break-word;
        hyphens: auto;
    }

    .table_column_header {
        padding: 0 0.5rem;
        font-size: 1rem;
        overflow-wrap: normal;
        hyphens: none;
        white-space: nowrap;
    }

    .contact_info_heading {
        font-weight: 600;
    }

    .edit_button {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin: 0 0 0 auto;
        gap: 0.5rem;
        padding: 1rem;
    }

    @media (max-width: 1140px) {

        .table_column_header {
            font-size: 0.9rem;
        }

        tbody > tr > td {
            font-size: 0.9rem;
            padding: 0.4rem;
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

        .table_column_header {
            font-size: 0.8rem;
        }

        tbody > tr > td {
            font-size: 0.8rem;
            padding: 0.25rem;
        }

        .icon_container {
            max-width: 1rem;
            min-width: 1rem;
        }

	}

</style>
