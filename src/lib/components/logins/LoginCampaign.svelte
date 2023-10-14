<script lang="ts">
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import PasswordInput from '$lib/components/inputs/PasswordInput.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';

    export let campaignLoginClicked: string | undefined = "";

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

    const campaignLoginHandler = () => {
        campaignLoginClicked = "campaign login clicked!";
	}

</script>

<div id="campaign">
    <h4>
        apply for an endorsement
    </h4>
    <form 
        on:submit|preventDefault={campaignLoginHandler} 
        class="login_form"
    > 
        <div class="login_input">
            <EmailInput 
                placeholder="campaignEmail@campaignDomain.com"
                inputID="campaign_email"
                inputName="campaign_email"
                bind:emailInputValue={emailInputValue}
                inputLabel={true}
                emailInputValueChanged={() => loginEmailValueChangedHandler()}
                emailInputFocusChanged={() => loginEmailFocusChangedHandler()}
                emailInputBlurChanged={() => loginEmailBlurChangedHandler()}
            >
                email
            </EmailInput>
            {#if (!emailIsValid)}
                <div>{emailInputErrorMessage}</div>
            {/if}
        </div>
        <div class="login_input">
            <PasswordInput 
                placeholder="campaignPassword"
                inputID="campaign_password"
                inputName="campaign_password"
                bind:textInputValue={passwordInputValue}
                inputLabel={true}
                textInputValueChanged={() => loginPasswordValueChangedHandler()}
                textInputFocusChanged={() => loginPasswordFocusChangedHandler()}
                textInputBlurChanged={() => loginPasswordBlurChangedHandler()}
            >
                password
            </PasswordInput>
            {#if (!passwordIsValid)}
                <div>{passwordInputErrorMessage}</div>
            {/if}
        </div>
        <SubmitButton 
            bind:disable={loginVoterButtonDisabled}
            on:click={() => campaignLoginHandler()}
        >
            log in
        </SubmitButton>
        <h4>
            don't have an account?
        </h4>
        <ActionButtonSecondary>
            create a free account
        </ActionButtonSecondary>
    </form>
</div>

<style>

    #campaign {
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
    }

    .login_input {
		padding: 0.5rem 0;
        width: 100%;
	}

</style>