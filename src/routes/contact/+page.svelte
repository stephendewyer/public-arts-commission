<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import MinneapolisSculptureGarden from '$lib/images/backgrounds/Minneapolis_Sculpture_Garden_July_2023.jpg';
    import Mailbox from '$lib/images/mailbox/mailbox.svg';
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import TextInput from '$lib/components/inputs/TextInput.svelte';
    import TextArea from '$lib/components/inputs/TextArea.svelte';
    import SubmitButtonSecondary from '$lib/components/buttons/SubmitButtonSecondary.svelte';

    import ErrorFlashMessage from '$lib/components/flashMessages/ErrorFlashMessage.svelte';
	import SuccessFlashMessage from '$lib/components/flashMessages/SuccessFlashMessage.svelte';
	import PendingFlashMessage from '$lib/components/flashMessages/PendingFlashMessage.svelte';

    let emailInputValue: string = "";
    let nameFirstInputValue: string = "";
    let nameLastInputValue: string = "";
    let subjectInputValue: string = "";
    let messageInputValue: string = "";

    let emailIsValid: boolean = true;
    let nameFirstIsValid: boolean = true;
    let nameLastIsValid: boolean = true;
    let subjectIsValid: boolean = true;
    let messageIsValid: boolean = true;

    let sendMessageButtonDisabled: boolean = false;

    // after submit
	let item: ResponseObj = {
        success: "",
        error: "",
        status: null
    };

    $: if((item.success) || (item.error)) {
        setTimeout(() => {
            item.success = "";
            item.error = "";
            status: null;
        }, 4000)
    };

    async function createMessage(
        email: string, 
        nameFirst: string, 
        nameLast: string, 
        subject: string, 
        message: string
    ) {		
        const response = await fetch("/api/sendMail", {

            method: 'POST',
            body: JSON.stringify({
                email,
                nameFirst,
                nameLast,
                subject,
                message
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        item = await response.json();
        // console.log(item);
        return item;
    };

    let pending: boolean = false;

    $: if((item.success) || (item.error)) {
        pending = false;
    }

    async function sendMessageHandler() {

        pending = true;

        try {

            await createMessage(
                emailInputValue,
                nameFirstInputValue,
                nameLastInputValue,
                subjectInputValue,
                messageInputValue
            );

            if (item.success) {

                emailInputValue = "",
                nameFirstInputValue = "",
                nameLastInputValue = "",
                subjectInputValue = "",
                messageInputValue = ""
            };

            if (item.error) {
                if (emailInputValue === "") {
                    emailIsValid = false;
                } else if (!emailInputValue.includes('@')) {
                    emailIsValid = false;
                } else if (emailInputValue !== "") {
                    emailIsValid = true;
                };

                if (nameFirstInputValue === "") {
                    nameFirstIsValid = false;
                } else if (nameFirstInputValue !== "") {
                    nameFirstIsValid = true;
                };

                if (nameLastInputValue === "") {
                    nameLastIsValid = false;
                } else if (nameLastInputValue !== "") {
                    nameLastIsValid = true;
                };

                if (subjectInputValue === "") {
                    subjectIsValid = false;
                } else if (subjectInputValue !== "") {
                    subjectIsValid = true;
                };

                if (messageInputValue === "") {
                    messageIsValid = false;
                } else if (messageInputValue !== "") {
                    messageIsValid = true;
                };
            };
        } catch (error) {
            console.log(error);
        };
    };

</script>
<svelte:head>
	<title>contact - public arts commission</title>
	<meta name="description" content="how to contact public arts commission" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<section>
    <div 
		class="contact_container"
		style="background-image: url({MinneapolisSculptureGarden});"
	>
		<div class="contact_section">
            <h1>send us a message</h1>
            <form on:submit|preventDefault={sendMessageHandler} class="contact_form">
                <div class="form_column">
                    <EmailInput 
                        isValid={emailIsValid}
                        placeholder="myEmail@myDomain.com"
                        inputID="voter_email"
                        inputName="voter_email"
                        bind:emailInputValue={emailInputValue}
                        inputLabel={true}
                        required={true}
                    >
                        email address
                    </EmailInput>
                </div>
                <div class="form_row">
                    <div class="form_column">
                        <TextInput 
                            isValid={nameFirstIsValid}
                            placeholder="Jane"
                            inputID="name_first"
                            inputName="name_first"
                            bind:textInputValue={nameFirstInputValue}
                            inputLabel={true}
                            required={true}
                            textInputErrorMessage="first name required"
                        >
                            first name
                        </TextInput>
                    </div>
                    <div class="form_column">
                        <TextInput 
                            isValid={nameLastIsValid}
                            placeholder="Eyre"
                            inputID="name_last"
                            inputName="name_last"
                            bind:textInputValue={nameLastInputValue}
                            inputLabel={true}
                            required={true}
                            textInputErrorMessage="first name required"
                        >
                            last name
                        </TextInput>
                    </div>
                </div>
                <div class="form_column">
                    <TextInput 
                        isValid={subjectIsValid}
                        placeholder="interest in running for public office"
                        inputID="subject"
                        inputName="subject"
                        bind:textInputValue={subjectInputValue}
                        inputLabel={true}
                        required={true}
                        textInputErrorMessage="message subject required"
                    >
                        subject
                    </TextInput>
                </div>
                <div class="form_column">
                    <TextArea
                        isValid={messageIsValid}
                        placeholder="hello!  I want to run for public office.  Can you help?"
                        inputID="message"
                        inputName="message"
                        inputLabel={true}
                        bind:textareaInputValue={messageInputValue}
                        required={true}
                        textAreaInputErrorMessage="message required"
                    >
                        message
                    </TextArea>
                </div>
                <div class="submit_button_container">
                    <SubmitButtonSecondary disable={sendMessageButtonDisabled}>
                        send
                    </SubmitButtonSecondary>
                </div>
            </form>
            {#if (pending)}
                <PendingFlashMessage >
                    please wait while we validate your data
                </PendingFlashMessage>
            {:else if (item.error)}
                <ErrorFlashMessage >
                    {item.error}
                </ErrorFlashMessage>
            {:else if (item.success)}
                <SuccessFlashMessage>
                    {item.success}
                </SuccessFlashMessage>
            {/if}
		</div>
        <div class="contact_section">
            <h1>headquarters mailing address</h1>
            <div class="headquarters_info">
                <p>
                    public arts commission<br />
                    5003 E. Julia Street<br />
                    Tucson, Arizona  85711<br />
                    United States
                </p>
                <div class="mailbox_container">
                    <img src={Mailbox} alt="mailbox" />
                </div>
            </div>
            
		</div>
	</div>
</section>

<style>
    
    .contact_container {
		width: 100%;
		background-size: cover;
		display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
		justify-content: center;
		align-items: center;
		background-repeat: no-repeat;
		background-position: center;
	}

	.contact_section {
		width: 100%;
        max-width: 40rem;
		display: flex;
		flex-direction: column;
		align-items: center;
        background-color: rgba(239,249,242,0.8);
	}

    .contact_form {
        padding: 0 1rem 0 1rem;
        width: 100%;
    }

    .form_row {
        display: flex;
        gap: 1rem;
        margin: 0;
    }

    .form_column {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 0 0 1rem 0;
    }

    .headquarters_info {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        gap: 2rem;
        width: 100%;
        padding: 0 1rem 2rem 1rem;
    }

    .mailbox_container {
        width: 100%;
        max-width: 6rem;
    }

    .submit_button_container {
        display: flex;
        justify-content: center;
    }

	@media (max-width: 720px) {
        .form_row {
            display: flex;
            flex-direction: column;
            gap: 0;
            margin: 0;
        }

	}

</style>