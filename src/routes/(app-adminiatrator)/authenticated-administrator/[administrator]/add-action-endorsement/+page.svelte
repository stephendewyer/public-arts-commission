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
    import TimeInput from "$lib/components/inputs/TimeInput.svelte";
    import GovernmentLevel from "$lib/data/governmentLevel.json";
    import TimeZones from "$lib/data/timeZones.json";
    import { goto } from '$app/navigation';
    import type { E164Number } from 'svelte-tel-input/types';
    import CancelButton from '$lib/components/buttons/CancelButton.svelte';

    export let data;

    const userEmail = data.streamed.user.email;  

    let imageFileInputValue: string = "";
    let imageAltTextInputValue: string = "";
    let image: any;
    let actionNameInputValue: string = "";
    let allDayActionChecked: boolean = false;
    let allDayActionDateInputValue: string = "";
    let actionStartDateInputValue: string = "";
    let actionEndDateInputValue: string = "";
    let startTimeInputValue: string = "";
    let endTimeInputValue: string = "";
    let timeZoneInputValue: string = "";
    let actionStreetAddressInputValue: string = "";
    let actionStreetAddress02InputValue: string = "";
    let actionCityInputValue: string = "";
    let actionStateInputValue: string = "";
    let actionZipCodeInputValue: number |string = "";
    let governmentLevelInputValue: string = "";
    let websiteURLInputValue: string = "";
    let detailsInputValue: string = "";

    let nameFirstContactInputValue: string = "";
    let nameLastContactInputValue: string = "";
    let phoneContactInputValue: E164Number | string = "";
    let streetAddressContactInputValue: string = "";
    let streetAddress02ContactInputValue: string = "";
    let cityContactInputValue: string = "";
    let stateContactInputValue: string = "";
    let zipCodeContactInputValue: number | string = "";
    let emailContactInputValue: string = "";

    let noContactInformationChecked: boolean;

    let imageFileIsValid: boolean = true;
    let imageAltTextIsValid: boolean = true;
    let actionNameIsValid: boolean = true;
    let allDayActionIsValid: boolean = false;
    let allDayActionDateIsValid: boolean = true;
    let actionStartDateIsValid: boolean = true;
    let actionEndDateIsValid: boolean = true;
    let startTimeIsValid: boolean = true;
    let endTimeIsValid: boolean = true;
    let timeZoneIsValid: boolean = true;
    let actionStreetAddressIsValid: boolean = true;
    let actionStreetAddress02IsValid: boolean = true;
    let actionCityIsValid: boolean = true;
    let actionStateIsValid: boolean = true;
    let actionZipCodeIsValid: boolean = true;
    let detailsIsValid: boolean = true;
    let governmentLevelIsValid: boolean = true;
    let countryIsValid: boolean = true;
    let websiteURLIsValid: boolean = true;
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

    const timeZoneOptions: TimeZone[] = TimeZones;

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

    const createActionEndorsement = async (
        userEmail: string | null | undefined,
        imageFile: string,
        imageAltText: string,
        image: any,
        actionName: string,
        allDayAction: boolean,
        allDayActionDate: string,
        actionStartDate: string,
        actionEndDate: string,
        startTime: string,
        endTime: string,
        timeZone: string,
        actionStreetAddress: string,
        actionStreetAddress02: string,
        actionCity: string,
        actionState: string,
        actionZipCode: number | string,
        governmentLevel: string,
        websiteURL: string,
        details: string,
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
        const response = await fetch("/authenticated-administrator/api/createEndorsements/createActionEndorsement", {
            method: 'POST',
            body: JSON.stringify({
                userEmail,
                imageFile,
                imageAltText,
                image,
                actionName,
                allDayAction,
                allDayActionDate,
                actionStartDate,
                actionEndDate,
                startTime,
                endTime,
                timeZone,
                actionStreetAddress,
                actionStreetAddress02,
                actionCity,
                actionState,
                actionZipCode,
                governmentLevel,
                websiteURL,
                details,
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

    const submitActionEndoresementHandler = async () => {

        pending = true;

        // add the submitted form data to and image URL from Cloudinary to the database

        try {
            
            await createActionEndorsement(
                userEmail,
                imageFileInputValue,
                imageAltTextInputValue,
                image,
                actionNameInputValue,
                allDayActionChecked,
                allDayActionDateInputValue,
                actionStartDateInputValue,
                actionEndDateInputValue,
                startTimeInputValue,
                endTimeInputValue,
                timeZoneInputValue,
                actionStreetAddressInputValue,
                actionStreetAddress02InputValue,
                actionCityInputValue,
                actionStateInputValue,
                actionZipCodeInputValue,
                governmentLevelInputValue,
                websiteURLInputValue,
                detailsInputValue,
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
                actionNameInputValue = "",
                allDayActionChecked = false,
                allDayActionDateInputValue = "",
                actionStartDateInputValue = "",
                actionEndDateInputValue = "",
                startTimeInputValue = "",
                endTimeInputValue = "",
                timeZoneInputValue = "",
                actionStreetAddressInputValue = "",
                actionStreetAddress02InputValue = "",
                actionCityInputValue = "",
                actionStateInputValue = "",
                actionZipCodeInputValue = "",
                governmentLevelInputValue = "",
                websiteURLInputValue = "",
                detailsInputValue = "",
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
                if (actionNameInputValue === "") {
                    actionNameIsValid = false;
                };
                if (allDayActionChecked && (allDayActionDateInputValue === "")) {
                    allDayActionIsValid = false;
                }
                if (!allDayActionChecked && (actionStartDateInputValue === "")) {
                    actionStartDateIsValid = false;
                };
                if (!allDayActionChecked && (actionEndDateInputValue === "")) {
                    actionEndDateIsValid = false;
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
	<title>create an action endorsement - public arts commission</title>
	<meta name="description" content="endorse an action by public arts commission" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<div class="add_candidate_endorsement_container">
    <h1>add action endorsement</h1>
    <form 
        class="form_container"
        on:submit|preventDefault={submitActionEndoresementHandler}
        enctype="multipart/form-data"
    >
        <h2>action image</h2>
        <h3>select an image to represent the action*</h3>
        <ImageFileInput
            inputLabel={true}
            bind:imageFileInputValue={imageFileInputValue}
            bind:image={image}
            placeholder="/image.jpg"
            inputName="action_image_file"
            inputID="action_image_file"
            bind:files={imageInputFiles}
            bind:imageFileInputElement={imageInputElement}
            bind:isValid={imageFileIsValid}
            bind:deleteImage
            required={false}
            imageFileInputErrorMessage="image file required"
        >
            image file
        </ImageFileInput>
        <TextInput 
            inputLabel={true}
            bind:textInputValue={imageAltTextInputValue}
            bind:isValid={imageAltTextIsValid}
            placeholder="image of action"
            inputName="image_alt_text"
            inputID="image_alt_text"
            required={true}
            textInputErrorMessage="image alt text required"
        >
            image alt text
        </TextInput>
        <h2>action information</h2>
        <TextInput
            inputLabel={true}
            bind:textInputValue={actionNameInputValue}
            bind:isValid={actionNameIsValid}
            placeholder="rally for democracy"
            inputName="action_name"
            inputID="action_name"
            required={true}
            textInputErrorMessage="action name required"
        >
            action name
        </TextInput>
        <div class="two_columns">
            <AnimatedCheckbox bind:checked={allDayActionChecked}>
                all day action
            </AnimatedCheckbox>
            {#if (allDayActionChecked)}
                <DateInput
                    inputLabel={true}
                    bind:dateInputValue={allDayActionDateInputValue}
                    bind:isValid={allDayActionDateIsValid}
                    inputName="all_day_action_date"
                    inputID="all_day_action_date"
                    required={true}
                    dateInputErrorMessage="all day action date required"
                >
                    action date
                </DateInput>
            {/if}
        </div>
        {#if (!allDayActionChecked)}
            <div class="two_columns">
                <DateInput
                    inputLabel={true}
                    bind:dateInputValue={actionStartDateInputValue}
                    bind:isValid={actionStartDateIsValid}
                    inputName="action_start_date"
                    inputID="action_start_date"
                    required={true}
                    dateInputErrorMessage="action start date required"
                >
                    action start date
                </DateInput>
                <DateInput
                    inputLabel={true}
                    bind:dateInputValue={actionEndDateInputValue}
                    bind:isValid={actionEndDateIsValid}
                    inputName="action_end_date"
                    inputID="action_end_date"
                    required={true}
                    dateInputErrorMessage="action end date required"
                >
                    action end date
                </DateInput>
            </div>
            <div class="two_columns">
                <TimeInput
                    inputLabel={true}
                    bind:timeInputValue={startTimeInputValue}
                    bind:isValid={startTimeIsValid}
                    inputName="start_time"
                    inputID="start_time"
                    required={true}
                    timeInputErrorMessage="start time required"
                >
                    action start time
                </TimeInput>
                <TimeInput
                    inputLabel={true}
                    bind:timeInputValue={endTimeInputValue}
                    bind:isValid={endTimeIsValid}
                    inputName="end_time"
                    inputID="end_time"
                    required={true}
                    timeInputErrorMessage="end time required"
                >
                    action end time
                </TimeInput> 
            </div>
        {/if}
        <div class="two_columns">
            {#if (!allDayActionChecked)}
                <SelectInput 
                    options={timeZoneOptions}
                    bind:selectInputValue={timeZoneInputValue}
                    isValid={timeZoneIsValid}
                    required={true}
                    inputID="time_zone"
                    inputName="time_zone"
                    selectInputErrorMessage="time zone required"
                    inputLabel={true}
                >
                    action time zone
                </SelectInput>
            {/if}
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
                action government level
            </SelectInput>
        </div>
        <div class="two_columns">
            {#if (governmentLevelInputValue !== "")}
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
                    action country
                </TextInputReadonly>
            {/if}
            <TextInput
                inputLabel={true}
                bind:textInputValue={actionStreetAddressInputValue}
                bind:isValid={actionStreetAddressIsValid}
                placeholder="1000 Democracy Way"
                inputName="action_street_address"
                inputID="action_street_address"
                required={false}
                textInputErrorMessage="action street address required"
            >
                action street address
            </TextInput>
        </div>
        <div class="two_columns">
            <TextInput
                inputLabel={true}
                bind:textInputValue={actionStreetAddress02InputValue}
                bind:isValid={actionStreetAddress02IsValid}
                placeholder="Suite 300"
                inputName="action_street_address"
                inputID="action_street_address"
                required={false}
                textInputErrorMessage=""
            >
                action street address 2
            </TextInput>
            <TextInput
                inputLabel={true}
                bind:textInputValue={actionCityInputValue}
                bind:isValid={actionCityIsValid}
                placeholder="Democracy City"
                inputName="action_city"
                inputID="action_city"
                required={false}
                textInputErrorMessage="city"
            >
                action city
            </TextInput>
        </div>
        <div class="two_columns">
            <SelectInput 
                options={States}
                bind:selectInputValue={actionStateInputValue}
                bind:isValid={actionStateIsValid}
                inputName="action_street_address"
                inputID="action_street_address"
                required={false}
                selectInputErrorMessage=""
                inputLabel={true}
            >
                action state
            </SelectInput>
            <NumberInput
                inputLabel={true}
                bind:numberInputValue={actionZipCodeInputValue}
                bind:isValid={actionZipCodeIsValid}
                placeholder="11111"
                inputName="action_zip_code"
                inputID="action_zip_code"
                required={false}
                numberInputErrorMessage=""
            >
                action zip code
            </NumberInput>
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
            action website URL
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
            action details
        </TextArea>
        <h2>action contact informations</h2>
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
        <ActionButton>
            add action endorsement
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

    @media (max-width: 1440px) {

    }

    @media (max-width: 720px) {

    }
</style>
