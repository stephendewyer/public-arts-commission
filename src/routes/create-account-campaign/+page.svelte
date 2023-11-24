<script lang="ts">
    import TextInput from '$lib/components/inputs/TextInput.svelte';
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import PasswordInput from '$lib/components/inputs/PasswordInput.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';
    import YearSelection from '$lib/components/selections/YearSelection.svelte';
    import InputErrorMessage from '$lib/components/errorMessages/InputErrorMessage.svelte';
	import createAccountBackground from '$lib/images/backgrounds/11_December_2012_take_Lansing,_Michigan.jpg';
    import PendingFlashMessage from '$lib/components/flashMessages/PendingFlashMessage.svelte';
    import SuccessFlashMessage from '$lib/components/flashMessages/SuccessFlashMessage.svelte';
    import ErrorFlashMessage from '$lib/components/flashMessages/ErrorFlashMessage.svelte';
	import { goto } from '$app/navigation';
    import PasswordsMismatchMessage from '$lib/components/errorMessages/PasswordsMismatchMessage.svelte';
    import PasswordsMatchMessage from '$lib/components/successMessages/PasswordsMatchMessage.svelte';

    let campaignNameInputValue: string = "";
    let electionYearInputValue: number;
    let electorateInputValue: string = "";
    let partyInputValue: string = "";
    let primaryElectionDateInputValue: string = "";
    let generalElectionDateInputValue: string = "";
    let nameFirstInputValue: string = "";
    let nameLastInputValue: string = "";
    let phoneInputValue: string = "";
    let streetAddressInputValue: string = "";
    let streetAddress02InputValue: string = "";
    let cityInputValue: string = "";
    let stateInputValue: string = "";
    let zipCodeInputValue: number;
    let authorizedRepresentativeInputValue: boolean = false;
    let emailInputValue: string = "";
    let passwordInputValue: string = "";
    let passwordReenteredInputValue: string = "";

    let campaignNameIsValid: boolean = true;
    let electionYearIsValid: boolean = true;
    let electorateIsValid: boolean = true;
    let partyIsValid: boolean = true;
    let primaryElectionDateIsValid: boolean = true;
    let generalElectionDateIsValid: boolean = true;
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
    let passwordReenteredIsValid: boolean | null = null;

    let campaignNameInputTouched: boolean = false;
    let electionYearInputTouched: boolean = false;
    let electorateInputTouched: boolean = false;
    let partyInputTouched: boolean = false;
    let primaryElectionDateInputIsTouched: boolean = false;
    let generalElectionDateInputIsTouched: boolean = false;
    let nameFirstInputTouched: boolean = false;
    let nameLastInputTouched: boolean = false;
    let phoneInputTouched: boolean = false;
    let streetAddressInputTouched: boolean = false;
    let streetAddress02InputTouched: boolean = false;
    let cityInputTouched: boolean = false;
    let stateInputTouched: boolean = false;
    let zipCodeInputTouched: boolean = false;
    let authorizedRepresentativeInputTouched: boolean = false;
    let emailInputTouched: boolean = false;
    let passwordInputTouched: boolean = false;
    let passwordReenteredInputTouched: boolean = false;

    let campaignNameInputErrorMessage: string = "";
    let electionYearInputErrorMessage: string = "";
    let electorateInputErrorMessage: string = "";
    let partyInputErrorMessage: string = "";
    let primaryElectionDateInputErrorMessage: string = "";
    let generalElectionDateInputErrorMessage: string = "";
    let nameFirstInputErrorMessage: string = "";
    let nameLastInputErrorMessage: string = "";
    let phoneInputErrorMessage: string = "";
    let streetAddressInputErrorMessage: string = "";
    let streetAddress02InputErrorMessage: string = "";
    let cityInputErrorMessage: string = "";
    let zipCodeInputErrorMessage: string = "";
    let authorizedRepresentativeInputErrorMessage: string = "";
    let emailInputErrorMessage: string = "";
    let passwordInputErrorMessage: string = "";
    let passwordReenteredInputErrorMessage: string = "";

    let loginVoterButtonDisabled: boolean = true;

    $: if (
        campaignNameIsValid &&
        emailIsValid &&
        passwordIsValid &&
        passwordReenteredIsValid &&
        (campaignNameInputValue !== "") &&
        (emailInputValue !== "") &&
        (passwordInputValue !== "") &&
        (passwordReenteredInputValue !== "")
    ) {
        loginVoterButtonDisabled = false;
    } else {
        loginVoterButtonDisabled = true;
    };

    const createAccountCampaignNameValueChangedHandler = () => {
        if (campaignNameInputTouched) {
            if (campaignNameInputValue === "") {
                campaignNameIsValid = false;
                campaignNameInputErrorMessage = "a valid campaign name required";
            } else if (campaignNameInputValue !== "") {
                campaignNameIsValid = true;
            }
        } else if (!campaignNameInputTouched) {
            campaignNameIsValid = true;
        };
    };

    const createAccountCampaignNameFocusChangedHandler = () => {
        if (campaignNameInputTouched) {
            if (campaignNameInputValue === "") {
                campaignNameIsValid = false;
                campaignNameInputErrorMessage = "a valid campaign name required";
            } else if (campaignNameInputValue !== "") {
                campaignNameIsValid = true;
            };
        } else if (!campaignNameInputTouched) {
            campaignNameIsValid = true;
        };
    };

    const createAccountCampaignNameBlurChangedHandler = () => {
        campaignNameInputTouched = true;
        if (campaignNameInputValue === "") {
            campaignNameIsValid = false;
            campaignNameInputErrorMessage = "a valid campaign name required";
        } else if (campaignNameInputValue !== "") {
            campaignNameIsValid = true;
        };
    };

    const createAccountEmailValueChangedHandler = () => {
        if (emailInputTouched) {
            if (emailInputValue === "") {
                emailIsValid = false;
                emailInputErrorMessage = "a valid email required";
            } else if (!emailInputValue.includes('@')) {
                emailIsValid = false;
                emailInputErrorMessage = "email must have an @ symbol";
            } else if (emailInputValue !== "") {
                emailIsValid = true;
            }
        } else if (!emailInputTouched) {
            emailIsValid = true;
        };
    };

    const createAccountEmailFocusChangedHandler = () => {
        if (emailInputTouched) {
            if (emailInputValue === "") {
                emailIsValid = false;
                emailInputErrorMessage = "a valid email required";
            } else if (!emailInputValue.includes('@')) {
                emailIsValid = false;
                emailInputErrorMessage = "email must have an @ symbol";
            } else if (emailInputValue !== "") {
                emailIsValid = true;
            };
        } else if (!emailInputTouched) {
            emailIsValid = true;
        };
    };

    const createAccountEmailBlurChangedHandler = () => {
        emailInputTouched = true;
        if (emailInputValue === "") {
            emailIsValid = false;
            emailInputErrorMessage = "a valid email required";
        } else if (!emailInputValue.includes('@')) {
            emailIsValid = false;
            emailInputErrorMessage = "email must have an @ symbol";
        } else if (emailInputValue !== "") {
            emailIsValid = true;
        };
    };

    const createAccountPasswordValueChangedHandler = () => {
        if (passwordInputTouched) {
            if (passwordInputValue === "" && passwordReenteredInputValue === "") {
                passwordIsValid = false;
                passwordInputErrorMessage = "a valid password required";
                passwordReenteredIsValid = null;
            } else if (passwordInputValue !== "" && passwordReenteredInputValue === "") {
                passwordIsValid = true;
            } else if (passwordInputValue !== "" && passwordInputValue === passwordReenteredInputValue) {
                passwordIsValid = true;
                passwordReenteredIsValid = true;
            } else if (passwordInputValue !== "" && passwordReenteredInputValue !== "" && passwordInputValue !== passwordReenteredInputValue) {
                passwordReenteredIsValid = false;
            
            } else if (passwordInputValue === "" && passwordReenteredInputValue !== "") {
                passwordIsValid = false;
                passwordInputErrorMessage = "a valid password required"
                passwordReenteredIsValid = false;
            };
        } else if (!passwordInputTouched) {
            passwordIsValid = true;
        };
    };

    const createAccountPasswordFocusChangedHandler = () => {
        if (passwordInputTouched) {
            if (passwordInputValue === "") {
                passwordIsValid = false;
                passwordInputErrorMessage = "a valid password required"
            } else if (passwordInputValue !== "") {
                passwordIsValid = true;
            };
        } else if (!passwordInputTouched) {
            passwordIsValid = true;
        };
    };

    const createAccountPasswordBlurChangedHandler = () => {

        passwordInputTouched = true;

        if (passwordInputValue === "") {
            passwordIsValid = false;
            passwordInputErrorMessage = "a valid password required"
        } else if (passwordInputValue !== "") {
            passwordIsValid = true;
        };

    };

    const createAccountReenteredPasswordValueChangedHandler = () => {
        if (passwordReenteredInputTouched) {
            if (passwordReenteredInputValue === "" && passwordInputValue !== "") {
                passwordReenteredIsValid = false;
                passwordReenteredInputErrorMessage = "reentered password required"
            } else if (passwordReenteredInputValue === "" && passwordInputValue === "") {
                passwordReenteredIsValid = null;
                passwordReenteredInputErrorMessage = "reentered password required"
            } else if (passwordReenteredInputValue !== passwordInputValue) {
                passwordReenteredIsValid = false;
                passwordReenteredInputErrorMessage = "";
            } else if (passwordReenteredInputValue !== "" && passwordReenteredInputValue === passwordInputValue) {
                passwordReenteredIsValid = true;
            };
        } else if (!passwordReenteredInputTouched) {
            if (passwordReenteredInputValue !== "" && passwordReenteredInputValue === passwordInputValue) {
                passwordReenteredIsValid = true;
            } else {
                passwordReenteredIsValid = null;
            };
        };
    };

    const createAccountReenteredPasswordFocusChangedHandler = () => {
        if (passwordReenteredInputTouched) {
            if (passwordReenteredInputValue === "" && passwordInputValue !== "") {
                passwordReenteredIsValid = false;
                passwordReenteredInputErrorMessage = "reentered password required"
            } else if (passwordReenteredInputValue === "" && passwordInputValue === "") {
                passwordReenteredIsValid = null;
                passwordReenteredInputErrorMessage = "reentered password required"
            } else if (passwordReenteredInputValue !== passwordInputValue) {
                passwordReenteredIsValid = false;
                passwordReenteredInputErrorMessage = "";
            } else if (passwordReenteredInputValue !== "" && passwordReenteredInputValue === passwordInputValue) {
                passwordReenteredIsValid = true;
            };
        } else if (!passwordInputTouched) {
            passwordReenteredIsValid = null;
        } else {
            passwordReenteredIsValid = null;
        };
    };

    const createAccountReenteredPasswordBlurChangedHandler = () => {

        passwordReenteredInputTouched = true;

        if (passwordReenteredInputValue === "" && passwordInputValue !== "") {
            passwordReenteredIsValid = false;
            passwordReenteredInputErrorMessage = "reentered password required"
        } else if (passwordReenteredInputValue === "" && passwordInputValue === "") {
            passwordReenteredIsValid = null;
            passwordReenteredInputErrorMessage = "reentered password required"
        } else if (passwordReenteredInputValue !== passwordInputValue) {
            passwordReenteredIsValid = false;
            passwordReenteredInputErrorMessage = "";
        } else if (passwordReenteredInputValue !== "" && passwordReenteredInputValue === passwordInputValue) {
            passwordReenteredIsValid = true;
        } else if (passwordReenteredInputValue !== "" && passwordReenteredInputValue !== passwordInputValue) {
            passwordReenteredIsValid = false;
        } else {
            passwordReenteredIsValid = null;
        };

    };

    // after submit

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

    const createAccount = async (
        campaignName: string,
        electionYear: number,
        electorate: string,
        party: string,
        primaryElectionDate: string,
        generalElectionDate: string,
        nameFirst: string,
        nameLast: string,
        phoneNumber: string,
        streetAddress: string,
        streetAddress02: string,
        city: string,
        state: string,
        zipCode: number,
        authorizedRepresentative: boolean,
        email: string,
        password: string,
        reenteredPassword: string
    ) => {
        const response = await fetch("/api/createAccounts/createCampaignAccount", {
            method: 'POST',
            body: JSON.stringify({
                campaignName,
                electionYear,
                electorate,
                party,
                primaryElectionDate,
                generalElectionDate,
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
        console.log(responseItem);
        return responseItem;
    }

    const createAccountHandler = async () => {
        pending = true;
        try {
            await createAccount(
                campaignNameInputValue,
                electionYearInputValue,
                electorateInputValue,
                partyInputValue,
                primaryElectionDateInputValue,
                generalElectionDateInputValue,
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
                electionYearInputValue = 0,
                electorateInputValue = "",
                partyInputValue = "",
                primaryElectionDateInputValue = "",
                generalElectionDateInputValue = "",
                nameFirstInputValue = "",
                nameLastInputValue = "",
                phoneInputValue = "",
                streetAddressInputValue = "",
                streetAddress02InputValue = "",
                cityInputValue = "",
                stateInputValue = "",
                zipCodeInputValue = 0,
                authorizedRepresentativeInputValue = false,
                emailInputValue = "",
                passwordInputValue = "",
                passwordReenteredInputValue = "",
                passwordReenteredIsValid = null,
                goto("/login-campaign");
            };
        } catch (error) {
            console.log("catch");
        }
    };

    let pending: boolean = false;

    $: if((responseItem.success) || (responseItem.error)) {
        pending = false;
    };

</script>
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
        <form 
            on:submit|preventDefault={createAccountHandler}
            class="create_account_form"
        > 
            <div class="create_account_input">
                <TextInput 
                    isValid={campaignNameIsValid}
                    placeholder="candidate for X office"
                    inputID="campaign_name"
                    inputName="campaign_name"
                    bind:textInputValue={campaignNameInputValue}
                    inputLabel={true}
                    textInputValueChanged={() => campaignNameValueChangedHandler()}
                    textInputFocusChanged={() => campaignNameFocusChangedHandler()}
                    textInputBlurChanged={() => campaignNameBlurChangedHandler()}
                >
                    campaign name
                </TextInput>
                {#if (!campaignNameIsValid)}
                    <InputErrorMessage>{campaignNameInputErrorMessage}</InputErrorMessage>
                {/if}
            </div>
            <div class="create_account_input">
                <YearSelection  bind:yearInputValue={electionYearInputValue}>
                    election year
                </YearSelection>
            </div>
            <div class="create_account_input">
                <TextInput 
                    isValid={electorateIsValid}
                    placeholder="area represented by office sought"
                    inputID="electorate"
                    inputName="electorate"
                    bind:textInputValue={electorateInputValue}
                    inputLabel={true}
                    textInputValueChanged={() => electorateValueChangedHandler()}
                    textInputFocusChanged={() => electorateFocusChangedHandler()}
                    textInputBlurChanged={() => electorateBlurChangedHandler()}
                >
                    electorate
                </TextInput>
                {#if (!electorateIsValid)}
                    <InputErrorMessage>{electorateInputErrorMessage}</InputErrorMessage>
                {/if}
            </div>
            <div class="create_account_input">
                <TextInput 
                    isValid={partyIsValid}
                    placeholder="The Party"
                    inputID="party"
                    inputName="party"
                    bind:textInputValue={partyInputValue}
                    inputLabel={true}
                    textInputValueChanged={() => partyValueChangedHandler()}
                    textInputFocusChanged={() => partyFocusChangedHandler()}
                    textInputBlurChanged={() => partyBlurChangedHandler()}
                >
                    party
                </TextInput>
                {#if (!partyIsValid)}
                    <InputErrorMessage>{partyInputErrorMessage}</InputErrorMessage>
                {/if}
            </div>
            <div class="create_account_input">
                <TextInput 
                    isValid={partyIsValid}
                    placeholder="The Party"
                    inputID="party"
                    inputName="party"
                    bind:textInputValue={partyInputValue}
                    inputLabel={true}
                    textInputValueChanged={() => partyValueChangedHandler()}
                    textInputFocusChanged={() => partyFocusChangedHandler()}
                    textInputBlurChanged={() => partyBlurChangedHandler()}
                >
                    party
                </TextInput>
                {#if (!partyIsValid)}
                    <InputErrorMessage>{partyInputErrorMessage}</InputErrorMessage>
                {/if}
            </div>
            <div class="form_grid">
                <div class="form_grid_item">
                    <div class="create_account_input">
                        <TextInput 
                            isValid={campaignNameIsValid}
                            placeholder="candidate name for office name"
                            inputID="campaign_name"
                            inputName="campaign_name"
                            inputLabel={true}
                            bind:textInputValue={campaignNameInputValue}
                            textInputValueChanged={() => createAccountCampaignNameValueChangedHandler()}
                            textInputFocusChanged={() => createAccountCampaignNameFocusChangedHandler()}
                            textInputBlurChanged={() => createAccountCampaignNameBlurChangedHandler()}
                        >
                            campaign name
                        </TextInput>
                        {#if (!campaignNameIsValid)}
                            <InputErrorMessage>{campaignNameInputErrorMessage}</InputErrorMessage>
                        {/if}
                    </div>
                </div>
                <div class="form_grid_item"></div>
                <div class="form_grid_item">
                    <div class="create_account_input">
                        <EmailInput 
                            isValid={emailIsValid}
                            placeholder="myEmail@myCampaign.com"
                            inputID="campaign_email"
                            inputName="campaign_email"
                            inputLabel={true}
                            bind:emailInputValue={emailInputValue}
                            emailInputValueChanged={() => createAccountEmailValueChangedHandler()}
                            emailInputFocusChanged={() => createAccountEmailFocusChangedHandler()}
                            emailInputBlurChanged={() => createAccountEmailBlurChangedHandler()}
                        >
                            email
                        </EmailInput>
                        {#if (!emailIsValid)}
                            <InputErrorMessage>{emailInputErrorMessage}</InputErrorMessage>
                        {/if}
                    </div>
                </div>
                <div class="form_grid_item"></div>
                <div class="form_grid_item">
                    <div class="create_account_input">
                        <PasswordInput 
                            isValid={passwordIsValid}
                            placeholder="myPassword"
                            inputID="voter_password"
                            inputName="voter_password"
                            inputLabel={true}
                            bind:passwordInputValue={passwordInputValue}
                            passwordInputValueChanged={() => createAccountPasswordValueChangedHandler()}
                            passwordInputFocusChanged={() => createAccountPasswordFocusChangedHandler()}
                            passwordInputBlurChanged={() => createAccountPasswordBlurChangedHandler()}
                        >
                            password
                        </PasswordInput>
                        {#if (!passwordIsValid)}
                            <InputErrorMessage>{passwordInputErrorMessage}</InputErrorMessage>
                        {/if}
                    </div>
                    <div class="create_account_input">
                        <PasswordInput 
                            isValid={passwordReenteredIsValid}
                            placeholder="myPassword"
                            inputID="voter_password_reentered"
                            inputName="voter_password_reentered"
                            inputLabel={true}
                            bind:passwordInputValue={passwordReenteredInputValue}
                            passwordInputValueChanged={() => createAccountReenteredPasswordValueChangedHandler()}
                            passwordInputFocusChanged={() => createAccountReenteredPasswordFocusChangedHandler()}
                            passwordInputBlurChanged={() => createAccountReenteredPasswordBlurChangedHandler()}
                        >
                            re-enter password
                        </PasswordInput>
                        {#if (!passwordReenteredIsValid)}
                            <InputErrorMessage>{passwordReenteredInputErrorMessage}</InputErrorMessage>
                        {/if}
                    </div>
                </div>
                <div class="form_grid_item">
                    {#if (passwordReenteredIsValid)}
                        <PasswordsMatchMessage>passwords match!</PasswordsMatchMessage>
                    {:else if (!passwordReenteredIsValid && passwordReenteredIsValid !== null)}
                        <PasswordsMismatchMessage>passwords do not match!</PasswordsMismatchMessage>
                    {/if}
                </div>
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
                <a href="/reset-password">
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
        max-width: 40rem;
    }

    .form_grid {
        display: grid;
        grid-template-columns: 28rem 12rem;
        width: 100%;
    }

    .form_grid_item {
        display: flex;
        flex-direction: column;
        justify-content: center;
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

        .form_grid {
            display: grid;
            grid-template-columns: 22rem 9rem;
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

        .form_grid {
            display: grid;
            grid-template-columns: 100%;
        }

    }

</style>