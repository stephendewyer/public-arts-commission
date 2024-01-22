<script lang="ts">
    import CampaignApplicationProgressBar from '$lib/components/campaignApplicationProgressBar/CampaignProgressBar.svelte';
    import ImageFileInput from '$lib/components/inputs/ImageFileInput.svelte';
    import TextInput from '$lib/components/inputs/TextInput.svelte';
    import NumberInput from '$lib/components/inputs/NumberInput.svelte';
    import DateInput from '$lib/components/inputs/DateInput.svelte';
    import SelectInput from '$lib/components/inputs/SelectInput.svelte';
    import TextInputReadonly from '$lib/components/inputs/TextInputReadonly.svelte';
    import ActionButton from "$lib/components/buttons/ActionButton.svelte";
    import PendingFlashMessage from "$lib/components/flashMessages/PendingFlashMessage.svelte";
    import SuccessFlashMessage from "$lib/components/flashMessages/SuccessFlashMessage.svelte";
    import ErrorFlashMessage from "$lib/components/flashMessages/ErrorFlashMessage.svelte";
    import GovernmentLevel from "$lib/data/governmentLevel.json";
    import States from '$lib/data/states.titlecase.json';
    import CancelButton from '$lib/components/buttons/CancelButton.svelte';
    import AnimatedCheckbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
    import InputErrorMessage from '$lib/components/errorMessages/InputErrorMessage.svelte';
    import { goto } from '$app/navigation';
    import { ConvertDateInputFormat } from '$lib/utils/ConvertDateInputFormat.js';
    import SubmitButtonSecondary from '$lib/components/buttons/SubmitButtonSecondary.svelte';

    export let data;

    let campaignApplication: CampaignApplicationWithImageRow | any = null;
    
    if (data.campaignApplication) {

        campaignApplication = data.campaignApplication;

    };

    let campaignApplicationID: number | any = campaignApplication.campaign_application_ID;
    let campaignUserID: number | any = campaignApplication.user_ID;
    let imageFileInputValue: string = "";
    let imageAltTextInputValue: string | any = campaignApplication.alt_text;
    let image: string = campaignApplication.image_URL;
    let imageID: number | any = campaignApplication.image_ID;
    let imagePublicID: string = campaignApplication.public_ID;
    let campaignNameInputValue: string = campaignApplication.campaign_name;
    let electorateInputValue: string = campaignApplication.electorate;
    let yearOfficeSoughtInputValue: number | null = campaignApplication.starting_year_for_office_sought;
    let electionDatePrimaryInputValue: string = ConvertDateInputFormat(new Date(campaignApplication.primary_election_date));
    let electionDateGeneralInputValue: string = ConvertDateInputFormat(new Date(campaignApplication.general_election_date));
    let governmentLevelInputValue: string = campaignApplication.government_level;
    let stateInputValue: string = campaignApplication.state;
    let countyInputValue: string = campaignApplication.county;
    let cityInputValue: string = campaignApplication.city;
    let partyInputValue: string = campaignApplication.party;
    let websiteURLInputValue: string = campaignApplication.website_URL;
    let authorizedRepresentativeInputValue: boolean = campaignApplication.authorized_campaign_representative;

    let imageFileIsValid: boolean = true;
    let imageAltTextIsValid: boolean = true;
    let campaignNameIsValid: boolean = true;
    let yearOfficeSoughtIsValid: boolean = true;
    let electionDatePrimaryIsValid: boolean = true;
    let electionDateGeneralIsValid: boolean = true;
    let governmentLevelIsValid: boolean = true;
    let countryIsValid: boolean = true;
    let stateIsValid: boolean = true;
    let countyIsValid: boolean = true;
    let cityIsValid: boolean = true;
    let partyIsValid: boolean = true;
    let websiteURLIsValid: boolean = true;
    let electorateIsValid: boolean = true;
    let authorizedRepresentativeIsValid: boolean = true;

    const governmentLevelOptions: GovernmentLevel[] = GovernmentLevel;

    $: if (authorizedRepresentativeInputValue === true) {
        authorizedRepresentativeIsValid = true;
    };

    let authorizedRepresentativeInputErrorMessage: string = "campaign authorization required to create account"

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

    const updateCampaignRegistrationInformation = async (
        campaignApplicationID: number,
        campaignUserID: number,
        imageID: number,
        imagePublicID: string,
        imageFile: string,
        imageAltText: string,
        image: any,
        campaignName: string,
        electorate: string,
        yearOfficeSought: number | null,
        electionDatePrimary: string,
        electionDateGeneral: string,
        governmentLevel: string,
        state: string,
        county: string,
        city: string,
        party: string,
        websiteURL: string,
        authorizedRepresentative: boolean
    ) => {
        const response = await fetch("/authenticated-campaign/api/updateCampaignRegistration", {
            method: 'PATCH',
            body: JSON.stringify({
                campaignApplicationID,
                campaignUserID,
                imageID,
                imagePublicID,
                imageFile,
                imageAltText,
                image,
                campaignName,
                electorate,
                yearOfficeSought,
                electionDatePrimary,
                electionDateGeneral,
                governmentLevel,
                state,
                county,
                city,
                party,
                websiteURL,
                authorizedRepresentative
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        responseItem = await response.json();

        return responseItem;

    };

    const updateCampaignRegistrationHandler = async () => {

        pending = true;

        // add the submitted form data to and image URL from Cloudinary to the database

        try {
            
            await updateCampaignRegistrationInformation(
                campaignApplicationID,
                campaignUserID,
                imageID,
                imagePublicID,
                imageFileInputValue,
                imageAltTextInputValue,
                image,
                campaignNameInputValue,
                electorateInputValue,
                yearOfficeSoughtInputValue,
                electionDatePrimaryInputValue,
                electionDateGeneralInputValue,
                governmentLevelInputValue,
                stateInputValue,
                countyInputValue,
                cityInputValue,
                partyInputValue,
                websiteURLInputValue,
                authorizedRepresentativeInputValue
            );
            if (responseItem.success) {
                imageID = null;
                imagePublicID = "";
                imageFileInputValue = "";
                imageAltTextInputValue = "";
                image = "";
                campaignNameInputValue = "";
                yearOfficeSoughtInputValue = null;
                electionDatePrimaryInputValue = "";
                electionDateGeneralInputValue = "";
                governmentLevelInputValue = "";
                stateInputValue = "";
                countyInputValue = "";
                cityInputValue = "";
                partyInputValue = "";
                websiteURLInputValue = "";
                authorizedRepresentativeInputValue = false;
                goto(`/authenticated-campaign/campaign/campaign-questionnaire/campaign=${campaignApplication.campaign_application_ID}`);
            };

            if (responseItem.error) {

                if (imageAltTextInputValue === "") {
                    imageAltTextIsValid = false;
                };
                if (imageFileInputValue === "") {
                    imageFileIsValid = false;
                };

                if (governmentLevelInputValue === "") {
                    governmentLevelIsValid = false;
                };

                if (campaignNameInputValue === "") {
                    campaignNameIsValid = false;
                };

                if (!yearOfficeSoughtInputValue) {
                    yearOfficeSoughtIsValid = false;
                };

                if (!electionDateGeneralInputValue) {
                    electionDateGeneralIsValid = false;
                };

                if (!authorizedRepresentativeInputValue) {
                    authorizedRepresentativeIsValid = false;
                };

            };
        } catch (error) {

            console.log(error);

        };
    };

    let pending: boolean = false;

    $: if((responseItem.success) || (responseItem.error)) {
        pending = false;
    };

    let navPaths: NavPath[];

    $: navPaths = [
        {
            id: "registration",
            name: "registration",
            path: `/authenticated-campaign/campaign/campaign-registration/campaign=${campaignApplication.campaign_application_ID}`,
            completed: campaignApplication.campaign_registered
        },
        {
            id: "questionnaire",
            name: "questionnaire",
            path: `/authenticated-campaign/campaign/campaign-questionnaire/campaign=${campaignApplication.campaign_application_ID}`,
            completed: campaignApplication.campaign_questionnaire_completed
        },
        {
            id: "submit",
            name: "submit",
            path: `/authenticated-campaign/campaign/campaign-submit/campaign=${campaignApplication.campaign_application_ID}`,
            completed: campaignApplication.campaign_application_submitted
        }
    ];

</script>

<div class="campaign_registration_container">
    <h2>
        campaign endorsement application
    </h2>
    <h4 style="margin: 0;">
        {campaignApplication.campaign_name}
    </h4>
    <CampaignApplicationProgressBar nav_paths={navPaths} />
    <h1>
        campaign information
    </h1>
    <form 
        class="form_container"
        on:submit|preventDefault={updateCampaignRegistrationHandler}
        enctype="multipart/form-data"
    >
        <h3 class="select_image_heading">
            select an image to represent the campaign*
        </h3>
        <p class="constraints">* file formats accepted: JPG, PNG, GIF</p>
        <p class="constraints">* maximum file size: 2MB</p>
        <ImageFileInput
            inputLabel={true}
            bind:imageFileInputValue={imageFileInputValue}
            bind:image={image}
            placeholder="/image.jpg"
            inputName="referendum_name_or_action"
            inputID="referendum_name_or_action"
            bind:isValid={imageFileIsValid}
            required={true}
            imageFileInputErrorMessage="image file required"
        >
            image file*
        </ImageFileInput>
        {#if (image)}
            <div class="campaign_image_container">
                <img src={image} alt="test"/>
            </div>
        {/if}
        <TextInput 
            inputLabel={true}
            bind:textInputValue={imageAltTextInputValue}
            bind:isValid={imageAltTextIsValid}
            placeholder="referendum banner"
            inputName="image_alt_text"
            inputID="image_alt_text"
            required={true}
            textInputErrorMessage="image alt text required"
        >
            image alt text*
        </TextInput>
        <TextInput
            inputLabel={true}
            bind:textInputValue={campaignNameInputValue}
            bind:isValid={campaignNameIsValid}
            placeholder="candidate for X office"
            inputName="campaign_name"
            inputID="campaign_name"
            required={true}
            textInputErrorMessage="campaign name required"
        >
            campaign name*
        </TextInput>
        <TextInput
            inputLabel={true}
            bind:textInputValue={electorateInputValue}
            bind:isValid={electorateIsValid}
            placeholder="Michigan Congressional District 13"
            inputName="electorate"
            inputID="electorate"
            required={true}
            textInputErrorMessage="electorat required"
        >
            electorate*
        </TextInput>
        <NumberInput
            inputLabel={true}
            bind:numberInputValue={yearOfficeSoughtInputValue}
            bind:isValid={yearOfficeSoughtIsValid}
            placeholder="2024"
            inputName="year_office_sought_to_begin"
            inputID="year_office_sought_to_begin"
            required={true}
            numberInputErrorMessage="starting year required for office sought"
        >
            starting year for office sought*
        </NumberInput>
        <div class="two_columns">
            <DateInput
                inputLabel={true}
                bind:dateInputValue={electionDatePrimaryInputValue}
                bind:isValid={electionDatePrimaryIsValid}
                inputName="election_date_primary"
                inputID="election_date_primary"
                required={false}
                dateInputErrorMessage="primary election date required"
            >
                primary election date
            </DateInput>
            <DateInput
                inputLabel={true}
                bind:dateInputValue={electionDateGeneralInputValue}
                bind:isValid={electionDateGeneralIsValid}
                inputName="election_date_general"
                inputID="election_date_genearl"
                required={true}
                dateInputErrorMessage="general election date required"
            >
                general election date*
            </DateInput>
        </div>
        <SelectInput 
            options={governmentLevelOptions}
            bind:selectInputValue={governmentLevelInputValue}
            isValid={governmentLevelIsValid}
            required={false}
            inputID="government_level"
            inputName="government_level"
            selectInputErrorMessage=""
            inputLabel={true}
        >
            government level*
        </SelectInput>
        {#if (governmentLevelInputValue !== "")}
            <div class="expandable_cells">
                <div class="cell">
                    <TextInputReadonly
                        inputLabel={true}
                        textInputValue={"United States"}
                        bind:isValid={countryIsValid}
                        placeholder="United States"
                        inputName="country"
                        inputID="country"
                        required={true}
                        textInputErrorMessage="country required"
                    >
                        country
                    </TextInputReadonly>
                </div>
                
                {#if (
                    (governmentLevelInputValue === "state") ||
                    (governmentLevelInputValue === "county") ||
                    (governmentLevelInputValue === "city")
                )}
                    <div class="cell">
                        <SelectInput 
                            isValid={stateIsValid}
                            inputID="state"
                            inputName="state"
                            options={States}
                            bind:selectInputValue={stateInputValue}
                            inputLabel={true}
                            required={true}
                            selectInputErrorMessage="state required"
                        >
                            state
                        </SelectInput>
                    </div>
                    {#if (
                        (governmentLevelInputValue === "county") ||
                        (governmentLevelInputValue === "city")
                    )}
                        <div class="cell">
                            <TextInput
                                inputLabel={true}
                                bind:textInputValue={countyInputValue}
                                bind:isValid={countyIsValid}
                                placeholder="Oakland"
                                inputName="county"
                                inputID="county"
                                required={true}
                                textInputErrorMessage="county required"
                            >
                                county
                            </TextInput>
                        </div>
                        
                        {#if (governmentLevelInputValue === "city")}
                            <div class="cell">
                                <TextInput
                                    inputLabel={true}
                                    bind:textInputValue={cityInputValue}
                                    bind:isValid={cityIsValid}
                                    placeholder="Detroit"
                                    inputName="city"
                                    inputID="city"
                                    required={true}
                                    textInputErrorMessage="city required"
                                >
                                    city
                                </TextInput>
                            </div>
                        {/if}
                    {/if}
                {/if}
            </div>
        {/if}
        <TextInput
            inputLabel={true}
            bind:textInputValue={partyInputValue}
            bind:isValid={partyIsValid}
            placeholder="Democracy Party"
            inputName="party"
            inputID="party"
            required={true}
            textInputErrorMessage="party required"
        >
            party
        </TextInput>
        <TextInput
            inputLabel={true}
            bind:textInputValue={websiteURLInputValue}
            bind:isValid={websiteURLIsValid}
            placeholder="https://candidateforxoffice.com"
            inputName="website_URL"
            inputID="websiteURL"
            required={false}
            textInputErrorMessage=""
        >
            website URL
        </TextInput>
        <h2>campaign authorization</h2>
        <div class="create_account_input">
            <AnimatedCheckbox
                bind:checked={authorizedRepresentativeInputValue}
            >
                I am an authorized representative of the campaign.*
            </AnimatedCheckbox>
            {#if (!authorizedRepresentativeIsValid)}
                <InputErrorMessage>{authorizedRepresentativeInputErrorMessage}</InputErrorMessage>
            {/if}
        </div>
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
        <a href="/authenticated-campaign/campaign" class="cancel_button_container">
            <CancelButton>
                cancel
            </CancelButton>
        </a>
        <a href={`/authenticated-campaign/campaign/campaign-questionnaire/campaign=${campaignApplication.campaign_application_ID}`}>
            <ActionButton>
                campaign questionnaire
            </ActionButton>
        </a>
    </div>
</div>

<style>
    .campaign_registration_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        max-width: 40rem;
        width: 100%;
        padding: 0 1rem;
        margin: 0 auto;
    }

    .form_container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .select_image_heading {
        margin: 0;
    }

    .constraints {
        width: 100%;
        font-weight: 600;
    }

    .campaign_image_container {
        padding: 1rem;
        max-width: 20rem;
        width: 100%;
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

    @media (max-width: 720px) {


    }
</style>