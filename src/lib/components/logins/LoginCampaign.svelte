<script lang="ts">
    import Input from '$lib/components/inputs/input.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';

    const campaignLoginHandler = () => {
		console.log('voter login submitted!')
	}

</script>

<div id="campaign">
    <h4>
        apply for an endorsement
    </h4>
    <form on:submit|preventDefault={campaignLoginHandler}> 
        <div class="login_input">
            <Input 
                placeholder="campaignEmail@campaignDomain.com"
                inputID="campaign_email"
                inputName="campaign_email"
                inputType="email"
            >email</Input>
        </div>
        <div class="login_input">
            <Input 
                placeholder="campaignPassword"
                inputID="campaign_password"
                inputName="campaign_password"
                inputType="text"
            >password</Input>
        </div>
        <SubmitButton>
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
    .login_input {
		padding: 0.5rem 0;
	}
</style>