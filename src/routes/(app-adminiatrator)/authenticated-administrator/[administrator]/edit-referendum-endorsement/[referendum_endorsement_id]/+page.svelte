<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
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
    import TextArea from "$lib/components/inputs/TextArea.svelte";
    import GovernmentLevel from "$lib/data/governmentLevel.json";
    import { goto } from '$app/navigation';
    import type { E164Number } from "svelte-tel-input/types";
    import { ConvertDateInputFormat } from "$lib/utils/ConvertDateInputFormat.js";
    import CancelButton from '$lib/components/buttons/CancelButton.svelte';
    import { reverseHtmlEntities } from '$lib/utils/reverseHtmlEntities.js';

    export let data;

    const userEmail: string = data.streamed.user.email;  

    const endorsedReferendumWithImage: ReferendumWithImage = data.streamed.endorsedReferendumWithImage;
    // referendum information variables

    let imageFileInputValue: string = "";
    let imageID: number | null = endorsedReferendumWithImage.image_ID? endorsedReferendumWithImage.image_ID : null;
    let imageAltTextInputValue: string = endorsedReferendumWithImage.alt_text ? reverseHtmlEntities(endorsedReferendumWithImage.alt_text) : "";
    let image: string = endorsedReferendumWithImage.image_URL ? endorsedReferendumWithImage.image_URL : "";
    let imagePublicID: string = endorsedReferendumWithImage.public_ID ? endorsedReferendumWithImage.public_ID : "";
    let referendumID: number | null = endorsedReferendumWithImage.referendum_ID ? endorsedReferendumWithImage.referendum_ID : null;
    let referendumNameInputValue: string = endorsedReferendumWithImage.referendum_name ? reverseHtmlEntities(endorsedReferendumWithImage.referendum_name) : "";
    let startingYearIfEnactedInputValue: number | string = endorsedReferendumWithImage.starting_year_if_enacted ? endorsedReferendumWithImage.starting_year_if_enacted : "";
    let electionDateInputValue: string = endorsedReferendumWithImage.election_date ? ConvertDateInputFormat(endorsedReferendumWithImage.election_date) : "";
    let governmentLevelInputValue: string = endorsedReferendumWithImage.government_level ? endorsedReferendumWithImage.government_level : "";
    let stateInputValue: string = endorsedReferendumWithImage.state ? endorsedReferendumWithImage.state : "";
    let countyInputValue: string = endorsedReferendumWithImage.county ? endorsedReferendumWithImage.county : "";
    let cityInputValue: string = endorsedReferendumWithImage.city ? endorsedReferendumWithImage.city : "";
    let websiteURLInputValue: string = endorsedReferendumWithImage.website_URL ? endorsedReferendumWithImage.website_URL : "";
    let detailsInputValue: string = endorsedReferendumWithImage.details ? reverseHtmlEntities(endorsedReferendumWithImage.details) : "";
    let electedChecked: boolean | any = endorsedReferendumWithImage.elected;
    let rejectedChecked: boolean | any = endorsedReferendumWithImage.rejected;
    let pendingElectionChecked: boolean | any = endorsedReferendumWithImage.pending_election;

    // referendum contact information variables

    let nameFirstContactInputValue: string = endorsedReferendumWithImage.contact_name_first ? endorsedReferendumWithImage.contact_name_first : "";
    let nameLastContactInputValue: string = endorsedReferendumWithImage.contact_name_last ? endorsedReferendumWithImage.contact_name_last : "";
    let phoneContactInputValue: E164Number | string = endorsedReferendumWithImage.contact_phone_number ? endorsedReferendumWithImage.contact_phone_number : "";
    let streetAddressContactInputValue: string = endorsedReferendumWithImage.contact_street_address ? endorsedReferendumWithImage.contact_street_address : "";
    let streetAddress02ContactInputValue: string = endorsedReferendumWithImage.contact_street_address_02 ? endorsedReferendumWithImage.contact_street_address_02 : "";
    let cityContactInputValue: string = endorsedReferendumWithImage.contact_city ? endorsedReferendumWithImage.contact_city : "";
    let stateContactInputValue: string = endorsedReferendumWithImage.contact_state ? endorsedReferendumWithImage.contact_state : "";
    let zipCodeContactInputValue: number | string = endorsedReferendumWithImage.contact_zip_code ? endorsedReferendumWithImage.contact_zip_code : "";
    let emailContactInputValue: string = endorsedReferendumWithImage.contact_email ? endorsedReferendumWithImage.contact_email : "";

    let noContactInformationChecked: boolean;

    let imageFileIsValid: boolean = true;
    let imageAltTextIsValid: boolean = true;
    let referendumNameIsValid: boolean = true;
    let startingYearIfEnactedIsValid: boolean = true;
    let electionDateIsValid: boolean = true;
    let governmentLevelIsValid: boolean = true;
    let countryIsValid: boolean = true;
    let stateIsValid: boolean = true;
    let countyIsValid: boolean = true;
    let cityIsValid: boolean = true;
    let websiteURLIsValid: boolean = true;
    let detailsIsValid: boolean = true;

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
    
    const createReferendumEndorsement = async (
        userEmail: string | null | undefined,
        imageID: number | null,
        image: string,
        imageFileName: string,
        imageAltText: string,
        imagePublicID: string,
        referendumID: number | null,
        referendumName: string,
        startingYearIfEnacted: number | string,
        electionDate: string,
        governmentLevel: string,
        state: string,
        county: string,
        city: string,
        websiteURL: string,
        details: string,
        elected: boolean,
        rejected: boolean,
        pendingElection: boolean,
        nameFirstContact: string,
        nameLastContact: string,
        phoneContact: E164Number | string,
        streetAddressContact: string,
        streetAddress02Contact: string,
        cityContact: string,
        stateContact: string,
        zipCodeContact: number | string,
        emailContact: string
    ) => {
        const response = await fetch("/authenticated-administrator/api/updateEndorsements/updateReferendumEndorsement", {
            method: 'PATCH',
            body: JSON.stringify({
                userEmail,
                imageID,
                image,
                imageFileName,
                imageAltText,
                imagePublicID,
                referendumID,
                referendumName,
                startingYearIfEnacted,
                electionDate,
                governmentLevel,
                state,
                county,
                city,
                websiteURL,
                details,
                elected,
                rejected,
                pendingElection,
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

    const submitReferendumEndoresementHandler = async () => {

        pending = true;

        // add the submitted form data to and image URL from Cloudinary to the database

        try {
            
            await createReferendumEndorsement(
                userEmail,
                imageID,
                image,
                imageFileInputValue,
                imageAltTextInputValue,
                imagePublicID,
                referendumID,
                referendumNameInputValue,
                startingYearIfEnactedInputValue,
                electionDateInputValue,
                governmentLevelInputValue,
                stateInputValue,
                countyInputValue,
                cityInputValue,
                websiteURLInputValue,
                detailsInputValue,
                electedChecked,
                rejectedChecked,
                pendingElectionChecked,
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
                imageAltTextInputValue = "",
                image = "",
                referendumNameInputValue = "",
                startingYearIfEnactedInputValue = "",
                electionDateInputValue = "",
                governmentLevelInputValue = "",
                stateInputValue = "",
                countyInputValue = "",
                cityInputValue = "",
                websiteURLInputValue = "",
                detailsInputValue = "",
                electedChecked = false,
                rejectedChecked= false,
                pendingElectionChecked= false,
                nameFirstContactInputValue = "",
                nameLastContactInputValue = "",
                phoneContactInputValue = "",
                streetAddressContactInputValue = "",
                streetAddress02ContactInputValue = "",
                cityContactInputValue = "",
                stateContactInputValue = "",
                zipCodeContactInputValue = "",
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
                if (referendumNameInputValue === "") {
                    referendumNameIsValid = false;
                };
                if (startingYearIfEnactedInputValue === null) {
                    startingYearIfEnactedIsValid = false;
                };
                if (governmentLevelInputValue === "") {
                    governmentLevelIsValid = false;
                };
                if (detailsInputValue === "") {
                    detailsIsValid = false;
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

    let deleteImage: boolean = false;
    let imageInputElement: HTMLInputElement;
    let imageInputFiles: FileList | null = null;

</script>
<svelte:head>
	<title>edit a referendum endorsement - public arts commission</title>
	<meta name="description" content="edit a referendum endorsement by public arts commission" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<div class="add_referendum_endorsement_container">
    <h1>edit referendum endorsement</h1>
    <form 
        class="form_container"
        on:submit|preventDefault={submitReferendumEndoresementHandler}
        enctype="multipart/form-data"
    >
        <h2>referendum image</h2>
        <h3>select an image to represent the referendum*</h3>
        <ImageFileInput
            inputLabel={true}
            bind:imageFileInputValue={imageFileInputValue}
            bind:image={image}
            placeholder="/image.jpg"
            inputName="referendum_image_file"
            inputID="referendum_image_file"
            bind:files={imageInputFiles}
            bind:imageFileInputElement={imageInputElement}
            bind:isValid={imageFileIsValid}
            bind:deleteImage
            required={false}
            imageFileInputErrorMessage="image file required"
        >
            image file*
        </ImageFileInput>
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
        <h2>referendum information</h2>
        <TextInput
            inputLabel={true}
            bind:textInputValue={referendumNameInputValue}
            bind:isValid={referendumNameIsValid}
            placeholder="DIA millage renewal"
            inputName="referendum_name"
            inputID="referendum_name"
            required={true}
            textInputErrorMessage="referendum name required"
        >
            referendum name*
        </TextInput>
        <NumberInput
            inputLabel={true}
            bind:numberInputValue={startingYearIfEnactedInputValue}
            bind:isValid={startingYearIfEnactedIsValid}
            placeholder="2024"
            inputName="starting_year_if_enacted"
            inputID="starting_year_if_enacted"
            required={true}
            numberInputErrorMessage="starting year if enacted required"
        >
            starting year if enacted*
        </NumberInput>
        <div class="two_columns">
            <DateInput
                inputLabel={true}
                bind:dateInputValue={electionDateInputValue}
                bind:isValid={electionDateIsValid}
                inputName="election_date"
                inputID="election_date"
                required={true}
                dateInputErrorMessage="election date required"
            >
                election date*
            </DateInput>            
        </div>
        <SelectInput 
            options={governmentLevelOptions}
            bind:selectInputValue={governmentLevelInputValue}
            isValid={governmentLevelIsValid}
            required={true}
            inputID="government_level"
            inputName="government_level"
            selectInputErrorMessage="government level required"
            inputLabel={true}
        >
            government level*
        </SelectInput>
        <div class="two_columns">
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
                country*
            </TextInputReadonly>
            <SelectInput 
                isValid={stateIsValid}
                inputID="state"
                inputName="state"
                options={States}
                bind:selectInputValue={stateInputValue}
                inputLabel={true}
                required={
                    (governmentLevelInputValue === "state") ||
                    (governmentLevelInputValue === "county") ||
                    (governmentLevelInputValue === "city") 
                    ? true : false
                }
                selectInputErrorMessage="state required"
            >
                state{#if 
                    (governmentLevelInputValue === "state") ||
                    (governmentLevelInputValue === "county") ||
                    (governmentLevelInputValue === "city")
                }*{/if}
            </SelectInput>
        </div>
        <div class="two_columns">
            <TextInput
                inputLabel={true}
                bind:textInputValue={countyInputValue}
                bind:isValid={countyIsValid}
                placeholder="Oakland"
                inputName="county"
                inputID="county"
                required={
                    (governmentLevelInputValue === "county") ||
                    (governmentLevelInputValue === "city") 
                    ? true : false
                }
                textInputErrorMessage="county required"
            >
                county{#if 
                    (governmentLevelInputValue === "county") ||
                    (governmentLevelInputValue === "city")
                }*{/if}
            </TextInput>
            <TextInput
                inputLabel={true}
                bind:textInputValue={cityInputValue}
                bind:isValid={cityIsValid}
                placeholder="Detroit"
                inputName="city"
                inputID="city"
                required={(governmentLevelInputValue === "city") ? true : false}
                textInputErrorMessage="city required"
            >
                city{#if (governmentLevelInputValue === "city")}*{/if}
            </TextInput>
        </div>
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
        <TextArea
            inputLabel={true}
            bind:textareaInputValue={detailsInputValue}
            bind:isValid={detailsIsValid}
            placeholder="The referendum is on a measure to..."
            inputName="referendum_details"
            inputID="referendum_details"
            required={true}
            textAreaInputErrorMessage="details required"
        >
            details*
        </TextArea>
        <h2>referendum status</h2>
        <div class="two_columns_checkbox">
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={electedChecked}>
                    elected
                </AnimatedCheckbox>
            </div>
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={rejectedChecked}>
                    rejected
                </AnimatedCheckbox>
            </div>
        </div>
        <div class="two_columns_checkbox">
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={pendingElectionChecked}>
                    pending election
                </AnimatedCheckbox>
            </div>
        </div>
        <h2>referendum contact informations</h2>
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
                    required={false}
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
                    required={false}
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
                    required={false}
                >
                    email
                </EmailInput>
                <PhoneInput 
                    isValid={phoneContactIsValid}
                    inputID="phone"
                    inputName="phone"
                    bind:phoneInputValue={phoneContactInputValue}
                    inputLabel={true}
                    required={false}
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
                    required={false}
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
                    required={false}
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
                    required={false}
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
                    required={false}
                    numberInputErrorMessage="zip code required"
                >
                    zip code
                </NumberInput>
            {/if}
        <ActionButton disable={false}>
            update referendum endorsement
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
    <a href="/authenticated-administrator/admin" class="cancel_button_container">
        <CancelButton>
            cancel
        </CancelButton>
    </a>
</div>

<style>

    .add_referendum_endorsement_container {
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

    .image_container {
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

    @media (max-width: 720px) {

        .two_columns_checkbox {
            gap: 0.5rem;
        }

        .two_columns {
            gap: 0.5rem;
        }

    }
</style>