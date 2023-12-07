<script lang="ts">
    import ImageFileInput from "$lib/components/inputs/ImageFileInput.svelte";
    import TextInput from "$lib/components/inputs/TextInput.svelte";
    import ActionButton from "$lib/components/buttons/ActionButton.svelte";
    import PendingFlashMessage from "$lib/components/flashMessages/PendingFlashMessage.svelte";
    import SuccessFlashMessage from "$lib/components/flashMessages/SuccessFlashMessage.svelte";
    import ErrorFlashMessage from "$lib/components/flashMessages/ErrorFlashMessage.svelte";
    import NumberInput from "$lib/components/inputs/NumberInput.svelte";
    import AddItemButton from "$lib/components/buttons/AddItemButton.svelte";
    import SelectInput from "$lib/components/inputs/SelectInput.svelte";
    import States from '$lib/data/states.titlecase.json';
    import EmailInput from "$lib/components/inputs/EmailInput.svelte";
    import PhoneInput from "$lib/components/inputs/PhoneInput.svelte";
    import AnimatedCheckbox from "$lib/components/inputs/AnimatedCheckbox.svelte";
    import TextInputReadonly from "$lib/components/inputs/TextInputReadonly.svelte";
    import SearchInput from "$lib/components/inputs/SearchInput.svelte";
  import TextArea from "$lib/components/inputs/TextArea.svelte";

    const sessionOptions = [
        {session: "2029-2030"},
        {session: "2028-2029"},
        {session: "2027-2028"},
        {session: "2026-2027"},
        {session: "2025-2026"},
        {session: "2024-2025"},
        {session: "2023-2024"},
        {session: "2022-2023"},
        {session: "2021-2022"},
        {session: "2020-2021"},
        {session: "2019-2020"},
        {session: "2018-2019"},
        {session: "2017-2018"},
    ];

    let imageFileInputValue: string = "";
    let imageAltTextInputValue: string = "";
    let image: any;
    let legislationTitleInputValue: string = "";
    let yearReleasedInputValue: number | null = null;
    let governmentLevelInputValue: string = "";
    let stateInputValue: string = "";
    let countyInputValue: string = "";
    let cityInputValue: string = "";
    let introducedInHouseChecked: boolean = false;
    let introducedInSenateChecked: boolean = false;
    let houseSessionInputValue: string = "";
    let senateSessionInputValue: string = "";
    let houseSponsorsInputValue: string = "";
    let senateSponsorsInputValue: string = "";
    let websiteURLInputValue: string = "";
    let detailsInputValue: string = "";

    let passedInHouseChecked: boolean = false;
    let passedInSenateChecked: boolean = false;
    let rejectedByHouseChecked: boolean = false;
    let rejectedBySenateChecked: boolean = false;
    let vetoedByExecutiveChecked: boolean = false;
    let ExecutiveSignedIntoLawChecked: boolean = false;
    
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
    let legislationTitleIsValid: boolean = true;
    let yearReleasedIsValid: boolean = true;
    let houseSessionIsValid: boolean = true;
    let senateSessionIsValid: boolean = true;
    let houseSponsorsIsValid: boolean = true;
    let senateSponsorsIsValid: boolean = true;
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

    const governmentLevelOptions: GovernmentLevel[] = [
        {
            name: "federal"
        },
        {
            name: "state"
        },
        {
            name: "county"
        },
        {
            name: "city"
        }
    ];

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

    const submitLegislationEndoresementHandler = () => {

    };

    let pending: boolean = false;

    $: if((responseItem.success) || (responseItem.error)) {
        pending = false;
    };

    let addSponsorClicked: boolean;

    $: console.log(addSponsorClicked);

