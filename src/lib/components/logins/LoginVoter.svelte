<script lang="ts">
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import PasswordInput from '$lib/components/inputs/PasswordInput.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';
    import { goto } from '$app/navigation';
    import PendingFlashMessage from '../flashMessages/PendingFlashMessage.svelte';
    import SuccessFlashMessage from '../flashMessages/SuccessFlashMessage.svelte';
    import ErrorFlashMessage from '../flashMessages/ErrorFlashMessage.svelte';
    import { fade } from 'svelte/transition';
    
    let passwordInputValue: string = "";
    let emailInputValue: string = "";

    let passwordIsValid: boolean = true;
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

    const loginVoter = async (
        email: string,
        password: string
    ) => {
        const response = await fetch("/api/authentication/loginVoter", {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        responseItem = await response.json();
        return responseItem;
    };
        
    const loginVoterHandler = async () => {
        pending = true;
        try {
            await loginVoter(emailInputValue, passwordInputValue);
            if (responseItem.success) {
                goto("/authenticated-voter/voter");
            } else if (responseItem.error) {
                if ((emailInputValue === "") || (!emailInputValue.includes('@'))) {
                    emailIsValid = false;
                };
                if (passwordInputValue === "") {
                    passwordIsValid = false;
                };
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

<div 
    in:fade={{ delay: 250, duration: 300 }}
    id="voter"
>
    <h4 style="text-align: center; line-height: 1.4;">network, organize, nominate and connect</h4>
    <form 
        on:submit|preventDefault={loginVoterHandler}
        class="login_form"
    > 
        <div class="login_input">
            <EmailInput 
                isValid={emailIsValid}
                placeholder="myEmail@myDomain.com"
                inputID="voter_email"
                inputName="voter_email"
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
                placeholder="myPassword"
                inputID="voter_password"
                inputName="voter_password"
                inputLabel={true}
                bind:value={passwordInputValue}
                required={true}
                passwordInputErrorMessage="password required"
            >
                password
            </PasswordInput>
        </div>
        <SubmitButton 
            disable={false}
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
            
            <a href="/reset-password/voter">
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
        padding: 1rem 0;
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