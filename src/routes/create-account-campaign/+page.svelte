<script lang="ts">
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import PasswordInput from '$lib/components/inputs/PasswordInput.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';
    import InputErrorMessage from '$lib/components/errorMessages/InputErrorMessage.svelte';
	import createAccountBackground from '$lib/images/backgrounds/11_December_2012_take_Lansing,_Michigan.jpg';
    import CorrectIcon from '$lib/components/flashIcons/CorrectIcon.svelte';
    import ErrorIcon from '$lib/components/flashIcons/ErrorIcon.svelte';

    let emailInputValue: string = "";
    let passwordInputValue: string = "";
    let passwordReenteredInputValue: string = "";

    let emailIsValid: boolean = true;
    let passwordIsValid: boolean = true;
    let passwordReenteredIsValid: boolean | null = null;

    let emailInputTouched: boolean = false;
    let passwordInputTouched: boolean = false;
    let passwordReenteredInputTouched: boolean = false;

    let loginVoterButtonDisabled: boolean = true;

    let emailInputErrorMessage: string = "";
    let passwordInputErrorMessage: string = "";
    let passwordReenteredInputErrorMessage: string = "";

    $: if (
        emailIsValid &&
        passwordIsValid &&
        passwordReenteredIsValid &&
        (emailInputValue !== "") &&
        (passwordInputValue !== "") &&
        (passwordReenteredInputValue !== "")
    ) {
        loginVoterButtonDisabled = false;
    } else {
        loginVoterButtonDisabled = true;
    }

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
        }
    }

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
            }
        } else if (!emailInputTouched) {
            emailIsValid = true;
        }
    }

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
        }
    }

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
            } 
        } else if (!passwordInputTouched) {
            passwordIsValid = true;
        }
    }

    const createAccountPasswordFocusChangedHandler = () => {
        if (passwordInputTouched) {
            if (passwordInputValue === "") {
                passwordIsValid = false;
                passwordInputErrorMessage = "a valid password required"
            } else if (passwordInputValue !== "") {
                passwordIsValid = true;
            }
        } else if (!passwordInputTouched) {
            passwordIsValid = true;
        }
    }

    const createAccountPasswordBlurChangedHandler = () => {

        passwordInputTouched = true;

        if (passwordInputValue === "") {
            passwordIsValid = false;
            passwordInputErrorMessage = "a valid password required"
        } else if (passwordInputValue !== "") {
            passwordIsValid = true;
        }

    }

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
            } 
        } else if (!passwordReenteredInputTouched) {
            if (passwordReenteredInputValue !== "" && passwordReenteredInputValue === passwordInputValue) {
                passwordReenteredIsValid = true;
            } else {
                passwordReenteredIsValid = null;
            }
        }
    }

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
            } 
        } else if (!passwordInputTouched) {
            passwordReenteredIsValid = null;
        } else {
            passwordReenteredIsValid = null;
        }
    }

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
        } else {
            passwordReenteredIsValid = null;
        }

    }

    const createAccountHandler = () => {

    }

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
            <div class="form_grid">
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
                        <div class="passwords_match_validation">
                            <CorrectIcon /><p style="color: #545D50">passwords match</p>
                        </div>
                    {:else if (!passwordReenteredIsValid && passwordReenteredIsValid !== null)}
                        <div class="passwords_match_validation">
                            <ErrorIcon /><p style="color: #9F1D20">passwords do not match</p>
                        </div>
                    {/if}
                </div>
            </div>
            <SubmitButton 
                disable={loginVoterButtonDisabled}
            >
                log in
            </SubmitButton>
        </form>
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
        display: flex;
        flex-direction: column;
        justify-content: center;
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
        padding: 2rem 0 0 0;
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

    .passwords_match_validation {
        padding: 0 1rem;
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

        .passwords_match_validation {
            padding: 0 1rem;
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

        .passwords_match_validation {
            padding: 0 1rem;
        }
    }

</style>