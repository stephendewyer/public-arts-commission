<script lang="ts">
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import TextInput from '$lib/components/inputs/TextInput.svelte';
    import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
    import ActionButtonSecondary from '$lib/components/buttons/ActionButtonSecondary.svelte';

    export let voterLoginClicked: string | undefined = "";

    let textInputValue: string;
    let emailInputValue: string;

    const voterLoginHandler = () => {
		
        voterLoginClicked = "voter login clicked!";
	}

</script>

<div id="voter">
    <h4>
        organize with your community
    </h4>
    <form 
        on:submit|preventDefault={voterLoginHandler}
        class="login_form"
    > 
        <div class="login_input">
            <EmailInput 
                placeholder="myEmail@myDomain.com"
                inputID="voter_email"
                inputName="voter_email"
                inputLabel={true}
                bind:emailInputValue={emailInputValue}
            >
                email
            </EmailInput>
        </div>
        <div class="login_input">
            <TextInput 
                placeholder="myPassword"
                inputID="voter_password"
                inputName="voter_password"
                inputLabel={true}
                bind:textInputValue={textInputValue}
            >
                password
            </TextInput>
        </div>
        <SubmitButton on:click={() => voterLoginHandler()}>
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
    }

    .login_input {
		padding: 0.5rem 0;
        width: 100%;
	}

</style>