<script lang="ts">
    import { onMount } from 'svelte';
    import Meatballs from '$lib/images/icons/meaballs.svg?raw';
    import Arrow from '$lib/images/icons/arrow.svg?raw';
    import EditIcon from '$lib/images/icons/edit_icon.svg?raw';
    import SubtractItemButton from "$lib/components/buttons/SubtractItemButton.svelte";
    import AddItemButton from '$lib/components/buttons/AddItemButton.svelte';
    import LoaderAnimation from '$lib/components/loaders/LoaderAnimation.svelte';
    import TableActionButton from '$lib/components/buttons/TableActionButton.svelte';

    export let data;

    $: data;

    let userEmail = data.streamed.user?.email;

    // begin get user campaign applications

	let userCampaignApplications: CampaignApplication[] = [];

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
    
</script>

<div class="tables_container">
    <h1 class="welcome_message">
        welcome, {campaignUserInformation?.name_first} {campaignUserInformation?.name_last}!
    </h1>
    <h2 class="my_campaigns">
        my campaigns
    </h2>
    <div class="add_campaign_button_container">
        <a href="/authenticated-campaign/campaign/campaign-registration">
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
                            <h5 class="table_column_header">
                                delete
                            </h5>
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
                                {#if (campaignApplication.application_status === "submitted")}
                                    submitted 
                                {:else if (
                                    campaignApplication.application_status === "started" ||
                                    !campaignApplication.application_status
                                )}
                                    started 
                                {/if}
                            </td>
                            <td>
                                {#if (campaignApplication.application_status === "submitted")}
                                    <div class="icon_container">
                                        {@html Meatballs}
                                    </div>
                                {:else if (
                                    campaignApplication.application_status === "started" ||
                                    !campaignApplication.application_status
                                )}
                                    <TableActionButton>complete</TableActionButton>
                                {/if}
                            </td>
                            <td>
                                {#if (
                                    campaignApplication.application_status === "started" ||
                                    !campaignApplication.application_status
                                )}
                                    <SubtractItemButton index={i} />
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
            <span>edit contact information</span>
            <div class="icon_container">
                {@html EditIcon}
            </div>
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

    .table {
        margin: 0 0 1rem 0;
    }

    .icon_container {
        width: 100%;
        height: 100%;
        max-width: 1.5rem;
        max-height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .frame_table {
        width: 100%;
        overflow-x: hidden;
    }

    table {
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

	}

</style>
