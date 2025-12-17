<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import TextInput from '$lib/components/inputs/TextInput.svelte';
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import ComparePasswords from '$lib/components/inputs/createPasswordInputs/ComparePasswords.svelte';
    import AnimatedCheckbox from '$lib/components/inputs/AnimatedCheckbox.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';
	import createAccountBackground from '$lib/images/backgrounds/11_December_2012_take_Lansing,_Michigan.jpg';
    import PendingFlashMessage from '$lib/components/flashMessages/PendingFlashMessage.svelte';
    import SuccessFlashMessage from '$lib/components/flashMessages/SuccessFlashMessage.svelte';
    import InputErrorMessage from '$lib/components/errorMessages/InputErrorMessage.svelte';
    import ErrorFlashMessage from '$lib/components/flashMessages/ErrorFlashMessage.svelte';
	import { goto } from '$app/navigation';

    let nameFirstInputValue: string = "";
    let nameLastInputValue: string = "";
    let emailInputValue: string = "";
    let passwordInputValue: string = "";
    let passwordReenteredInputValue: string = "";
    let citizenEligibleVoterInputValue: boolean = false;
    let unionMemberInputValue: boolean = false;

    let nameFirstIsValid: boolean = true;
    let nameLastIsValid: boolean = true;
    let emailIsValid: boolean = true;
    let passwordIsValid: boolean = true;
    let passwordReenteredIsValid: boolean = true;
    let citizenEligibleVoterIsValid: boolean = true;

    let createVoterAccountButtonDisabled: boolean = false;

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

    $: if (citizenEligibleVoterInputValue === true) {
        citizenEligibleVoterIsValid = true;
    };

    const createAccount = async (
        nameFirst: string,
        nameLast: string,
        email: string,
        password: string,
        reenteredPassword: string,
        citizenEligibleVoter: boolean,
        unionMember: boolean
    ) => {
        const response = await fetch("/api/createAccounts/createVoterAccount", {
            method: 'POST',
            body: JSON.stringify({
                nameFirst,
                nameLast,
                email,
                password,
                reenteredPassword,
                citizenEligibleVoter,
                unionMember
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
                nameFirstInputValue,
                nameLastInputValue,
                emailInputValue,
                passwordInputValue,
                passwordReenteredInputValue,
                citizenEligibleVoterInputValue,
                unionMemberInputValue
            );
            if (responseItem.success) {
                nameFirstInputValue = "";
                nameLastInputValue = "";
                emailInputValue = "";
                passwordInputValue = "";
                passwordReenteredInputValue = "";
                goto("/login-voter");
            };

            if (responseItem.error) {
                if (nameFirstInputValue === "") {
                    nameFirstIsValid = false;
                };
                if (nameLastInputValue === "") {
                    nameLastIsValid = false;
                };
                if (emailInputValue === "") {
                    emailIsValid = false;
                };
                if (passwordInputValue === "") {
                    passwordIsValid = false;
                };
                if (passwordReenteredInputValue === "") {
                    passwordReenteredIsValid = false;
                };
                if (citizenEligibleVoterInputValue === false) {
                    citizenEligibleVoterIsValid = false;
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
	<title>create a free voter account - public arts commission</title>
	<meta name="description" content="create a free public arts commission voter account" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<div 
    class="create_account_container"
    style="background-image: url({createAccountBackground});"
>
    <div 
        id="voter" 
        class="create_account_section"
    >
        <h1>
            create a free voter account
        </h1>
        <h4 class="account_info">create a free voter account to: 
            <ul>
                <li>
                    network with other voters
                </li>
                <li>
                    organize actions and campaigns
                </li>
                <li>
                    connect with actions and campaigns in network
                </li>
                <li>
                    track elections
                </li>
                <li>
                    manage nominations for endorsement by public arts commission
                </li>
            </ul>
        </h4>
        <form 
            on:submit|preventDefault={createAccountHandler}
            class="create_account_form"
        > 
            <h3>*indicates required</h3>
            <div class="create_account_input">
                <TextInput 
                    isValid={nameFirstIsValid}
                    placeholder="Marco"
                    inputID="voter_name_first"
                    inputName="voter_name_first"
                    inputLabel={true}
                    bind:textInputValue={nameFirstInputValue}
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
                    inputID="last_name"
                    inputName="last_name"
                    inputLabel={true}
                    bind:textInputValue={nameLastInputValue}
                    required={true}
                    textInputErrorMessage="last name required"
                >
                    last name*
                </TextInput>
            </div>
            <div class="create_account_input">
                <EmailInput 
                    isValid={emailIsValid}
                    placeholder="myEmail@myCampaign.com"
                    inputID="campaign_email"
                    inputName="campaign_email"
                    inputLabel={true}
                    bind:emailInputValue={emailInputValue}
                    required={true}
                >
                    email*
                </EmailInput>
            </div>

            <div class="create_account_input">
                <h3>create password</h3>
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
            <div class="create_account_input" style={"display: flex; flex-direction: column; align-items: flex-start;"}>
                <AnimatedCheckbox bind:checked={citizenEligibleVoterInputValue}>
                    I am a citizen of the United States and eligible to vote in United States elections.*
                </AnimatedCheckbox>
                {#if (!citizenEligibleVoterIsValid)}
                    <InputErrorMessage>must have citizenship and voter eligibility to create account</InputErrorMessage>
                {/if}
            </div>
            <div class="create_account_input" style={"display: flex; flex-direction: column; align-items: flex-start;"}>
                <AnimatedCheckbox bind:checked={unionMemberInputValue}>
                    I am a union member.
                </AnimatedCheckbox>
            </div>
            <SubmitButton 
                disable={createVoterAccountButtonDisabled}
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
                <a href="/login-voter">
                    <ActionButtonSecondary>
                        voter login
                    </ActionButtonSecondary>
                </a>
            </div>
            <div class="create_account_helpers_column">
                <h4 class="create_account_helper_prompt">
                    forgot your password?
                </h4>
                <a href="/reset-password/voter">
                    <ActionButtonSecondary>
                        reset password
                    </ActionButtonSecondary>
                </a>
            </div>
        </div>
    </div>
</div>

<style>

    #voter {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
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

    .account_info {
        line-height: 1.4; 
        max-width: 28rem; 
        margin: 0 auto;
    }

    .create_account_form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 40rem;
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