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
    import TextArea from "$lib/components/inputs/TextArea.svelte";
    import GovernmentLevel from "$lib/data/governmentLevel.json";

    export let data;

    $: userEmail = data.user?.email;  

    // referendum information variables

    let imageFileInputValue: string = "";
    let imageAltTextInputValue: string = "";
    let image: any;
    let referendumNameInputValue: string = "";
    let startingYearIfEnactedInputValue: number | null = null;
    let electionDateInputValue: string = "";
    let governmentLevelInputValue: string = "";
    let stateInputValue: string = "";
    let countyInputValue: string = "";
    let cityInputValue: string = "";
    let websiteURLInputValue: string = "";
    let detailsInputValue: string = "";
    let electedChecked: boolean = false;
    let rejectedChecked: boolean = false;
    let pendingElectionChecked: boolean = false;

    // referendum contact information variables

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

    interface responseObj {
        success: string;
        error: string;
        status: number | null
    };

	let responseItem: responseObj = {
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
        uploadedImageURL: string,
        imageFileName: string,
        imageAltText: string,
        referendumName: string,
        startingYearIfEnacted: number | null,
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
        phoneContact: string,
        streetAddressContact: string,
        streetAddress02Contact: string,
        cityContact: string,
        stateContact: string,
        zipCodeContact: number | null,
        emailContact: string
    ) => {
        const response = await fetch("/authenticated-administrator/api/createEndorsements/createReferendumEndorsement", {
            method: 'POST',
            body: JSON.stringify({
                userEmail,
                uploadedImageURL,
                imageFileName,
                imageAltText,
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

        // upload the file to Cloudinary and get image URL

        let uploadedImageURL: string = "";

        try {

            let uploadedImageResponse: any;
            
            uploadedImageResponse = await fetch("/authenticated-administrator/api/uploadImageToCloudinary", {
            
                method: "POST",
                body: JSON.stringify({image}),
                headers: {
                    'Content-Type': 'application/json',
                }

            });

            uploadedImageResponse = await uploadedImageResponse.json();

            uploadedImageURL = uploadedImageResponse.secure_url;
            

        } catch (error) {

            console.log(error);

        };

        // add the submitted form data to and image URL from Cloudinary to the database

        try {
            
            await createReferendumEndorsement(
                userEmail,
                uploadedImageURL,
                imageFileInputValue,
                imageAltTextInputValue,
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
                startingYearIfEnactedInputValue = null,
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
                zipCodeContactInputValue = null,
                emailContactInputValue = ""
                // goto("/login-campaign");
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

</script>
<div class="add_referendum_endorsement_container">
    <h1>add referendum endorsement</h1>
    <form 
        class="form_container"
        on:submit|preventDefault={submitReferendumEndoresementHandler}
        enctype="multipart/form-data"
    >
        <h2>referendum image</h2>
        <h3>select an image to represent the referendum*</h3>
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
            <div class="image_container">
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
        <ActionButton disable={false}>
            add referendum endorsement
        </ActionButton>
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
