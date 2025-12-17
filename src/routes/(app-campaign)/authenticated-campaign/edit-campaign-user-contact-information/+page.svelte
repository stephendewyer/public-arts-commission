<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import TextInput from '$lib/components/inputs/TextInput.svelte';
    import NumberInput from '$lib/components/inputs/NumberInput.svelte';
    import SelectInput from '$lib/components/inputs/SelectInput.svelte';
    import PhoneInput from '$lib/components/inputs/PhoneInput.svelte';
    import PendingFlashMessage from "$lib/components/flashMessages/PendingFlashMessage.svelte";
    import SuccessFlashMessage from "$lib/components/flashMessages/SuccessFlashMessage.svelte";
    import ErrorFlashMessage from "$lib/components/flashMessages/ErrorFlashMessage.svelte";
    import States from '$lib/data/states.titlecase.json';
    import ActionButton from '$lib/components/buttons/ActionButton.svelte';
    import CancelButton from '$lib/components/buttons/CancelButton.svelte';
    import { goto } from '$app/navigation';
    import type { E164Number } from 'svelte-tel-input/types';
    import { onMount } from 'svelte';

    export let data;

    const userCampaignInformation: CampaignUserInformation = data.streamed.campaignUserInformationRow;

    let campaignUserInformationID: number = userCampaignInformation.campaign_user_information_ID;

    let campaignUserID: number = userCampaignInformation.user_ID;

    const userEmail: string = data.streamed.user.email;

    let emailInputValue: string;
    let nameFirstInputValue: string = userCampaignInformation.name_first;
    let nameLastInputValue: string = userCampaignInformation.name_last;
    let phoneNumberInputValue: E164Number = userCampaignInformation?.phone_number ? userCampaignInformation?.phone_number?.toString() : "";
    let streetAddressInputValue: string  = userCampaignInformation.street_address;
    let streetAddress02InputValue: string = userCampaignInformation.street_address_02;
    let cityInputValue: string = userCampaignInformation.city;
    let stateInputValue: string = userCampaignInformation.state;
    let zipCodeInputValue: number = userCampaignInformation.zip_code;

    onMount(() => {
        emailInputValue = userEmail;
    });

    let nameFirstIsValid: boolean = true;
    let nameLastIsValid: boolean = true;
    let phoneNumberIsValid: boolean = true;
    let streetAddressIsValid: boolean = true;
    let streetAddress02IsValid: boolean = true;
    let cityIsValid: boolean = true;
    let stateIsValid: boolean = true;
    let zipCodeIsValid: boolean = true;
    let emailIsValid: boolean = true;

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

    const updateCampaignUserInformation = async (
        campaignUserID: number,
        campaignUserInformationID: number,
        email: string | null | undefined,
        nameFirst: string,
        nameLast: string,
        phoneNumber: E164Number,
        streetAddress: string,
        streetAddress02: string,
        city: string,
        state: string,
        zipCode: number
    ) => {
        const response = await fetch("/authenticated-campaign/api/updateCampaignUserInformation", {
            method: 'PATCH',
            body: JSON.stringify({
                campaignUserID,
                campaignUserInformationID,
                email,
                nameFirst,
                nameLast,
                phoneNumber,
                streetAddress,
                streetAddress02,
                city,
                state,
                zipCode
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        responseItem = await response.json();
        return responseItem;
    }

    const updateCampaignUserInformationHandler = async () => {
        pending = true;
        try {
            await updateCampaignUserInformation(
                campaignUserID,
                campaignUserInformationID,
                emailInputValue,
                nameFirstInputValue,
                nameLastInputValue,
                phoneNumberInputValue,
                streetAddressInputValue,
                streetAddress02InputValue,
                cityInputValue,
                stateInputValue,
                zipCodeInputValue
            );
            if (responseItem.success) {
                emailInputValue = "",
                nameFirstInputValue = "",
                nameLastInputValue = "",
                phoneNumberInputValue = "",
                streetAddressInputValue = "",
                streetAddress02InputValue = "",
                cityInputValue = "",
                stateInputValue = ""
                goto("/authenticated-campaign");
            };

            if (responseItem.error) {
                if (emailInputValue === "") {
                    emailIsValid = false;
                };
                if (nameFirstInputValue === "") {
                    nameFirstIsValid = false;
                };
                if (nameLastInputValue === "") {
                    nameLastIsValid = false;
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
	<title>edit contact information - public arts commission</title>
	<meta name="description" content="edit campaign user contact information" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<div class="campaign_user_information_container">
    <h1>
        {userCampaignInformation.name_first} {userCampaignInformation.name_last}'s information
    </h1>
    <h3>*indicates required</h3>
    <form 
        on:submit|preventDefault={updateCampaignUserInformationHandler}
        class="update_campaign_user_information_form"
    > 
        <EmailInput
            isValid={emailIsValid}
            placeholder="candidate for X office"
            inputID="campaign_name"
            inputName="campaign_name"
            bind:emailInputValue={emailInputValue}
            inputLabel={true}
            required={true}
        >
            email address*
        </EmailInput>
        <div class="two_columns">
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
        <PhoneInput 
            isValid={phoneNumberIsValid}
            inputID="phone"
            inputName="phone"
            bind:phoneInputValue={phoneNumberInputValue}
            inputLabel={true}
            required={false}
        >
            phone number
        </PhoneInput>
        <div class="two_columns">
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
        <div class="two_columns">
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
        <ActionButton 
            disable={false}
        >
            update my information
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

    <a href="/authenticated-campaign" class="cancel_button_container">
        <CancelButton>
            cancel
        </CancelButton>
    </a>
    
</div>

<style>
    .campaign_user_information_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        max-width: 40rem;
        width: 100%;
        padding: 0 1rem;
        margin: 0 auto;
    }

    .update_campaign_user_information_form {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
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