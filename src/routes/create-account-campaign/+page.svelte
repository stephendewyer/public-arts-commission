<script lang="ts">
    import TextInput from '$lib/components/inputs/TextInput.svelte';
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import DateInput from '$lib/components/inputs/DateInput.svelte';
    import ComparePasswords from '$lib/components/inputs/createPasswordInputs/ComparePasswords.svelte';
    import SelectInput from '$lib/components/inputs/SelectInput.svelte';
    import PhoneInput from '$lib/components/inputs/PhoneInput.svelte';
    import NumberInput from '$lib/components/inputs/NumberInput.svelte';
    import AnimatedCheckbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import InputErrorMessage from '$lib/components/errorMessages/InputErrorMessage.svelte';
	import createAccountBackground from '$lib/images/backgrounds/11_December_2012_take_Lansing,_Michigan.jpg';
    import PendingFlashMessage from '$lib/components/flashMessages/PendingFlashMessage.svelte';
    import SuccessFlashMessage from '$lib/components/flashMessages/SuccessFlashMessage.svelte';
    import ErrorFlashMessage from '$lib/components/flashMessages/ErrorFlashMessage.svelte';
	import { goto } from '$app/navigation';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';
    import States from '$lib/data/states.titlecase.json';
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';

    let campaignNameInputValue: string = "";
    let electorateInputValue: string = "";
    let partyInputValue: string = "";
    let primaryElectionDateInputValue: string = "";
    let generalElectionDateInputValue: string = "";
    let websiteURLInputValue: string = "";
    let nameFirstInputValue: string = "";
    let nameLastInputValue: string = "";
    let phoneInputValue: string = "";
    let streetAddressInputValue: string = "";
    let streetAddress02InputValue: string = "";
    let cityInputValue: string = "";
    let stateInputValue: string = "";
    let zipCodeInputValue: number | string = "";
    let authorizedRepresentativeInputValue: boolean = false;
    let emailInputValue: string = "";
    let passwordInputValue: string = "";
    let passwordReenteredInputValue: string = "";

    let campaignNameIsValid: boolean = true;
    let electorateIsValid: boolean = true;
    let partyIsValid: boolean = true;
    let primaryElectionDateIsValid: boolean = true;
    let generalElectionDateIsValid: boolean = true;
    let websiteURLIsValid: boolean = true;
    let nameFirstIsValid: boolean = true;
    let nameLastIsValid: boolean = true;
    let phoneIsValid: boolean = true;
    let streetAddressIsValid: boolean = true;
    let streetAddress02IsValid: boolean = true;
    let cityIsValid: boolean = true;
    let stateIsValid: boolean = true;
    let zipCodeIsValid: boolean = true;
    let authorizedRepresentativeIsValid: boolean = true;
    let emailIsValid: boolean = true;
    let passwordIsValid: boolean = true;
    let passwordReenteredIsValid: boolean = true;

    $: if (authorizedRepresentativeInputValue === true) {
        authorizedRepresentativeIsValid = true;
    };

    let authorizedRepresentativeInputErrorMessage: string = "campaign authorization required to create account"

    let loginVoterButtonDisabled: boolean = false;

    // after submit

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

    const createAccount = async (
        campaignName: string,
        electorate: string,
        party: string,
        primaryElectionDate: string,
        generalElectionDate: string,
        websiteURL: string,
        nameFirst: string,
        nameLast: string,
        phoneNumber: string,
        streetAddress: string,
        streetAddress02: string,
        city: string,
        state: string,
        zipCode: number | string | null,
        authorizedRepresentative: boolean,
        email: string,
        password: string,
        reenteredPassword: string
    ) => {
        const response = await fetch("/api/createAccounts/createCampaignAccount", {
            method: 'POST',
            body: JSON.stringify({
                campaignName,
                electorate,
                party,
                primaryElectionDate,
                generalElectionDate,
                websiteURL,
                nameFirst,
                nameLast,
                phoneNumber,
                streetAddress,
                streetAddress02,
                city,
                state,
                zipCode,
                authorizedRepresentative,
                email,
                password,
                reenteredPassword
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        responseItem = await response.json();
        return responseItem;
    }

    const createAccountHandler = async () => {
        pending = true;
        try {
            await createAccount(
                campaignNameInputValue,
                electorateInputValue,
                partyInputValue,
                primaryElectionDateInputValue,
                generalElectionDateInputValue,
                websiteURLInputValue,
                nameFirstInputValue,
                nameLastInputValue,
                phoneInputValue,
                streetAddressInputValue,
                streetAddress02InputValue,
                cityInputValue,
                stateInputValue,
                zipCodeInputValue,
                authorizedRepresentativeInputValue,
                emailInputValue,
                passwordInputValue,
                passwordReenteredInputValue
            );
            if (responseItem.success) {
                campaignNameInputValue = "",
                electorateInputValue = "",
                partyInputValue = "",
                primaryElectionDateInputValue = "",
                generalElectionDateInputValue = "",
                websiteURLInputValue = "",
                nameFirstInputValue = "",
                nameLastInputValue = "",
                phoneInputValue = "",
                streetAddressInputValue = "",
                streetAddress02InputValue = "",
                cityInputValue = "",
                stateInputValue = "",
                zipCodeInputValue = "",
                authorizedRepresentativeInputValue = false,
                emailInputValue = "",
                passwordInputValue = "",
                passwordReenteredInputValue = ""
                goto("/login-campaign");
            };

            if (responseItem.error) {
                if (campaignNameInputValue === "") {
                    campaignNameIsValid = false;
                };
                if (electorateInputValue === "") {
                    electorateIsValid = false;
                };
                if (partyInputValue === "") {
                    partyIsValid = false;
                };
                if (primaryElectionDateInputValue === "") {
                    primaryElectionDateIsValid = false;
                };
                if (generalElectionDateInputValue === "") {
                    generalElectionDateIsValid = false;
                };
                if (nameFirstInputValue === "") {
                    nameFirstIsValid = false;
                };
                if (nameLastInputValue === "") {
                    nameLastIsValid = false;
                };
                if (phoneInputValue === "") {
                    phoneIsValid = false;
                };
                if (streetAddressInputValue === "") {
                    streetAddressIsValid = false;
                };
                if (cityInputValue === "") {
                    cityIsValid = false;
                };
                if (stateInputValue === "") {
                    stateIsValid = false;
                };
                if (zipCodeInputValue === null) {
                    zipCodeIsValid = false;
                };
                if (authorizedRepresentativeInputValue === false) {
                    authorizedRepresentativeIsValid = false;
                };
                if (passwordInputValue === "") {
                    passwordIsValid = false;
                };
                if (passwordReenteredInputValue === "") {
                    passwordReenteredIsValid = false;
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
<svelte:head>
	<title>create a free campaign account - public arts commission</title>
	<meta name="description" content="create a campaign account to apply and manage applications for endorsement by public arts commission using the campaign portal!" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<div 
    class="create_account_container"
    style="background-image: url({createAccountBackground});"
>
    <div 
        id="campaign" 
        class="create_account_section"
    >
        <h1>
            create a free campaign account
        </h1>
        <h4 class="account_info">
            create a free campaign account to: 
            <ul>
                <li>
                    apply and manage applications for endorsement by public arts commission
                </li>
                <li>
                    endorsed campaigns offered subscriptions to a network of public arts commission voters in their electorate (forthcoming)
                </li>
            </ul>
        </h4>  
        <h3>*indicates required</h3>
        <form 
            on:submit|preventDefault={createAccountHandler}
            class="create_account_form"
        > 
            <h2>campaign information</h2>
            <div class="create_account_input">
                <TextInput 
                    isValid={campaignNameIsValid}
                    placeholder="candidate for X office"
                    inputID="campaign_name"
                    inputName="campaign_name"
                    bind:textInputValue={campaignNameInputValue}
                    inputLabel={true}
                    required={true}
                    textInputErrorMessage="campaign name required"
                >
                    campaign name*
                </TextInput>
            </div>
            <div class="create_account_input">
                <TextInput 
                    isValid={electorateIsValid}
                    placeholder="area represented by office sought"
                    inputID="electorate"
                    inputName="electorate"
                    bind:textInputValue={electorateInputValue}
                    inputLabel={true}
                    required={true}
                    textInputErrorMessage="electorate required"
                >
                    electorate*
                </TextInput>
            </div>
            <div class="create_account_input">
                <TextInput 
                    isValid={partyIsValid}
                    placeholder="The Democracy Party"
                    inputID="party"
                    inputName="party"
                    bind:textInputValue={partyInputValue}
                    inputLabel={true}
                    required={true}
                    textInputErrorMessage="party required"
                >
                    party*
                </TextInput>
            </div>
            <div class="two_columns_inputs_row">
                <div class="create_account_input">
                    <DateInput 
                        isValid={primaryElectionDateIsValid}
                        inputID="primary_election_date"
                        inputName="primary_election_date"
                        bind:dateInputValue={primaryElectionDateInputValue}
                        inputLabel={true}
                        required={true}
                        dateInputErrorMessage="primary election date required"
                    >
                        primary election date
                    </DateInput>
                </div>
                <div class="create_account_input">
                    <DateInput 
                        isValid={generalElectionDateIsValid}
                        inputID="general_election_date"
                        inputName="general_election_date"
                        bind:dateInputValue={generalElectionDateInputValue}
                        inputLabel={true}
                        required={true}
                        dateInputErrorMessage="general election date required"
                    >
                        general election date*
                    </DateInput>
                </div>
            </div>
            <div class="create_account_input">
                <TextInput 
                    isValid={websiteURLIsValid}
                    placeholder="https://candidateforXoffice.com"
                    inputID="website_URL"
                    inputName="website_URL"
                    bind:textInputValue={websiteURLInputValue}
                    inputLabel={true}
                    required={false}
                >
                    campaign website URL
                </TextInput>
            </div>
            <h2>campaign contact information</h2>
            <div class="two_columns_inputs_row">
                <div class="create_account_input">
                    <TextInput 
                        isValid={nameFirstIsValid}
                        placeholder="Marco"
                        inputID="name_first"
                        inputName="name_first"
                        bind:textInputValue={nameFirstInputValue}
                        inputLabel={true}
                        required={true}
                        textInputErrorMessage="first name required"
                    >
                        first name*
                    </TextInput>
                </div>
                <div class="create_account_input">
                    <TextInput 
                        isValid={nameLastIsValid}
                        placeholder="Polo"
                        inputID="name_last"
                        inputName="name_last"
                        bind:textInputValue={nameLastInputValue}
                        inputLabel={true}
                        required={true}
                        textInputErrorMessage="last name required"
                    >
                        last name*
                    </TextInput>
                </div>
            </div>
            <div class="create_account_input">
                <EmailInput 
                    isValid={emailIsValid}
                    placeholder="marcopolo@domain.com"
                    inputID="email"
                    inputName="email"
                    bind:emailInputValue={emailInputValue}
                    inputLabel={true}
                    required={true}
                >
                    email*
                </EmailInput>
            </div>
            <div class="create_account_input">
                <PhoneInput 
                    isValid={phoneIsValid}
                    inputID="phone"
                    inputName="phone"
                    bind:phoneInputValue={phoneInputValue}
                    inputLabel={true}
                    required={true}
                >
                    phone number*
                </PhoneInput>
            </div>
            <div class="two_columns_inputs_row">
                <div class="create_account_input">
                    <TextInput 
                        isValid={streetAddressIsValid}
                        placeholder="1111 State Street"
                        inputID="street_address"
                        inputName="street_address"
                        bind:textInputValue={streetAddressInputValue}
                        inputLabel={true}
                        required={true}
                        textInputErrorMessage="street address required"
                    >
                        street address*
                    </TextInput>
                </div>
                <div class="create_account_input">
                    <TextInput 
                        isValid={streetAddress02IsValid}
                        placeholder="Suite 2"
                        inputID="street_address_02"
                        inputName="street_address_02"
                        bind:textInputValue={streetAddress02InputValue}
                        inputLabel={true}
                        required={false}
                    >
                        street address 2
                    </TextInput>
                </div>
            </div>
            <div class="two_columns_inputs_row">
                <div class="create_account_input">
                    <TextInput 
                        isValid={cityIsValid}
                        placeholder="Democracy City"
                        inputID="city"
                        inputName="city"
                        bind:textInputValue={cityInputValue}
                        inputLabel={true}
                        required={true}
                        textInputErrorMessage="city required"
                    >
                        city*
                    </TextInput>
                </div>
                <div class="create_account_input">
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
                        state*
                    </SelectInput>
                </div>
            </div>
            <div class="create_account_input">
                <NumberInput 
                    isValid={zipCodeIsValid}
                    placeholder=11111
                    inputID="zip_code"
                    inputName="zip_code"
                    bind:numberInputValue={zipCodeInputValue}
                    inputLabel={true}
                    required={true}
                    numberInputErrorMessage="zip code required"
                >
                    zip code*
                </NumberInput>
            </div>
            <h2>campaign password</h2>
            <div class="create_account_input">
                <ul>
                    <li>
                        password must have at least 7 characters and 14 or less characters
                    </li>
                    <li>
                        password must have at least one number and one special character
                    </li>
                    <li>
                        password must have at least one capitalized letter and one lower case letter
                    </li>
                </ul>
                <ComparePasswords 
                    bind:passwordInputValue
                    bind:passwordReenteredInputValue
                    bind:passwordIsValid
                    bind:passwordReenteredIsValid
                >
                    <p slot="password_label">password*</p>
                    <p slot="re-entered_password_label">re-enter password*</p>
                </ComparePasswords>
            </div>
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
            <SubmitButton 
                disable={loginVoterButtonDisabled}
            >
                create account
            </SubmitButton>
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
        <div class="create_account_helpers_container">
            <div class="create_account_helpers_column">
                <h4 class="create_account_helper_prompt">
                    already have an account?
                </h4>
                <a href="/login-campaign">
                    <ActionButtonSecondary>
                        campaign login
                    </ActionButtonSecondary>
                </a>
            </div>
            <div class="create_account_helpers_column">
                <h4 class="create_account_helper_prompt">
                    forgot your password?
                </h4>
                <a href="/reset-password/campaign">
                    <ActionButtonSecondary>
                        reset password
                    </ActionButtonSecondary>
                </a>
            </div>
        </div>
    </div>
</div>

<style>

    #campaign {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .account_info {
        line-height: 1.4; 
        max-width: 28rem; 
        margin: 0 auto;
    }

    .create_account_container {
		width: 100%;
		background-size: cover;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem 1rem;
		background-repeat: no-repeat;
		background-position: center;
	}

	.create_account_section {
		background-color: rgba(239,249,242,0.7);
		max-width: 52rem;
		width: 100%;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

    .create_account_form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 28rem;
    }

    .two_columns_inputs_row {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        width: 100%;
    }

    .create_account_input {
		padding: 0.5rem 0;
        width: 100%;
        max-width: 28rem;
	}

    .create_account_helpers_container {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        width: 100%;
        padding: 1rem 0;
        gap: 0.25rem;
    }

    .create_account_helpers_column {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .create_account_helper_prompt {
        text-align: center;
        width: 100%;
        padding: 0 0.5rem;
    }

    @media (max-width: 1140px) {

        .create_account_helpers_container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        .create_account_helpers_column {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
        }

    }

    @media (max-width: 720px) {

        .create_account_helpers_container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        .create_account_helpers_column {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
        }

    }

</style>