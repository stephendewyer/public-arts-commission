<script lang="ts">
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import PasswordInput from '$lib/components/inputs/PasswordInput.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';
    import { goto } from '$app/navigation';
    import PendingFlashMessage from '../flashMessages/PendingFlashMessage.svelte';
    import SuccessFlashMessage from '../flashMessages/SuccessFlashMessage.svelte';
    import ErrorFlashMessage from '../flashMessages/ErrorFlashMessage.svelte';

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

    const loginAdministrator = async (
        email: string,
        password: string
    ) => {
        const response = await fetch("/api/authentication/loginAdministrator", {
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
        
    const loginAdministratorHandler = async () => {
        pending = true;
        try {
            await loginAdministrator(emailInputValue, passwordInputValue);
            if (responseItem.success) {
                goto("/authenticated-administrator/administrator");
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

<div id="administrator">
    <h1>
        administrator login
    </h1>
    <form 
        on:submit|preventDefault={loginAdministratorHandler} 
        class="login_form"
    > 
        <div class="login_input">
            <EmailInput 
                isValid={emailIsValid}
                placeholder="adminEmail@publicartscommission.org"
                inputID="admin_email"
                inputName="admin_email"
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
                placeholder="adminPassword"
                inputID="admin_password"
                inputName="admin_password"
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
        <h4>
            forgot your password?
        </h4>
        <a href="/reset-password/admin">
            <ActionButtonSecondary>
                reset password
            </ActionButtonSecondary>
        </a>
    </div>
</div>

<style>

    #administrator {
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
        width: 100%;
        padding: 1rem 0;
        flex-direction: column;
        align-items: center;
    }

</style>