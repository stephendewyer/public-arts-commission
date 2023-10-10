<script lang="ts">
    import Input from '$lib/components/inputs/input.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';

    const voterLoginHandler = () => {
		console.log('voter login submitted!')
	}

</script>

<div id="voter">
    <h4>
        organize with your community
    </h4>
    <form on:submit|preventDefault={voterLoginHandler}> 
        <div class="login_input">
                <Input 
                    placeholder="myEmail@myDomain.com"
                    inputID="voter_email"
                    inputName="voter_email"
                    inputType="email"
                >email</Input>
            </div>
            <div class="login_input">
                <Input 
                    placeholder="myPassword"
                    inputID="voter_password"
                    inputName="voter_password"
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