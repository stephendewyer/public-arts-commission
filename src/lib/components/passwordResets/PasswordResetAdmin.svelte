<script lang="ts">
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import PendingFlashMessage from '$lib/components/flashMessages/PendingFlashMessage.svelte';
    import SuccessFlashMessage from '$lib/components/flashMessages/SuccessFlashMessage.svelte';
    import ErrorFlashMessage from '$lib/components/flashMessages/ErrorFlashMessage.svelte';
    import SubmitButtonSecondary from '../buttons/SubmitButtonSecondary.svelte';

    let emailInputValue: string = "";
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

    const resetPassword = async (
        email: string
    ) => {
        const response = await fetch("/api/authentication/resetPassword/resetPasswordAdmin", {
            method: 'POST',
            body: JSON.stringify({
                email
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        responseItem = await response.json();
        return responseItem;
    };

    const resetPasswordSubmitHandler = async () => {
        pending = true;
        try {
            await resetPassword(
                emailInputValue
            );
            if (responseItem.success) {
                emailInputValue = "";
                // goto("/login-campaign");
            };

            if (responseItem.error) {
                if ((emailInputValue === "") || !emailInputValue.includes('@')) {
                    emailIsValid = false;
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
    <h1>reset password</h1>
    <h2>administrator</h2>
    <h3 class="heading03">if you have an account, we&#39;ll send you an email with a link to reset your password</h3>
    <form 
        on:submit|preventDefault={resetPasswordSubmitHandler}
        class="reset_password_form"
    >
        <div class="reset_password_input">
            <EmailInput 
                inputID="admin_email"
                inputName="admin_email"
                bind:isValid={emailIsValid}
                bind:emailInputValue={emailInputValue}
                required={true}
                inputLabel={true}
                placeholder="adminEmail@publicartscommission.org"
            >
                email address
            </EmailInput>
        </div>
        
        <SubmitButtonSecondary disable={false}>
            send email
        </SubmitButtonSecondary>
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

    .reset_password_form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 28rem;
        padding: 1rem 0 0 0;
    }

    .reset_password_input {
		padding: 0.5rem 0;
        width: 100%;
	}

</style>