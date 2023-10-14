<script lang="ts">
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import TextInput from '$lib/components/inputs/TextInput.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';

    let emailInputValue: string;
    let textInputValue: string;

    export let campaignLoginClicked: string | undefined = "";

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
            >
                email
            </EmailInput>
        </div>
        <div class="login_input">
            <TextInput 
                placeholder="campaignPassword"
                inputID="campaign_password"
                inputName="campaign_password"
                bind:textInputValue={textInputValue}
                inputLabel={true}
            >
                password
            </TextInput>
        </div>
        <SubmitButton on:click={() => campaignLoginHandler()}>
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