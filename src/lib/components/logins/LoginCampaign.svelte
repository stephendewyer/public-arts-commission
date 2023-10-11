<script lang="ts">
    import Input from '$lib/components/inputs/input.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';

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
            <Input 
                placeholder="campaignEmail@campaignDomain.com"
                inputID="campaign_email"
                inputName="campaign_email"
                inputType="email"
            >
                email
            </Input>
        </div>
        <div class="login_input">
            <Input 
                placeholder="campaignPassword"
                inputID="campaign_password"
                inputName="campaign_password"
                inputType="text"
            >
                password
            </Input>
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