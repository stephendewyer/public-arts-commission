<script lang="ts">
    import ComparePasswords from '../inputs/createPasswordInputs/ComparePasswords.svelte';
    import PendingFlashMessage from '$lib/components/flashMessages/PendingFlashMessage.svelte';
    import SuccessFlashMessage from '$lib/components/flashMessages/SuccessFlashMessage.svelte';
    import ErrorFlashMessage from '$lib/components/flashMessages/ErrorFlashMessage.svelte';
    import SubmitButton from '../buttons/SubmitButton.svelte';
    import { goto } from '$app/navigation';

    export let paramsTokenID: string;

    let passwordInputValue: string = "";
    let passwordIsValid: boolean = true;

    let passwordReenteredInputValue: string = "";
    let passwordReenteredIsValid: boolean = true;

    let passwordsMatch: boolean | null = null;

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

    const updatePassword = async (
        password: string,
        passwordReentered: string,
        paramsTokenID: string
    ) => {
        const response = await fetch("/api/authentication/updatePassword/updatePasswordCampaign", {
            method: 'PATCH',
            body: JSON.stringify({
                password,
                passwordReentered,
                paramsTokenID
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        responseItem = await response.json();
        console.log(responseItem);
        return responseItem;
    };

    const updatePasswordSubmitHandler = async () => {
        pending = true;
        try {
            await updatePassword(
                passwordInputValue,
                passwordReenteredInputValue,
                paramsTokenID
            );
            if (responseItem.success) {
                passwordInputValue = "";
                passwordReenteredInputValue = "";
                goto("/login-campaign");
            };

            if (responseItem.error) {
                passwordIsValid = false;
                passwordReenteredIsValid = false;
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
    <h3 class="heading03">create a new password</h3>
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
    <form 
        on:submit|preventDefault={updatePasswordSubmitHandler}
        class="update_password_form"
    >
        <div class="update_password_input">
            <ComparePasswords 
                bind:passwordsMatch={passwordsMatch}
                bind:passwordInputValue={passwordInputValue}
                bind:passwordIsValid={passwordIsValid}
                bind:passwordReenteredInputValue={passwordReenteredInputValue}
                bind:passwordReenteredIsValid={passwordReenteredIsValid}
            >
                <p slot="password_label">new password*</p>
                <p slot="re-entered_password_label">re-enter new password*</p>
            </ComparePasswords>
        </div>
        
        <SubmitButton disable={false}>
            update password
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
</div>

<style>

    #campaign {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .heading03 {
        max-width: 28rem;
        text-align: center;
    }

    .update_password_form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 28rem;
        padding: 1rem 0 0 0;
    }

    .update_password_input {
        padding: 0.5rem 0;
        width: 100%;
    }

</style>