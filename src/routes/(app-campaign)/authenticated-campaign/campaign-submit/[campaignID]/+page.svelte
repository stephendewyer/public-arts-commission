<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import CampaignApplicationProgressBar from '$lib/components/campaignApplicationProgressBar/CampaignProgressBar.svelte';
    import EditButton from '$lib/components/buttons/EditButton.svelte';
    import ExternalLinkIcon from '$lib/images/icons/external_link_icon.svg?raw';
    import CancelButton from '$lib/components/buttons/CancelButton.svelte';
    import ActionButton from '$lib/components/buttons/ActionButton.svelte';
    import PendingFlashMessage from "$lib/components/flashMessages/PendingFlashMessage.svelte";
    import SuccessFlashMessage from "$lib/components/flashMessages/SuccessFlashMessage.svelte";
    import ErrorFlashMessage from "$lib/components/flashMessages/ErrorFlashMessage.svelte";
    import { goto } from '$app/navigation';

    export let data: any;

    const userEmail: string = data.streamed.user.email;

    let campaignApplication: CampaignApplicationWithImageRow | null = data.streamed.campaignApplication ? data.streamed.campaignApplication : null;

    let campaignApplicationID: number | null = campaignApplication?.campaign_application_ID ? campaignApplication.campaign_application_ID : null;

    let campaignApplicationUserID: number | null = campaignApplication?.user_ID ? campaignApplication.user_ID : null;

    let campaignName: string = campaignApplication?.campaign_name ? campaignApplication.campaign_name : "";

    let electionYear: number | string = campaignApplication?.general_election_date ? new Date(campaignApplication.general_election_date).getFullYear() : "";

    let primaryElectionDate: string = campaignApplication?.primary_election_date ? new Date(campaignApplication.primary_election_date).toUTCString().substring(0, 16) : "";

    let generalElectionDate: string = campaignApplication?.general_election_date ? new Date(campaignApplication.general_election_date).toUTCString().substring(0, 16) : "";

    let currentDate: Date = new Date();

    let campaignApplicationSubmitted: boolean = campaignApplication?.campaign_application_submitted ? true : false;
    let campaignQuestionnaireCompleted: boolean = campaignApplication?.campaign_questionnaire_completed ? true : false;
    let campaignRegistrationCompleted: boolean = campaignApplication?.campaign_registered ? true : false;

    let navPaths: NavPath[] = [
        {
            id: "registration",
            name: "registration",
            path: `/authenticated-campaign/campaign-registration/campaign=${campaignApplicationID}`,
            completed: campaignRegistrationCompleted
        },
        {
            id: "questionnaire",
            name: "questionnaire",
            path: `/authenticated-campaign/campaign-questionnaire/campaign=${campaignApplicationID}`,
            completed: campaignQuestionnaireCompleted
        },
        {
            id: "submit",
            name: "submit",
            path: `/authenticated-campaign/campaign-submit/campaign=${campaignApplicationID}`,
            completed: campaignApplicationSubmitted
        }
    ];

    let responseItem: ResponseObjWithData = {
        success: {
            message: "",
            campaign_application_ID: null
        },
        error: "",
        status: null
    };

    $: if((responseItem.success) || (responseItem.error)) {
        setTimeout(() => {
            responseItem.success = {
                message: "",
                campaign_application_ID: null
            };
            responseItem.error = "";
            status: null;
        }, 4000)
    };

    let pending: boolean = false;

    $: if((responseItem.success) || (responseItem.error)) {
        pending = false;
    };

    const submitApplication = async (
        campaignApplicationID: number | null,
        campaignUserID: number | null,
        campaignName: string,
        currentDate: Date,
        userEmail: string
    ) => {
        const response = await fetch("/authenticated-campaign/api/submitCampaignApplication", {
            method: 'POST',
            body: JSON.stringify({
                campaignApplicationID,
                campaignUserID,
                campaignName,
                currentDate,
                userEmail
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        responseItem = await response.json();

        return responseItem;

    };

    const submitApplicationHandler = async () => {

        pending = true;

        // add the submitted form data to and image URL from Cloudinary to the database

        try {
            
            await submitApplication(
                campaignApplicationID,
                campaignApplicationUserID,
                campaignName,
                currentDate,
                userEmail
            );

            if (responseItem.success) {

                goto(`/authenticated-campaign/campaign-submit-confirmation/campaign=${campaignApplicationID}`);

            };

        } catch (error) {

            console.log(error);

        };
        
    };

</script>
<svelte:head>
	<title>review and submit campaign application for endorsement - public arts commission</title>
	<meta name="description" content="review and submit campaign application for endorsement" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<div class="campaign_questionnaire_container">
    <h2>
        campaign endorsement application
    </h2>
    <h4 style="margin: 0;">
        {campaignApplication?.campaign_name}
    </h4>
    <CampaignApplicationProgressBar nav_paths={navPaths}/>
    <h2 style="margin: 1rem 0 0 0;">
        campaign registration
    </h2>
    <div class="campaign_image_container">
        <img src={campaignApplication?.image_URL} alt="test"/>
    </div>
    <div class="frame_table">
        <table class="table">
            <colgroup>
                <col style="width:40%">
                <col style="width:60%">
            </colgroup> 
            <tbody class="campaign_registration">
                <tr>
                    <td class="table_key">
                        campaign name:
                    </td>
                    <td>
                        {campaignApplication?.campaign_name}
                    </td>
                </tr>
                <tr>
                    <td class="table_key">
                        election year:
                    </td>
                    <td>
                        {electionYear}
                    </td>
                </tr>
                <tr>
                    <td class="table_key">
                        electorate:
                    </td>
                    <td>
                        {campaignApplication?.electorate}
                    </td>
                </tr>
                <tr>
                    <td class="table_key">
                        government level:
                    </td>
                    <td>
                        {campaignApplication?.government_level}
                    </td>
                </tr>
                {#if campaignApplication?.state}
                    <tr>
                        <td class="table_key">
                            state:
                        </td>
                        <td>
                            {campaignApplication.state}
                        </td>
                    </tr>
                {/if}
                {#if campaignApplication?.county}
                    <tr>
                        <td class="table_key">
                            county:
                        </td>
                        <td>
                            {campaignApplication.county}
                        </td>
                    </tr>
                {/if}
                {#if campaignApplication?.city}
                    <tr>
                        <td class="table_key">
                            city:
                        </td>
                        <td>
                            {campaignApplication.city}
                        </td>
                    </tr>
                {/if}
                <tr>
                    <td class="table_key">
                        party:
                    </td>
                    <td>
                        {campaignApplication?.party}
                    </td>
                </tr>
                <tr>
                    <td class="table_key">
                        primary election date:
                    </td>
                    <td>
                        {primaryElectionDate}
                    </td>
                </tr>
                <tr>
                    <td class="table_key">
                        general election date:
                    </td>
                    <td>
                        {generalElectionDate}
                    </td>
                </tr>
                <tr>
                    <td class="table_key">
                        website:
                    </td>
                    <td>
                        <a class="external_link_container" href={campaignApplication?.website_URL} target="_blank">
                            <div class="external_link_icon">
                                {@html ExternalLinkIcon}
                            </div>
                            <span class="website_URL">
                                {campaignApplication?.website_URL}
                            </span>
                        </a>
                    </td>
                </tr>
                <tr>
                    <td class="table_key">
                        starting year for office sought:
                    </td>
                    <td>
                            {campaignApplication?.starting_year_for_office_sought}
                    </td>
                </tr>
                <tr>
                    <td class="table_key">
                        authorized campaign representative:
                    </td>
                    <td>
                        {#if (campaignApplication?.authorized_campaign_representative === 1)}
                            yes 
                        {:else if (campaignApplication?.authorized_campaign_representative === 0)}
                            no
                        {/if}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="edit_button_container">
        <a href={`/authenticated-campaign/campaign-registration/campaign=${campaignApplicationID}`}>
            <EditButton>edit registration information</EditButton>
        </a>
    </div>
    <h2 style="margin: 1rem 0 0 0;">campaign questionnaire</h2>
    <ol>
        <li>
            <table>
                <tbody>
                    <tr>
                        <td>
                            Does your campaign support expanding our political imagination by making excellent public art available to everyone?
                        </td>
                    </tr>
                    <tr>
                        <td class="response">
                            {#if (campaignApplication?.excellent_public_art_for_all === 1)}
                                yes
                            {:else if (campaignApplication?.excellent_public_art_for_all === 0)}
                                no
                            {/if}
                        </td>
                    </tr>
                </tbody>
            </table>
        </li>
        {#if (campaignApplication?.excellent_public_art_for_all === 1)}
            <li>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                How will your campaign help make excellent public art available to everyone?
                            </td>
                        </tr>
                        <tr>
                            <td class="response">
                                {campaignApplication.excellent_public_art_for_all_02}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </li>
        {/if}
        <li>
            <table>
                <tbody>
                    <tr>
                        <td>
                            Does your campaign support giving the arts community including art workers a seat at the table in government?
                        </td>
                    </tr>
                    <tr>
                        <td class="response">
                            {#if (campaignApplication?.art_government_seat === 1)}
                                yes
                            {:else if (campaignApplication?.art_government_seat === 0)}
                                no
                            {/if}
                        </td>
                    </tr>
                </tbody>
            </table>
        </li>
        {#if (campaignApplication?.art_government_seat === 1)}
            <li>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                How will your campaign help give the arts community including art workers a seat at the table in government?
                            </td>
                        </tr>
                        <tr>
                            <td class="response">
                                {campaignApplication.art_government_seat_02}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </li>
        {/if}
    </ol>
    <div class="edit_button_container">
        <a href={`/authenticated-campaign/campaign-questionnaire/campaign=${campaignApplicationID}`}>
            <EditButton>edit questionnaire responses</EditButton>
        </a>
    </div>
    {#if (pending)}
        <PendingFlashMessage >
            please wait while we validate your data
        </PendingFlashMessage>
    {:else if (responseItem.error)}
        <ErrorFlashMessage >
            {responseItem.error}
        </ErrorFlashMessage>
    {:else if (responseItem.success.message)}
        <SuccessFlashMessage>
            {responseItem.success.message}
        </SuccessFlashMessage>
    {/if}
    <div class="two_columns">
        <a href={`/authenticated-campaign/campaign-questionnaire/campaign=${campaignApplicationID}`} class="cancel_button_container">
            <CancelButton>
                quesionnaire
            </CancelButton>
        </a>
        <div
            role={"button"}
            on:click={() => submitApplicationHandler()}
            on:keyup={() => submitApplicationHandler()}
        >
            <ActionButton>
                submit application
            </ActionButton>
        </div>
    </div>
</div>

<style>
    .campaign_questionnaire_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        max-width: 40rem;
        width: 100%;
        padding: 0 1rem;
        margin: 0 auto;
    }

    .campaign_image_container {
        padding: 1rem 0;
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
    }

    .table_key {
        font-weight: 600;
    }

    .edit_button_container {
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }

    tbody > tr > td {
        padding: 1rem;
        font-size: 1.25rem;
    }

    .campaign_registration td:nth-child(odd) {
        font-weight: 600;
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-start;
    }

    .external_link_container {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        margin-right: 2rem;
    }

    .external_link_icon {
        min-width: 1.5rem;
        width: 1.5rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .website_URL {
        overflow-wrap: break-word;
        hyphens: auto;
        font-size: 1.25rem;
    }

    ol {
        padding: 0;
        margin: 0;
        font-weight: 600;
    }

    .response {
        font-weight: 500;
    }

    table {
        width: 100%;
    }

    .two_columns {
        display: flex;
        justify-content: space-evenly;
        width: 100%;
        gap: 1rem;
        align-items: center;
    }

    @media (max-width: 1440px) {

        tbody > tr > td {
            padding: 0.5rem;
            font-size: 1rem;
        }

        .website_URL {
            font-size: 1rem;
        }
    }

    @media (max-width: 720px) {

        .campaign_questionnaire_container {
            padding: 0;
            margin: 0;
        }

        tbody > tr > td {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
        }

        .frame_table {
            width: 100%;
            overflow-x: scroll;
        }

        .table {
            width: 100%;
        }

        .website_URL {
            font-size: 0.8rem;
        }

        .external_link_icon {
            width: 1rem;
            min-width: 1rem;
        }
    }
</style>