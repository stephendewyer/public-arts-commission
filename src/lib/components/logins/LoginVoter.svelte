<script lang="ts">
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import PasswordInput from '$lib/components/inputs/PasswordInput.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';
    import InputErrorMessage from '$lib/components/errorMessages/InputErrorMessage.svelte';

    export let voterLoginClicked: string | undefined = "";

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

    const loginEmailValueChangedHandler = () => {
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

    const loginEmailFocusChangedHandler = () => {
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

    const loginEmailBlurChangedHandler = () => {

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

    const loginPasswordValueChangedHandler = () => {
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

    const loginPasswordFocusChangedHandler = () => {
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

    const loginPasswordBlurChangedHandler = () => {

        passwordInputTouched = true;

        if (passwordInputValue === "") {
            passwordIsValid = false;
            passwordInputErrorMessage = "a valid password required"
        } else if (passwordInputValue !== "") {
            passwordIsValid = true;
        }

    }

    const voterLoginHandler = () => {
        voterLoginClicked = "voter login clicked!";
	}

</script>

<div id="voter">
    <h3>
        organize with your community
    </h3>
    <form 
        on:submit|preventDefault={voterLoginHandler}
        class="login_form"
    > 
        <div class="login_input">
            <EmailInput 
                isValid={emailIsValid}
                placeholder="myEmail@myDomain.com"
                inputID="voter_email"
                inputName="voter_email"
                inputLabel={true}
                bind:emailInputValue={emailInputValue}
                emailInputValueChanged={() => loginEmailValueChangedHandler()}
                emailInputFocusChanged={() => loginEmailFocusChangedHandler()}
                emailInputBlurChanged={() => loginEmailBlurChangedHandler()}
            >
                email
            </EmailInput>
            {#if (!emailIsValid)}
                <InputErrorMessage>{emailInputErrorMessage}</InputErrorMessage>
            {/if}
        </div>
        <div class="login_input">
            <PasswordInput 
                isValid={passwordIsValid}
                placeholder="myPassword"
                inputID="voter_password"
                inputName="voter_password"
                inputLabel={true}
                bind:passwordInputValue={passwordInputValue}
                passwordInputValueChanged={() => loginPasswordValueChangedHandler()}
                passwordInputFocusChanged={() => loginPasswordFocusChangedHandler()}
                passwordInputBlurChanged={() => loginPasswordBlurChangedHandler()}
            >
                password
            </PasswordInput>
            {#if (!passwordIsValid)}
                <InputErrorMessage>{passwordInputErrorMessage}</InputErrorMessage>
            {/if}
        </div>
        <SubmitButton 
            on:click={() => voterLoginHandler()}
            disable={loginVoterButtonDisabled}
        >
            log in
        </SubmitButton>
        
    </form>
    <div class="login_helpers_container">
        <div class="login_helpers_column">
            <h4 class="login_helper_prompt">
                don't have an account?
            </h4>
            <a href="/create-account-voter">
                <ActionButtonSecondary>
                    create a free account
                </ActionButtonSecondary>
            </a>
        </div>
        <div class="login_helpers_column">
            <h4 class="login_helper_prompt">
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

<style>

    #voter {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .login_form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 28rem;
        padding: 1rem 0 0 0;
    }

    .login_input {
		padding: 0.5rem 0;
        width: 100%;
	}

    .login_helpers_container {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        width: 100%;
        padding: 2rem 0 0 0;
        gap: 0.25rem;
    }

    .login_helpers_column {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .login_helper_prompt {
        text-align: center;
        width: 100%;
        padding: 0 0.5rem;
    }

    @media (max-width: 1140px) {

        .login_helpers_container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        .login_helpers_column {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
        }
    }

</style>