</script>
<div class="add_legislation_endorsement_container">
    <h1>add legislation endorsement</h1>
    <form 
        class="form_container"
        on:submit|preventDefault={submitLegislationEndoresementHandler}
    >
        <h2>legislation image</h2>
        <h3>select an image to represent the legislation*</h3>
        <p class="constraints">* file formats accepted: JPG, PNG, GIF</p>
        <p class="constraints">* maximum file size: 5MB</p>
        <ImageFileInput
            inputLabel={true}
            bind:imageFileInputValue={imageFileInputValue}
            bind:image={image}
            placeholder="/image.jpg"
            inputName="legislation_image"
            inputID="legislation_image"
            bind:isValid={imageFileIsValid}
            required={true}
            imageFileInputErrorMessage="image file required"
        >
            image file
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
            placeholder="legislation_banner_image.jpg"
            inputName="image_alt_text"
            inputID="image_alt_text"
            required={true}
            textInputErrorMessage="image alt text required"
        >
            image alt text
        </TextInput>
        <h2>legislation information</h2>
        <TextInput
            inputLabel={true}
            bind:textInputValue={legislationTitleInputValue}
            bind:isValid={legislationTitleIsValid}
            placeholder="Creative Economy Revitalization Act (CERA)"
            inputName="legislation_title"
            inputID="legislation title"
            required={true}
            textInputErrorMessage="legislation title required"
        >
            legislation title
        </TextInput>
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
        <div class="two_columns">
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={introducedInHouseChecked}>
                    introduced in the House
                </AnimatedCheckbox>
                {#if (introducedInHouseChecked)}
                    <SelectInput
                        options={sessionOptions}
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
                        bind:textInputValue={houseSponsorsInputValue}
                        bind:isValid={houseSponsorsIsValid}
                        placeholder="Alexandria Ocasio-Cortez"
                        inputName="sponsor_1"
                        inputID="sponsor_1"
                        required={true}
                        textInputErrorMessage="sponsor required"
                    >
                        House sponsor(s)
                    </TextInput>
                    <AddItemButton
                        bind:addItemClicked={addSponsorClicked}
                    >
                        sponsor
                    </AddItemButton>
                {/if}
            </div>
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={introducedInSenateChecked}>
                    introduced in the Senate
                </AnimatedCheckbox>
                {#if (introducedInSenateChecked)}
                    <SelectInput
                        options={sessionOptions}
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
                        bind:textInputValue={senateSponsorsInputValue}
                        bind:isValid={senateSponsorsIsValid}
                        placeholder="Bernie Sanders"
                        inputName="sponsor"
                        inputID="sponsor"
                        required={true}
                        textInputErrorMessage="sponsor required"
                    >
                        Senate sponsor(s)
                    </TextInput>
                    <AddItemButton
                        bind:addItemClicked={addSponsorClicked}
                    >
                        sponsor
                    </AddItemButton>
                {/if}
            </div>
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
            government level
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
            placeholder="The legisation would..."
            inputName="legislation_details"
            inputID="legislation_details"
            required={true}
            textAreaInputErrorMessage="details required"
        >
            details
        </TextArea>
        <h2>campaign status</h2>
        <div class="two_columns_checkbox">
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={passedInHouseChecked}>
                    passed in the House
                </AnimatedCheckbox>
            </div>
            <div class="checkbox_column" >
                <AnimatedCheckbox bind:checked={passedInSenateChecked}>
                    passed in the Senate
                </AnimatedCheckbox>
            </div>
        </div>
        <div class="two_columns_checkbox">
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={rejectedByHouseChecked}>
                    rejected by House
                </AnimatedCheckbox>
            </div>
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={rejectedBySenateChecked}>
                    rejected by Senate          
                </AnimatedCheckbox>
            </div>
        </div>
        <div class="two_columns_checkbox">
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={ExecutiveSignedIntoLawChecked}>
                    Executive signed into law
                </AnimatedCheckbox>
            </div>
            <div class="checkbox_column">
                <AnimatedCheckbox bind:checked={vetoedByExecutiveChecked}>
                    votoed by Executive           
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
                    first name*
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
                    last name*
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
                    email*
                </EmailInput>
                <PhoneInput 
                    isValid={phoneContactIsValid}
                    inputID="phone"
                    inputName="phone"
                    bind:phoneInputValue={phoneContactInputValue}
                    inputLabel={true}
                    required={true}
                >
                    phone number*
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
                    street address*
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
                    city*
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
                    state*
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
                    zip code*
                </NumberInput>
            {/if}
        <ActionButton>
            add legislation endorsement
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

    .add_legislation_endorsement_container {
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
