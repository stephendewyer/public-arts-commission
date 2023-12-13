<script lang="ts">
    import ImageFileInput from "$lib/components/inputs/ImageFileInput.svelte";
    import TextInput from "$lib/components/inputs/TextInput.svelte";
    import ActionButton from "$lib/components/buttons/ActionButton.svelte";
    import PendingFlashMessage from "$lib/components/flashMessages/PendingFlashMessage.svelte";
    import SuccessFlashMessage from "$lib/components/flashMessages/SuccessFlashMessage.svelte";
    import ErrorFlashMessage from "$lib/components/flashMessages/ErrorFlashMessage.svelte";
    import NumberInput from "$lib/components/inputs/NumberInput.svelte";
    import DateInput from "$lib/components/inputs/DateInput.svelte";
    import SelectInput from "$lib/components/inputs/SelectInput.svelte";
    import States from '$lib/data/states.titlecase.json';
    import EmailInput from "$lib/components/inputs/EmailInput.svelte";
    import PhoneInput from "$lib/components/inputs/PhoneInput.svelte";
    import AnimatedCheckbox from "$lib/components/inputs/AnimatedCheckbox.svelte";
    import TextInputReadonly from "$lib/components/inputs/TextInputReadonly.svelte";
    import GovernmentLevel from "$lib/data/governmentLevel.json";
    import { goto } from '$app/navigation';

    export let data;

    $: userEmail = data.user?.email;  

    let imageFileInputValue: string = "";
    let imageAltTextInputValue: string = "";
    let image: any;
    let campaignNameInputValue: string = "";
    let electorateInputValue: string = "";
    let yearOfficeSoughtInputValue: number | null = null;
    let electionDatePrimaryInputValue: string = "";
    let electionDateGeneralInputValue: string = "";
    let governmentLevelInputValue: string = "";
    let stateInputValue: string = "";
    let countyInputValue: string = "";
    let cityInputValue: string = "";
    let partyInputValue: string = "";
    let websiteURLInputValue: string = "";
    let rejectedPrimaryProceedingGeneralChecked: boolean = false;
    let runningInPrimaryChecked: boolean = false;
    let electedPrimaryElectedGeneralChecked: boolean = false;
    let electedPrimaryProceedingGeneralChecked: boolean = false;
    let electedInPrimaryRejectedInGeneralChecked: boolean = false;
    let rejectedInPrimaryCampaignEndedChecked: boolean = false;
    let rejectedInPrimaryRejectedInGeneralChecked: boolean = false;
    let nameFirstContactInputValue: string = "";
    let nameLastContactInputValue: string = "";
    let phoneContactInputValue: string = "";
    let streetAddressContactInputValue: string = "";
    let streetAddress02ContactInputValue: string = "";
    let cityContactInputValue: string = "";
    let stateContactInputValue: string = "";
    let zipCodeContactInputValue: number | null = null;
    let emailContactInputValue: string = "";

    let noContactInformationChecked: boolean;

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
    let nameFirstContactIsValid: boolean = true;
    let nameLastContactIsValid: boolean = true;
    let phoneContactIsValid: boolean = true;
    let streetAddressContactIsValid: boolean = true;
    let streetAddress02ContactIsValid: boolean = true;
    let cityContactIsValid: boolean = true;
    let stateContactIsValid: boolean = true;
    let zipCodeContactIsValid: boolean = true;
    let emailContactIsValid: boolean = true;

    const governmentLevelOptions: GovernmentLevel[] = GovernmentLevel;

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

    const createCandidateEndorsement = async (
        userEmail: string | null | undefined,
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
        rejectedPrimaryProceedingGeneral: boolean,
        runningInPrimary: boolean,
        electedPrimaryElectedGeneral: boolean,
        electedPrimaryProceedingGeneral: boolean,
        electedInPrimaryRejectedInGeneral: boolean,
        rejectedInPrimaryCampaignEnded: boolean,
        rejectedInPrimaryRejectedInGeneral: boolean,
        nameFirstContact: string,
        nameLastContact: string,
        phoneContact: string,
        streetAddressContact: string,
        streetAddress02Contact: string,
        cityContact: string,
        stateContact: string,
        zipCodeContact: number | null,
        emailContact: string
    ) => {
        const response = await fetch("/authenticated-administrator/api/createEndorsements/createCandidateEndorsement", {
            method: 'POST',
            body: JSON.stringify({
                userEmail,
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
                rejectedPrimaryProceedingGeneral,
                runningInPrimary,
                electedPrimaryElectedGeneral,
                electedPrimaryProceedingGeneral,
                electedInPrimaryRejectedInGeneral,
                rejectedInPrimaryCampaignEnded,
                rejectedInPrimaryRejectedInGeneral,
                nameFirstContact,
                nameLastContact,
                phoneContact,
                streetAddressContact,
                streetAddress02Contact,
                cityContact,
                stateContact,
                zipCodeContact,
                emailContact
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        responseItem = await response.json();

        return responseItem;

    }

    const submitCandidateEndoresementHandler = async () => {

        pending = true;

        // add the submitted form data to and image URL from Cloudinary to the database

        try {
            
            await createCandidateEndorsement(
                userEmail,
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
                rejectedPrimaryProceedingGeneralChecked,
                runningInPrimaryChecked,
                electedPrimaryElectedGeneralChecked,
                electedPrimaryProceedingGeneralChecked,
                electedInPrimaryRejectedInGeneralChecked,
                rejectedInPrimaryCampaignEndedChecked,
                rejectedInPrimaryRejectedInGeneralChecked,
                nameFirstContactInputValue,
                nameLastContactInputValue,
                phoneContactInputValue,
                streetAddressContactInputValue,
                streetAddress02ContactInputValue,
                cityContactInputValue,
                stateContactInputValue,
                zipCodeContactInputValue,
                emailContactInputValue
            );
            if (responseItem.success) {
                imageFileInputValue = "",
                imageAltTextInputValue = "",
                image = "",
                campaignNameInputValue = "",
                yearOfficeSoughtInputValue = null,
                electionDatePrimaryInputValue = "",
                electionDateGeneralInputValue = "",
                governmentLevelInputValue = "",
                stateInputValue = "",
                countyInputValue = "",
                cityInputValue = "",
                partyInputValue = "",
                websiteURLInputValue = "",
                rejectedPrimaryProceedingGeneralChecked = false,
                runningInPrimaryChecked = false,
                electedPrimaryElectedGeneralChecked = false,
                electedPrimaryProceedingGeneralChecked = false,
                electedInPrimaryRejectedInGeneralChecked = false,
                rejectedInPrimaryCampaignEndedChecked = false,
                rejectedInPrimaryRejectedInGeneralChecked = false,
                nameFirstContactInputValue = "",
                nameLastContactInputValue = "",
                phoneContactInputValue = "",
                streetAddressContactInputValue = "",
                streetAddress02ContactInputValue = "",
                cityContactInputValue = "",
                stateContactInputValue = "",
                zipCodeContactInputValue = null,
                emailContactInputValue = ""
                goto("/authenticated-administrator/admin");
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

            };
        } catch (error) {
            console.log(error);
        };
    };

    let pending: boolean = false;

    $: if((responseItem.success) || (responseItem.error)) {
        pending = false;
    };

</script>
<div class="add_candidate_endorsement_container">
    <h1>add candidate endorsement</h1>
    <form 
        class="form_container"
        on:submit|preventDefault={submitCandidateEndoresementHandler}
        enctype="multipart/form-data"
    >
        <h2>campaign image</h2>
        <h3>select an image to represent the campaign*</h3>
        <p class="constraints">* file formats accepted: JPG, PNG, GIF</p>
        <p class="constraints">* maximum file size: 2MB</p>
        <ImageFileInput
            inputLabel={true}
            bind:imageFileInputValue={imageFileInputValue}
            bind:image={image}
            placeholder="/image.jpg"
            inputName="campaign_name_or_action"
            inputID="campaign_name_or_action"
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
            placeholder="profile of candidate"
            inputName="image_alt_text"
            inputID="image_alt_text"
            required={true}
            textInputErrorMessage="image alt text required"
        >
            image alt text*
        </TextInput>
        <h2>campaign information</h2>
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
            starting year for office sought
        </NumberInput>
        <div class="two_columns">
            <DateInput
                inputLabel={true}
                bind:dateInputValue={electionDatePrimaryInputValue}
                bind:isValid={electionDatePrimaryIsValid}
                inputName="election_date_primary"
                inputID="election_date_primary"
                required={true}
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
                general election date
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
        <h2>campaign status</h2>
        <div class="two_columns_checkbox">
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={runningInPrimaryChecked}>
                    running in the primary
                </AnimatedCheckbox>
            </div>
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={rejectedPrimaryProceedingGeneralChecked}>
                    not elected in the primary, proceeding to the general
                </AnimatedCheckbox>
            </div>
        </div>
        <div class="two_columns_checkbox">
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={rejectedInPrimaryCampaignEndedChecked}>
                    rejected in the primary, campaign ended
                </AnimatedCheckbox>
            </div>
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={electedInPrimaryRejectedInGeneralChecked}>
                    elected in the primary, rejected in the general
                </AnimatedCheckbox>
            </div>
        </div>
        
        <div class="two_columns_checkbox">
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={electedPrimaryProceedingGeneralChecked}>
                    elected in the primary, proceeding to the general
                </AnimatedCheckbox>
            </div>
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={electedPrimaryElectedGeneralChecked}>
                    elected in the primary and elected in the general            
                </AnimatedCheckbox>
            </div>
        </div>
        <div class="two_columns_checkbox">
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={rejectedInPrimaryRejectedInGeneralChecked}>
                    rejected in the primary, rejected in the general
                </AnimatedCheckbox>
            </div>
        </div>
        <h2>campaign contact informations</h2>
        <AnimatedCheckbox bind:checked={noContactInformationChecked}>
            no contact information
        </AnimatedCheckbox>
        {#if (!noContactInformationChecked)}
            <div class="two_columns">
                <TextInput 
                    isValid={nameFirstContactIsValid}
                    placeholder="Marco"
                    inputID="name_first"
                    inputName="name_first"
                    bind:textInputValue={nameFirstContactInputValue}
                    inputLabel={true}
                    required={true}
                    textInputErrorMessage="first name required"
                >
                    first name
                </TextInput>
                <TextInput 
                    isValid={nameLastContactIsValid}
                    placeholder="Polo"
                    inputID="name_last"
                    inputName="name_last"
                    bind:textInputValue={nameLastContactInputValue}
                    inputLabel={true}
                    required={true}
                    textInputErrorMessage="last name required"
                >
                    last name
                </TextInput>
            </div>
            <div class="two_columns">
                <EmailInput 
                    isValid={emailContactIsValid}
                    placeholder="marcopolo@domain.com"
                    inputID="email"
                    inputName="email"
                    bind:emailInputValue={emailContactInputValue}
                    inputLabel={true}
                    required={true}
                >
                    email
                </EmailInput>
                <PhoneInput 
                    isValid={phoneContactIsValid}
                    inputID="phone"
                    inputName="phone"
                    bind:phoneInputValue={phoneContactInputValue}
                    inputLabel={true}
                    required={true}
                >
                    phone number
                </PhoneInput>
            </div>
            <div class="two_columns">
                <TextInput 
                    isValid={streetAddressContactIsValid}
                    placeholder="1111 State Street"
                    inputID="street_address"
                    inputName="street_address"
                    bind:textInputValue={streetAddressContactInputValue}
                    inputLabel={true}
                    required={true}
                    textInputErrorMessage="street address required"
                >
                    street address
                </TextInput>
                <TextInput 
                    isValid={streetAddress02ContactIsValid}
                    placeholder="Suite 2"
                    inputID="street_address_02"
                    inputName="street_address_02"
                    bind:textInputValue={streetAddress02ContactInputValue}
                    inputLabel={true}
                    required={false}
                >
                    street address 2
                </TextInput>
            </div>
            <div class="two_columns">
                <TextInput 
                    isValid={cityContactIsValid}
                    placeholder="Democracy City"
                    inputID="city"
                    inputName="city"
                    bind:textInputValue={cityContactInputValue}
                    inputLabel={true}
                    required={true}
                    textInputErrorMessage="city required"
                >
                    city
                </TextInput>
                <SelectInput 
                    isValid={stateContactIsValid}
                    inputID="state"
                    inputName="state"
                    options={States}
                    bind:selectInputValue={stateContactInputValue}
                    inputLabel={true}
                    required={true}
                    selectInputErrorMessage="state required"
                >
                    state
                </SelectInput>
            </div>
            <NumberInput 
                    isValid={zipCodeContactIsValid}
                    placeholder=11111
                    inputID="zip_code"
                    inputName="zip_code"
                    bind:numberInputValue={zipCodeContactInputValue}
                    inputLabel={true}
                    required={true}
                    numberInputErrorMessage="zip code required"
                >
                    zip code
                </NumberInput>
            {/if}
        <ActionButton>
            add candidate endorsement
        </ActionButton>
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
    </form>
</div>

<style>

    .add_candidate_endorsement_container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .form_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        max-width: 40rem;
        width: 100%;
        padding: 0 1rem;
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
    }

    .two_columns_checkbox {
        display: flex;
        width: 100%;
        gap: 1rem;
    }

    .checkbox_column {
        width: 50%;
        display:  flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .expandable_cells {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .cell {
        width: 15rem;
    }

    @media (max-width: 1440px) {

    }

    @media (max-width: 720px) {

        .two_columns_checkbox {
            display: flex;
            width: 100%;
            gap: 0.5rem;
        }

    }
</style>

