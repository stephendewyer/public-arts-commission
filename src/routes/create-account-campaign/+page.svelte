<script lang="ts">
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import PasswordInput from '$lib/components/inputs/PasswordInput.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';
    import InputErrorMessage from '$lib/components/errorMessages/InputErrorMessage.svelte';
	import createAccountBackground from '$lib/images/backgrounds/11_December_2012_take_Lansing,_Michigan.jpg';

    let passwordInputValue: string = "";
    let emailInputValue: string = "";

    let passwordIsValid: boolean = true;
    let emailIsValid: boolean = true;

    let emailInputTouched: boolean = false;
    let passwordInputTouched: boolean = false;

    let loginVoterButtonDisabled: boolean = true;

    let emailInputErrorMessage: string = "";
    let passwordInputErrorMessage: string = "";

    $: if (
        emailIsValid &&
        passwordIsValid &&
        (passwordInputValue !== "") &&
        (emailInputValue !== "")
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
            <SubmitButton 
                disable={loginVoterButtonDisabled}
            >
                log in
            </SubmitButton>
        </form>
        <div class="create_account_helpers_container">
            <div class="create_account_helpers_column">
                <h4 class="create_account_helper_prompt">
                    don't have an account?
                </h4>
                <a href="/create-account-voter">
                    <ActionButtonSecondary>
                        create a free account
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
		max-width: 40rem;
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
        padding: 1rem 0 0 0;
    }

    .create_account_input {
		padding: 0.5rem 0;
        width: 100%;
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

</style>