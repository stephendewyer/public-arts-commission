<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import CampaignApplicationProgressBar from '$lib/components/campaignApplicationProgressBar/CampaignProgressBar.svelte';
    import AnimatedCheckbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
    import TextArea from '$lib/components/inputs/TextArea.svelte';
    import PendingFlashMessage from '$lib/components/flashMessages/PendingFlashMessage.svelte';
    import SuccessFlashMessage from '$lib/components/flashMessages/SuccessFlashMessage.svelte';
    import ErrorFlashMessage from '$lib/components/flashMessages/ErrorFlashMessage.svelte';
    import CancelButton from '$lib/components/buttons/CancelButton.svelte';
    import ActionButton from '$lib/components/buttons/ActionButton.svelte';
    import SubmitButtonSecondary from '$lib/components/buttons/SubmitButtonSecondary.svelte';
    import { goto } from '$app/navigation';

    export let data: any;

    const campaignApplication: CampaignApplicationWithImageRow = data.streamed.campaignApplication;

    let expandPoliticalImaginationSupportValue: boolean = campaignApplication.excellent_public_art_for_all ? true : false;
    let howExpandPoliticalImaginationValue: string = campaignApplication.excellent_public_art_for_all_02 ? campaignApplication.excellent_public_art_for_all_02 : "";
    let artSeatAtTableGovernmentValue: boolean = campaignApplication.art_government_seat ? true : false;
    let howArtSeatTableGovernmentValue: string = campaignApplication.art_government_seat_02 ? campaignApplication.art_government_seat_02 : "";

    $: if (!expandPoliticalImaginationSupportValue) {
        howExpandPoliticalImaginationValue = "";
    };

    $: if (!artSeatAtTableGovernmentValue) {
        howArtSeatTableGovernmentValue = "";
    };

    let howExpandPoliticalImaginationIsValid: boolean = true;
    let howArtSeatTableGovernmentIsValid: boolean = true;

    let campaignApplicationSubmitted: boolean = campaignApplication.campaign_application_submitted ? true : false;
    let campaignQuestionnaireCompleted: boolean = campaignApplication.campaign_questionnaire_completed ? true : false;
    let campaignRegistrationCompleted: boolean = campaignApplication.campaign_registered ? true : false;

    let navPaths: NavPath[] = [
        {
            id: "registration",
            name: "registration",
            path: `/authenticated-campaign/campaign-registration/campaign=${campaignApplication.campaign_application_ID}`,
            completed: campaignRegistrationCompleted
        },
        {
            id: "questionnaire",
            name: "questionnaire",
            path: `/authenticated-campaign/campaign-questionnaire/campaign=${campaignApplication.campaign_application_ID}`,
            completed: campaignQuestionnaireCompleted
        },
        {
            id: "submit",
            name: "submit",
            path: `/authenticated-campaign/campaign-submit/campaign=${campaignApplication.campaign_application_ID}`,
            completed: campaignApplicationSubmitted
        }
    ];

    let howExcellentPublicArtForEveryoneErrorMessage: string = "how you will make excellent public art available to everyone is required!";
    let howGiveArtsCommunityGovernmentSeatErrorMessage: string = "how you will give the arts commmunity a seat at the table in government is required!";
    
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

    const submitCampaignQuestionnaire = async (
        campaignApplicationID: number,
        campaignName: string,
        expandPoliticalImaginationSupport: boolean,
        howExpandPoliticalImagination: string,
        artSeatAtTableGovernment: boolean,
        howArtSeatTableGovernment: string
    ) => {
        const response = await fetch("/authenticated-campaign/api/addCampaignQuestionnaire", {
            method: 'POST',
            body: JSON.stringify({
                campaignApplicationID,
                campaignName,
                expandPoliticalImaginationSupport,
                howExpandPoliticalImagination,
                artSeatAtTableGovernment,
                howArtSeatTableGovernment
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        responseItem = await response.json();

        return responseItem;
    };

    const submitCampaignQuestionnaireHandler = async () => {

        pending = true;

        try {
            
            await submitCampaignQuestionnaire(
                campaignApplication.campaign_application_ID,
                campaignApplication.campaign_name,
                expandPoliticalImaginationSupportValue,
                howExpandPoliticalImaginationValue,
                artSeatAtTableGovernmentValue,
                howArtSeatTableGovernmentValue
            );
            if (responseItem.success) {
                goto(`/authenticated-campaign/campaign-submit/campaign=${campaignApplication.campaign_application_ID}`);
            };

            if (responseItem.error) {

                if (
                    expandPoliticalImaginationSupportValue === true && 
                    howExpandPoliticalImaginationValue === ""
                ) {
                    howExpandPoliticalImaginationIsValid = false;
                };
                if (
                    artSeatAtTableGovernmentValue === true &&
                    howArtSeatTableGovernmentValue === ""
                ) {
                    howArtSeatTableGovernmentIsValid = false;
                };

            };
        } catch (error) {

            console.log(error);

        };

    };

    const updateCampaignQuestionnaire = async (
        campaignApplicationID: number,
        campaignName: string,
        expandPoliticalImaginationSupport: boolean,
        howExpandPoliticalImagination: string,
        artSeatAtTableGovernment: boolean,
        howArtSeatTableGovernment: string
    ) => {
        const response = await fetch("/authenticated-campaign/api/updateCampaignQuestionnaire", {
            method: 'PATCH',
            body: JSON.stringify({
                campaignApplicationID,
                campaignName,
                expandPoliticalImaginationSupport,
                howExpandPoliticalImagination,
                artSeatAtTableGovernment,
                howArtSeatTableGovernment
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        responseItem = await response.json();

        return responseItem;
    };

    const updateCampaignQuestionnaireHandler = async () => {
        pending = true;

        try {
            
            await updateCampaignQuestionnaire(
                campaignApplication.campaign_application_ID,
                campaignApplication.campaign_name,
                expandPoliticalImaginationSupportValue,
                howExpandPoliticalImaginationValue,
                artSeatAtTableGovernmentValue,
                howArtSeatTableGovernmentValue
            );

            if (responseItem.error) {

                if (
                    expandPoliticalImaginationSupportValue === true && 
                    howExpandPoliticalImaginationValue === ""
                ) {
                    howExpandPoliticalImaginationIsValid = false;
                };
                if (
                    artSeatAtTableGovernmentValue === true &&
                    howArtSeatTableGovernmentValue === ""
                ) {
                    howArtSeatTableGovernmentIsValid = false;
                };

            };
        } catch (error) {

            console.log(error);

        };

    };

    $: if((responseItem.success) || (responseItem.error)) {
        pending = false;
    };

</script>
<svelte:head>
	<title>campaign questionnaire - public arts commission</title>
	<meta name="description" content="edit and submit campaign questionnaire" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<div class="campaign_questionnaire_container">
    <h2>
        campaign endorsement application
    </h2>
    <h4 style="margin: 0;">
        {campaignApplication.campaign_name}
    </h4>
    <CampaignApplicationProgressBar nav_paths={navPaths}/>
    <h1>
        campaign questionnaire
    </h1>
    <form 
        class="form_container"
        on:submit|preventDefault={updateCampaignQuestionnaireHandler}
    >
        <ol>
            <li>
                Does your campaign support expanding our political imagination by making excellent public art available to everyone?
                <div class="two_columns_checkbox">
                    <AnimatedCheckbox 
                        bind:checked={expandPoliticalImaginationSupportValue}
                    >
                        yes
                    </AnimatedCheckbox>
                </div>
            </li>
            {#if expandPoliticalImaginationSupportValue}
                <li>
                    How will your campaign help make excellent public art available to everyone?
                    <TextArea 
                        inputLabel={true}
                        bind:textareaInputValue={howExpandPoliticalImaginationValue}
                        bind:isValid={howExpandPoliticalImaginationIsValid}
                        placeholder="If elected, I would..."
                        inputName="how_expand_political_imagination"
                        inputID="how_expand_political_imagination"
                        required={true}
                        textAreaInputErrorMessage={howExcellentPublicArtForEveryoneErrorMessage}
                    />
                </li>
            {/if}
            <li>
                Does your campaign support giving the arts community and especially art workers a seat at the table in government?
                <div class="two_columns_checkbox">
                    <AnimatedCheckbox 
                        bind:checked={artSeatAtTableGovernmentValue}
                    >
                        yes
                    </AnimatedCheckbox>
                </div>
            </li>
            {#if artSeatAtTableGovernmentValue}
                <li>
                    How will your campaign help give the arts community and especially art workers a seat at the table in government?
                    <TextArea 
                        inputLabel={true}
                        bind:textareaInputValue={howArtSeatTableGovernmentValue}
                        bind:isValid={howArtSeatTableGovernmentIsValid}
                        placeholder="If elected, I would..."
                        inputName="how_give_arts_community_seat_at_government_table"
                        inputID="how_give_arts_community_seat_at_government_table"
                        required={true}
                        textAreaInputErrorMessage={howGiveArtsCommunityGovernmentSeatErrorMessage}
                    />
                </li>
            {/if}
        </ol>
        <SubmitButtonSecondary disable={false}>save changes</SubmitButtonSecondary>
    </form>
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
        <a href={`/authenticated-campaign/campaign-registration/campaign=${campaignApplication.campaign_application_ID}`} class="cancel_button_container">
            <CancelButton>
                campaign registration
            </CancelButton>
        </a>
        {#if (campaignApplication.campaign_questionnaire_completed === 1)}
            <a href={`/authenticated-campaign/campaign-submit/campaign=${campaignApplication.campaign_application_ID}`}>
                <ActionButton>
                    view and submit
                </ActionButton>
            </a>
        {:else if (!campaignApplication.campaign_questionnaire_completed)}
            <div
                role={"button"}
                on:click={() => submitCampaignQuestionnaireHandler()}
                on:keyup={() => submitCampaignQuestionnaireHandler()}
            >
                <ActionButton>
                    view and submit
                </ActionButton>
            </div>
        {/if}
    </div>
</div>

<style>

    ol {
        padding: 0;
        margin: 0;
        gap: 1rem;
        display: flex;
        flex-direction: column;
    }

    li {
        font-size: 1.5rem;
        font-weight: 600;
    }

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

    .two_columns_checkbox {
        display: flex;
        width: 100%;
        padding: 1rem 0 0 0;
    }

    .two_columns {
        display: flex;
        justify-content: space-evenly;
        width: 100%;
        gap: 1rem;
        align-items: center;
    }

    .cancel_button_container {
        margin: 0;
    }
    
    @media (max-width: 1440px) {

        li {
            font-size: 1.25rem;
        }

    }

    @media (max-width: 720px) {

        li {
            font-size: 1rem;
        }

        .campaign_questionnaire_container {
            width: auto;
            padding: 0 2rem;
            margin: 0;
        }

        .two_columns_checkbox {
            display: flex;
            width: 100%;
            gap: 0.5rem;
        }

    }

</style>