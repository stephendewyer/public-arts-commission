<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import ImageFileInput from "$lib/components/inputs/ImageFileInput.svelte";
    import TextInput from "$lib/components/inputs/TextInput.svelte";
    import ActionButton from "$lib/components/buttons/ActionButton.svelte";
    import PendingFlashMessage from "$lib/components/flashMessages/PendingFlashMessage.svelte";
    import SuccessFlashMessage from "$lib/components/flashMessages/SuccessFlashMessage.svelte";
    import ErrorFlashMessage from "$lib/components/flashMessages/ErrorFlashMessage.svelte";
    import NumberInput from "$lib/components/inputs/NumberInput.svelte";
    import SelectInput from "$lib/components/inputs/SelectInput.svelte";
    import States from '$lib/data/states.titlecase.json';
    import EmailInput from "$lib/components/inputs/EmailInput.svelte";
    import PhoneInput from "$lib/components/inputs/PhoneInput.svelte";
    import AnimatedCheckbox from "$lib/components/inputs/AnimatedCheckbox.svelte";
    import TextInputReadonly from "$lib/components/inputs/TextInputReadonly.svelte";
    import AddItemToArrayButton from "$lib/components/buttons/AddItemToArrayButton.svelte";
    import SubtractItemButton from "$lib/components/buttons/SubtractItemButton.svelte";
    import TextArea from "$lib/components/inputs/TextArea.svelte";
    import GovernmentLevel from "$lib/data/governmentLevel.json";
    import SessionsCongress from "$lib/data/sessionsCongress.json"
    import DateInput from "$lib/components/inputs/DateInput.svelte";
    import { goto } from '$app/navigation';
    import type { E164Number } from 'svelte-tel-input/types';
    import CancelButton from '$lib/components/buttons/CancelButton.svelte';

    export let data;

    $: userEmail = data.streamed.user?.email;

    let addHouseCoSponsor: boolean = false;
    let addSenateCoSponsor: boolean = false;

    let coSponsorsHouseValues: CoSponsorInputValue[] = [
        {
            co_sponsor: "",
            isValid: true
        }
    ];

    let coSponsorsSenateValues: CoSponsorInputValue[] = [
        {
            co_sponsor: "",
            isValid: true
        }
    ];

    $: if (addHouseCoSponsor) {

        coSponsorsHouseValues = [...coSponsorsHouseValues, {co_sponsor: "", isValid: true}];

        addHouseCoSponsor = false;

    };

    $: if (addSenateCoSponsor) {

        coSponsorsSenateValues = [...coSponsorsSenateValues, {co_sponsor: "", isValid: true}];

        addSenateCoSponsor = false;

    };

    // begin remove Senate sponsor

    let coSponsorSenateFieldIndexRemoved: null | number = null;

    let subtractCoSponsorSenateClicked: boolean = false;

    let coSponsorSenateFieldForRemovalNotNull: number;

    $: if (coSponsorSenateFieldIndexRemoved !== null) {

        coSponsorSenateFieldForRemovalNotNull = coSponsorSenateFieldIndexRemoved;

    };

    $: if (subtractCoSponsorSenateClicked) {

        subtractCoSponsorSenateClicked = false;

        if (coSponsorsSenateValues.length > 1) {

            coSponsorsSenateValues.splice(coSponsorSenateFieldForRemovalNotNull, coSponsorSenateFieldForRemovalNotNull);

        };

    };

    // end remove Senate sponsor

    // begin remove House sponsor

    let coSponsorHouseFieldIndexRemoved: null | number = null;

    let subtractCoSponsorHouseClicked: boolean = false;

    let coSponsorHouseFieldForRemovalNotNull: number;

    $: if (coSponsorHouseFieldIndexRemoved !== null) {

        coSponsorHouseFieldForRemovalNotNull = coSponsorHouseFieldIndexRemoved;

    };

    $: if (subtractCoSponsorHouseClicked) {

        subtractCoSponsorHouseClicked = false;

        if (coSponsorsHouseValues.length > 1) {

            coSponsorsHouseValues.splice(coSponsorHouseFieldForRemovalNotNull, coSponsorHouseFieldForRemovalNotNull);

        };

    };

    // end remove House sponsor

    let imageFileInputValue: string = "";
    let imageAltTextInputValue: string = "";
    let image: any;
    let amendmentNameInputValue: string = "";
    let yearReleasedInputValue: number | string = "";
    let yearIntroducedInHouseInputValue: number | string = "";
    let yearIntroducedInSenateInputValue: number | string = "";
    let electionDateInputValue: string = "";
    let governmentLevelInputValue: string = "";
    let stateInputValue: string = "";
    let countyInputValue: string = "";
    let cityInputValue: string = "";
    let introducedInHouseChecked: boolean = false;
    let introducedInSenateChecked: boolean = false;
    let sponsorHouseInputValue: string = "";
    let sponsorSenateInputValue: string = "";
    let houseSessionInputValue: string = "";
    let senateSessionInputValue: string = "";
    let detailsInputValue: string = "";
    let websiteURLInputValue: string = "";
    let twoThirdsHouseAndSenatePassedChecked: boolean = false;
    let simpleMajorityHouseAndSenatePassedChecked: boolean = false;
    let simpleMajorityVotersPassedChecked: boolean = false;
    let ratifiedByStateLegislaturesChecked: boolean = false;
    let ratifiedByStateConventionsChecked: boolean = false;
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
    let amendmentNameIsValid: boolean = true;
    let yearReleasedIsValid: boolean = true;
    let yearIntroducedInHouseIsValid: boolean = true;
    let yearIntroducedInSenateIsValid: boolean = true;
    let electionDateIsValid: boolean = true;
    let sponsorHouseIsValid: boolean = true;
    let sponsorSenateIsValid: boolean = true;
    let houseSessionIsValid: boolean = true;
    let senateSessionIsValid: boolean = true;
    let governmentLevelIsValid: boolean = true;
    let countryIsValid: boolean = true;
    let stateIsValid: boolean = true;
    let countyIsValid: boolean = true;
    let cityIsValid: boolean = true;
    let detailsIsValid: boolean = true;
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

    const createAmendmentEndorsement = async (
        userEmail: string | null | undefined,
        imageFile: string,
        imageAltText: string,
        image: any,
        amendmentName: string,
        yearReleased: number | string,
        yearIntroducedInHouse: number | string,
        yearIntroducedInSenate: number | string,
        electionDate: string,
        governmentLevel: string,
        state: string,
        county: string,
        city: string,
        introducedInHouse: boolean,
        introducedInSenate: boolean,
        sponsorHouse: string,
        sponsorSenate: string,
        coSponsorsHouse: CoSponsorInputValue[],
        coSponsorsSenate: CoSponsorInputValue[],
        houseSession: string,
        senateSession: string,
        details: string,
        websiteURL: string,
        twoThirdsHouseAndSenatePassed: boolean,
        simpleMajorityHouseAndSenatePassed: boolean,
        simpleMajorityVotersPassed: boolean,
        ratifiedByStateLegislatures: boolean,
        ratifiedByStateConventions: boolean,
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
        const response = await fetch("/authenticated-administrator/api/createEndorsements/createAmendmentEndorsement", {
            method: 'POST',
            body: JSON.stringify({
                userEmail,
                imageFile,
                imageAltText,
                image,
                amendmentName,
                yearReleased,
                yearIntroducedInHouse,
                yearIntroducedInSenate,
                electionDate,
                governmentLevel,
                state,
                county,
                city,
                introducedInHouse,
                introducedInSenate,
                houseSession,
                senateSession,
                sponsorHouse,
                sponsorSenate,
                coSponsorsHouse,
                coSponsorsSenate,
                details,
                websiteURL,
                twoThirdsHouseAndSenatePassed,
                simpleMajorityHouseAndSenatePassed,
                simpleMajorityVotersPassed,
                ratifiedByStateLegislatures,
                ratifiedByStateConventions,
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

    const submitAmendmentEndoresementHandler = async () => {

        pending = true;

        // add the submitted form data to and image URL from Cloudinary to the database

        try {
            
            await createAmendmentEndorsement(
                userEmail,
                imageFileInputValue,
                imageAltTextInputValue,
                image,
                amendmentNameInputValue,
                yearReleasedInputValue,
                yearIntroducedInHouseInputValue,
                yearIntroducedInSenateInputValue,
                electionDateInputValue,
                governmentLevelInputValue,
                stateInputValue,
                countyInputValue,
                cityInputValue,
                introducedInHouseChecked,
                introducedInSenateChecked,
                sponsorHouseInputValue,
                sponsorSenateInputValue,
                coSponsorsHouseValues,
                coSponsorsSenateValues,
                houseSessionInputValue,
                senateSessionInputValue,
                detailsInputValue,
                websiteURLInputValue,
                twoThirdsHouseAndSenatePassedChecked,
                simpleMajorityHouseAndSenatePassedChecked,
                simpleMajorityVotersPassedChecked,
                ratifiedByStateLegislaturesChecked,
                ratifiedByStateConventionsChecked,
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
                amendmentNameInputValue = "",
                yearReleasedInputValue = "",
                yearIntroducedInHouseInputValue = "",
                yearIntroducedInSenateInputValue = "",
                electionDateInputValue = "",
                governmentLevelInputValue = "",
                stateInputValue = "",
                countyInputValue = "",
                cityInputValue = "",
                introducedInHouseChecked = false,
                introducedInSenateChecked = false,
                houseSessionInputValue = "",
                senateSessionInputValue = "",
                sponsorHouseInputValue = "",
                sponsorSenateInputValue = "",
                coSponsorsHouseValues = [],
                coSponsorsSenateValues = [],
                detailsInputValue = "",
                websiteURLInputValue = "",
                twoThirdsHouseAndSenatePassedChecked = false,
                simpleMajorityHouseAndSenatePassedChecked = false,
                simpleMajorityVotersPassedChecked = false,
                ratifiedByStateLegislaturesChecked = false,
                ratifiedByStateConventionsChecked = false,
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
                if (introducedInHouseChecked && !yearIntroducedInHouseInputValue) {
                    yearIntroducedInHouseIsValid = false;
                };
                if (introducedInSenateChecked && !yearIntroducedInSenateInputValue) {
                    yearIntroducedInSenateIsValid = false;
                };
                if (introducedInHouseChecked && !sponsorHouseInputValue) {
                    sponsorHouseIsValid = false;
                };
                if (introducedInHouseChecked && !houseSessionInputValue) {
                    houseSessionIsValid = false;
                };
                if (introducedInSenateChecked && !sponsorSenateInputValue) {
                    sponsorSenateIsValid = false;
                };
                if (introducedInSenateChecked && !senateSessionInputValue) {
                    senateSessionIsValid = false;
                };
                if (imageAltTextInputValue === "") {
                    imageAltTextIsValid = false;
                };
                if (imageFileInputValue === "") {
                    imageFileIsValid = false;
                };
                if (imageAltTextInputValue === "") {
                    imageAltTextIsValid = false;
                };
                if (imageFileInputValue === "") {
                    imageFileIsValid = false;
                };
                if (amendmentNameInputValue === "") {
                    amendmentNameIsValid = false;
                };
                if (yearReleasedInputValue === null) {
                    yearReleasedIsValid = false;
                }
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
	<title>create an amendment endorsement - public arts commission</title>
	<meta name="description" content="endorse an amendment by public arts commission" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<div class="add_endorsement_container">
    <h1>add amendment endorsement</h1>
    <form 
        class="form_container"
        on:submit|preventDefault={submitAmendmentEndoresementHandler}
        enctype="multipart/form-data"
    >
        <h2>amendment image</h2>
        <h3>select an image to represent the amendment*</h3>
        <ImageFileInput
            inputLabel={true}
            bind:imageFileInputValue={imageFileInputValue}
            bind:image={image}
            placeholder="/image.jpg"
            inputName="amendment_image_file"
            inputID="amendment_image_file"
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
            placeholder="amendment banner image"
            inputName="image_alt_text"
            inputID="image_alt_text"
            required={true}
            textInputErrorMessage="image alt text required"
        >
            image alt text
        </TextInput>
        <h2>amendment information</h2>
        <TextInput
            inputLabel={true}
            bind:textInputValue={amendmentNameInputValue}
            bind:isValid={amendmentNameIsValid}
            placeholder="Democracy for All Constitutional Amendment"
            inputName="amendment_name"
            inputID="amendment_name"
            required={true}
            textInputErrorMessage="amendment name required"
        >
            amendment name
        </TextInput>
        <div class="two_columns">
            <NumberInput
                inputLabel={true}
                bind:numberInputValue={yearReleasedInputValue}
                bind:isValid={yearReleasedIsValid}
                placeholder="2024"
                inputName="year_released"
                inputID="year_released"
                required={true}
                numberInputErrorMessage="year released required"
            >
                year released
            </NumberInput>
            <DateInput 
                inputLabel={true}
                bind:dateInputValue={electionDateInputValue}
                bind:isValid={electionDateIsValid}
                inputName="election_date"
                inputID="election_date"
                required={false}
                dateInputErrorMessage=""
            >
                election date
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
        <div class="two_columns">
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={introducedInHouseChecked}>
                    introduced in the House
                </AnimatedCheckbox>
                {#if (introducedInHouseChecked)}
                    <NumberInput
                        inputLabel={true}
                        bind:numberInputValue={yearIntroducedInHouseInputValue}
                        bind:isValid={yearIntroducedInHouseIsValid}
                        placeholder="2024"
                        inputName="year_introduced_in_House"
                        inputID="year_introduced_in_House"
                        required={true}
                        numberInputErrorMessage="year introduced in House required"
                    >
                        year introduced in the House
                    </NumberInput>
                    <SelectInput
                        options={SessionsCongress}
                        bind:selectInputValue={houseSessionInputValue}
                        isValid={houseSessionIsValid}
                        required={false}
                        inputID="House_session"
                        inputName="House_session"
                        selectInputErrorMessage=""
                        inputLabel={true}
                    >
                        House session
                    </SelectInput>
                    <TextInput
                        inputLabel={true}
                        bind:textInputValue={sponsorHouseInputValue}
                        bind:isValid={sponsorHouseIsValid}
                        placeholder="Alexandria Ocasio-Cortez"
                        inputName="House_sponsor"
                        inputID="House_sponsor"
                        required={true}
                        textInputErrorMessage="House sponsor required"
                    >
                        House sponsor
                    </TextInput>
                    <p style={"font-weight: 600"}>House co-sponsor(s)</p>
                    {#each coSponsorsHouseValues as coSponsor, i}
                        <div class="sponsor_row">
                            <TextInput
                                inputLabel={false}
                                bind:textInputValue={coSponsorsHouseValues[i].co_sponsor}
                                bind:isValid={coSponsorsHouseValues[i].isValid}
                                placeholder="Alexandria Ocasio-Cortez"
                                inputName={`co-sponsor_House_${i}`}
                                inputID={`co-sponsor_House_${i}`}
                                required={true}
                                textInputErrorMessage="sponsor required"
                            />
                            {#if (coSponsorsHouseValues.length > 1 && i !== 0)}
                                <SubtractItemButton 
                                    index={i}
                                    bind:subtractedItemIndex={coSponsorHouseFieldIndexRemoved}
                                    bind:subtractItemsClicked={subtractCoSponsorHouseClicked}
                                >
                                    subtract
                                </SubtractItemButton>
                            {/if}
                        </div>
                    {/each}
                    <AddItemToArrayButton
                        bind:addItemsClicked={addHouseCoSponsor}
                    >
                        co-sponsor
                    </AddItemToArrayButton>
                {/if}
            </div>
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={introducedInSenateChecked}>
                    introduced in the Senate
                </AnimatedCheckbox>
                {#if (introducedInSenateChecked)}
                    <NumberInput
                        inputLabel={true}
                        bind:numberInputValue={yearIntroducedInSenateInputValue}
                        bind:isValid={yearIntroducedInSenateIsValid}
                        placeholder="2024"
                        inputName="year_introduced_in_Senate"
                        inputID="year_introduced_in_Senate"
                        required={true}
                        numberInputErrorMessage="year introduced in Senate required"
                    >
                        year introduced in the Senate
                    </NumberInput>
                    <SelectInput
                        options={SessionsCongress}
                        bind:selectInputValue={senateSessionInputValue}
                        isValid={senateSessionIsValid}
                        required={false}
                        inputID="Senate_session"
                        inputName="Senate_session"
                        selectInputErrorMessage=""
                        inputLabel={true}
                    >
                        Senate session
                    </SelectInput>
                    <TextInput
                        inputLabel={true}
                        bind:textInputValue={sponsorSenateInputValue}
                        bind:isValid={sponsorSenateIsValid}
                        placeholder="Bernie Sanders"
                        inputName="Senate_sponsor"
                        inputID="Senate_sponsor"
                        required={true}
                        textInputErrorMessage="Senate sponsor required"
                    >
                        Senate sponsor
                    </TextInput>
                    <p style={"font-weight: 600"}>Senate co-sponsor(s)</p>
                    {#each coSponsorsSenateValues as coSponsor, i}
                        <div class="sponsor_row">
                            <TextInput
                                inputLabel={false}
                                bind:textInputValue={coSponsorsSenateValues[i].co_sponsor}
                                bind:isValid={coSponsorsSenateValues[i].isValid}
                                placeholder="Bernie Sanders"
                                inputName={`co-sponsor_Senate_${i}`}
                                inputID={`co-sponsor_Senate_${i}`}
                                required={true}
                                textInputErrorMessage="co-sponsor required"
                            />
                            {#if (coSponsorsSenateValues.length > 1 && i !== 0)}
                                <SubtractItemButton 
                                    index={i}
                                    bind:subtractedItemIndex={coSponsorSenateFieldIndexRemoved}
                                    bind:subtractItemsClicked={subtractCoSponsorSenateClicked}
                                >
                                    subtract
                                </SubtractItemButton>
                            {/if}
                        </div>
                    {/each}
                    <AddItemToArrayButton
                        bind:addItemsClicked={addSenateCoSponsor}
                    >
                        co-sponsor
                    </AddItemToArrayButton>
                {/if}
            </div>
        </div>
        <TextInput
            inputLabel={true}
            bind:textInputValue={websiteURLInputValue}
            bind:isValid={websiteURLIsValid}
            placeholder="https://democracyforallamendment.com"
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
            placeholder="The amendment would..."
            inputName="amendment_details"
            inputID="amendment_details"
            required={true}
            textAreaInputErrorMessage="details required"
        >
            details
        </TextArea>
        <h2>amendment status</h2>
        <div class="two_columns_checkbox">
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={twoThirdsHouseAndSenatePassedChecked}>
                    passed by 2/3 members in House and Senate
                </AnimatedCheckbox>
            </div>
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={ratifiedByStateLegislaturesChecked}>
                    ratified by 3/4 of state legislatures
                </AnimatedCheckbox>
            </div>
        </div>
        <div class="two_columns_checkbox">
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={ratifiedByStateConventionsChecked}>
                    ratified by 3/4 conventions called in each state
                </AnimatedCheckbox>
            </div>
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={simpleMajorityVotersPassedChecked}>
                    passed by simple majority of voters           
                </AnimatedCheckbox>
            </div>
        </div>
        <div class="two_columns_checkbox">
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={simpleMajorityHouseAndSenatePassedChecked}>
                    approved by simple majority in House and Senate
                </AnimatedCheckbox>
            </div>
        </div>
        <h2>amendment contact informations</h2>
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
            add amendment endorsement
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

    .add_endorsement_container {
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

    .sponsor_row {
        display: flex;
        gap: 0.5rem;
    }

    @media (max-width: 720px) {

        .two_columns {
            gap: 0.5rem;
        }

        .two_columns_checkbox {
            gap: 0.5rem;
        }

    }
</style>
