<script lang="ts">
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import PasswordInput from '$lib/components/inputs/PasswordInput.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';
    import { goto } from '$app/navigation';
    import PendingFlashMessage from '../flashMessages/PendingFlashMessage.svelte';
    import SuccessFlashMessage from '../flashMessages/SuccessFlashMessage.svelte';
    import ErrorFlashMessage from '../flashMessages/ErrorFlashMessage.svelte';
    import { signIn } from "@auth/sveltekit/client";

    let passwordInputValue: string = "";
    let emailInputValue: string = "";

    let passwordIsValid: boolean = true;
    let emailIsValid: boolean = true;

    let loginVoterButtonDisabled: boolean = true;

    $: if (
        emailIsValid &&
        passwordIsValid &&
        (passwordInputValue !== "") &&
        (emailInputValue !== "")
    ) {
        loginVoterButtonDisabled = false;
    } else {
        loginVoterButtonDisabled = true;
    };

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

    const campaignLoginHandler = async () => {

        pending = true;

        try {

            const response = await signIn('credentials', {
                providerId: "campaign-login",
                email: emailInputValue,
                password: passwordInputValue,
                redirect: false
            });

            if (!response?.ok) {

                responseItem.error = "Incorrect email and/or password.";
                throw new Error("Incorrect email and/or password.");

            };

            if (response?.ok) {

                responseItem.success = "Valid email and password.";
                passwordInputValue = "";
                emailInputValue = "";
                goto(`/authenticated-campaign/campaign`);

            };

        } catch (error) {

            console.log(error);

        };
    };

    let pending: boolean = false;

    $: if((responseItem.error) || (!responseItem.error)) {

        pending = false;

    };

</script>

<div id="campaign">
    <h3>
        apply for an endorsement
    </h3>
    <form 
        on:submit|preventDefault={campaignLoginHandler} 
        class="login_form"
    > 
        <div class="login_input">
            <EmailInput 
                    isValid={emailIsValid}
                    placeholder="campaignEmail@campaignDomain.com"
                    inputID="campaign_email"
                    inputName="campaign_email"
                    bind:emailInputValue={emailInputValue}
                    inputLabel={true}
                    required={true}
                >
                    email
            </EmailInput>
        </div>
        <div class="login_input">
            <PasswordInput 
                isValid={passwordIsValid}
                placeholder="campaignPassword"
                inputID="campaign_password"
                inputName="campaign_password"
                inputLabel={true}
                bind:passwordInputValue={passwordInputValue}
                required={true}
                passwordInputErrorMessage="password required"
            >
                password
            </PasswordInput>
        </div>
        <SubmitButton 
            disable={loginVoterButtonDisabled}
        >
            log in
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
    <div class="login_helpers_container">
        <div class="login_helpers_column">
            <h4 class="login_helper_prompt">
                don't have an account?
            </h4>
            <a href="/create-account-campaign">
                <ActionButtonSecondary>
                    create a free account
                </ActionButtonSecondary>
            </a>
        </div>
        <div class="login_helpers_column">
            <h4 class="login_helper_prompt">
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
        padding: 1rem 0;
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