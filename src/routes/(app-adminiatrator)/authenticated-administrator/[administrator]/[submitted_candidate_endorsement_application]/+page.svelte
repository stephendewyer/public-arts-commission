<script lang="ts">
    import ExternalLinkIcon from "$lib/images/icons/external_link_icon.svg?raw";
    import SubmitButtonSecondary from "$lib/components/buttons/SubmitButtonSecondary.svelte";
    import YesNoRadioButtons from "$lib/components/inputs/YesNoRadioButtons.svelte";
    import { ModalOpenStore } from "$lib/stores/ModelOpenStore.js";
    import { CampaignActionConfirmationStore } from "$lib/stores/CampaignActionConfirmationStore.js";
    import { CampaignActionConfirmedStore } from "$lib/stores/CampaignActionConfirmedStore.js";
    import CancelButton from "$lib/components/buttons/CancelButton.svelte";
    import { goto } from "$app/navigation";
    import PendingFlashMessage from "$lib/components/flashMessages/PendingFlashMessage.svelte";
    import SuccessFlashMessage from "$lib/components/flashMessages/SuccessFlashMessage.svelte";
    import ErrorFlashMessage from "$lib/components/flashMessages/ErrorFlashMessage.svelte";

    export let data;

    let endorse: string | any;

    $: endorse;

    const candidateApplication: CampaignApplicationWithImageRow | any = data.streamed.candidateApplication;

    let electionYear: number = new Date(candidateApplication.general_election_date).getFullYear();

    const primaryElectionDate: string = new Date(candidateApplication.primary_election_date).toUTCString().substring(0, 16);

    const generalElectionDate: string = new Date(candidateApplication.general_election_date).toUTCString().substring(0, 16);

    const currentDate: Date = new Date();

    const submitActionHandler = () => {

        $CampaignActionConfirmationStore = {
            candidate_application: candidateApplication,
            selected: endorse
        };

        $ModalOpenStore = true;

    };

    let responseItem: ResponseObj = {
        success: "",
        error: "",
        status: null
    };

    $: if((responseItem.success) || (responseItem.error)) {
        setTimeout(() => {
            responseItem.success = "";
            responseItem.error = "";
            status: null;
        }, 4000)
    };

    const campaignEndorsementAction = async (
        candidateApplication: CampaignApplicationWithImageRow | null,
        endorse: string
    ) => {        

        const response = await fetch("/authenticated-administrator/api/campaignEndorsementAction", {
            method: 'POST',
            body: JSON.stringify({
                candidateApplication,
                endorse
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        responseItem = await response.json();

        if (responseItem.success) {

            $CampaignActionConfirmedStore = false;

            goto("/authenticated-administrator/admin");

        };

    };

    const confirmedAction = async () => {

        try {

            await campaignEndorsementAction(
                candidateApplication,
                endorse
            );

        } catch (error) {

            console.log(error);

        };

    };

    $: if ($CampaignActionConfirmedStore === true) {

        confirmedAction();

    };

    let pending: boolean = false;

    $: if((responseItem.success) || (responseItem.error)) {
        pending = false;
    };

</script>
<div class="campaign_questionnaire_container">
    <h2>
        candidate endorsement application
    </h2>
    <form on:submit|preventDefault={submitActionHandler}>
        <YesNoRadioButtons 
            bind:selected={endorse}
        >
            <span slot="yes">endorse</span>
            <span slot="no">not endorse</span>
        </YesNoRadioButtons>
        <SubmitButtonSecondary disable={(endorse === "yes" || endorse === "no") ? false : true}>confirm</SubmitButtonSecondary>
    </form>
    {#if (pending)}
        <PendingFlashMessage >
            please wait while we validate your data
        </PendingFlashMessage>
    {:else if (responseItem.error)}
        <ErrorFlashMessage >
            {responseItem.error}
        </ErrorFlashMessage>
    {:else if (responseItem.success)}
        <SuccessFlashMessage>
            {responseItem.success}
        </SuccessFlashMessage>
    {/if}
    <h4 style="margin: 0;">
        {candidateApplication.campaign_name}
    </h4>
    <h2 style="margin: 1rem 0 0 0;">
        campaign registration
    </h2>
    <div class="campaign_image_container">
        <img src={candidateApplication.image_URL} alt="test"/>
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
                        {candidateApplication.campaign_name}
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
                        {candidateApplication.electorate}
                    </td>
                </tr>
                <tr>
                    <td class="table_key">
                        government level:
                    </td>
                    <td>
                        {candidateApplication.government_level}
                    </td>
                </tr>
                {#if candidateApplication.state}
                    <tr>
                        <td class="table_key">
                            state:
                        </td>
                        <td>
                            {candidateApplication.state}
                        </td>
                    </tr>
                {/if}
                {#if candidateApplication.county}
                    <tr>
                        <td class="table_key">
                            county:
                        </td>
                        <td>
                            {candidateApplication.county}
                        </td>
                    </tr>
                {/if}
                {#if candidateApplication.city}
                    <tr>
                        <td class="table_key">
                            city:
                        </td>
                        <td>
                            {candidateApplication.city}
                        </td>
                    </tr>
                {/if}
                <tr>
                    <td class="table_key">
                        party:
                    </td>
                    <td>
                        {candidateApplication.party}
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
                        <a class="external_link_container" href={candidateApplication.website_URL} target="_blank">
                            <div class="external_link_icon">
                                {@html ExternalLinkIcon}
                            </div>
                            <span class="website_URL">
                                {candidateApplication.website_URL}
                            </span>
                        </a>
                    </td>
                </tr>
                <tr>
                    <td class="table_key">
                        starting year for office sought:
                    </td>
                    <td>
                            {candidateApplication.starting_year_for_office_sought}
                    </td>
                </tr>
                <tr>
                    <td class="table_key">
                        authorized campaign representative:
                    </td>
                    <td>
                        {#if (candidateApplication.authorized_campaign_representative === 1)}
                            yes 
                        {:else if (candidateApplication.authorized_campaign_representative === 0)}
                            no
                        {/if}
                    </td>
                </tr>
            </tbody>
        </table>
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
                            {#if (candidateApplication.excellent_public_art_for_all === 1)}
                                yes
                            {:else if (candidateApplication.excellent_public_art_for_all === 0)}
                                no
                            {/if}
                        </td>
                    </tr>
                </tbody>
            </table>
        </li>
        {#if (candidateApplication.excellent_public_art_for_all === 1)}
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
                                {candidateApplication.excellent_public_art_for_all_02}
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
                            {#if (candidateApplication.art_government_seat === 1)}
                                yes
                            {:else if (candidateApplication.art_government_seat === 0)}
                                no
                            {/if}
                        </td>
                    </tr>
                </tbody>
            </table>
        </li>
        {#if (candidateApplication.art_government_seat === 1)}
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
                                {candidateApplication.art_government_seat_02}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </li>
        {/if}
    </ol>
    <a href="/authenticated-administrator/admin">
        <CancelButton>admin dashboard</CancelButton>
    </a>
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

    .checkbox_container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .checkbox_container input[type="radio"] {
    display: none;
  }

  .checkbox_container .terms-label {
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .checkbox_container .checkbox-svg {
    width: 2.5rem;
    height: 2.5rem;
  }

  .checkbox_container .checkbox-box {
    fill: #EFF9F2;
    stroke: #CB6D44;
    stroke-dasharray: 800;
    stroke-dashoffset: 800;
    transition: stroke-dashoffset 0.6s ease-in, stroke 0.6s ease-in;
  }

  .checkbox_container .checkbox-tick {
    stroke: #CB6D44;
    stroke-dasharray: 172;
    stroke-dashoffset: 172;
    transition: stroke-dashoffset 0.6s ease-in, stroke 0.6s ease-in;
  }

  .checkbox_container input[type="radio"]:checked + .terms-label .checkbox-box,
  .checkbox_container input[type="radio"]:checked + .terms-label .checkbox-tick {
    stroke-dashoffset: 0;
    stroke: #1C2226;
    transition: stroke-dashoffset 0.6s ease-in, stroke 0.6s ease-in;
  }

  .checkbox_container input[type="radio"]:hover + .terms-label .checkbox-box {
    stroke-dashoffset: 0;
  }

  @media (max-width: 1440px) {

    .checkbox_container {
      font-size: 1.25rem;
      justify-content: center;
    }
  
  }

    @media (max-width: 720px) {
      .checkbox_container {
        font-size: 1rem;
      }
    }
</style>