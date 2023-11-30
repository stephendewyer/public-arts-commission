<script lang="ts">
    import ComparePasswords from '../inputs/ComparePasswords.svelte';
    import PendingFlashMessage from '$lib/components/flashMessages/PendingFlashMessage.svelte';
    import SuccessFlashMessage from '$lib/components/flashMessages/SuccessFlashMessage.svelte';
    import ErrorFlashMessage from '$lib/components/flashMessages/ErrorFlashMessage.svelte';
    import SubmitButton from '../buttons/SubmitButton.svelte';
    import { goto } from '$app/navigation';

    let passwordInputValue: string = "";
    let passwordIsValid: boolean = true;

    let passwordReenteredInputValue: string = "";
    let passwordReenteredIsValid: boolean = true;

    let passwordsMatch: boolean | null = null;

    let buttonDisabled: boolean = true;

    $: if (
        passwordInputValue !== "" &&
        passwordIsValid === true &&
        passwordReenteredInputValue !== "" &&
        passwordReenteredIsValid === true &&
        passwordsMatch === true
    ) {
        buttonDisabled = false;
    } else {
        buttonDisabled = true;
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

    const updatePassword = async (
        password: string,
        passwordReentered: string
    ) => {
        const response = await fetch("/api/authentication/updatePassword/updatePasswordAdmin", {
            method: 'POST',
            body: JSON.stringify({
                password,
                passwordReentered
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
                passwordReenteredInputValue
            );
            if (responseItem.success) {
                passwordInputValue = "";
                passwordReenteredInputValue = "";
                goto("/login-administrator");
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
<div id="administrator">
    <h3 class="heading03">create a new password</h3>
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
        
        <SubmitButton disable={buttonDisabled}>
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
    #administrator {
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