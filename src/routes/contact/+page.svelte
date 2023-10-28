<script lang="ts">
    import MinneapolisSculptureGarden from '$lib/images/backgrounds/Minneapolis_Sculpture_Garden_July_2023.jpg';
    import Mailbox from '$lib/images/mailbox/mailbox.svg';
    import EmailInput from '$lib/components/inputs/EmailInput.svelte';
    import TextInput from '$lib/components/inputs/TextInput.svelte';
    import TextArea from '$lib/components/inputs/TextArea.svelte';
    import SubmitButtonSecondary from '$lib/components/buttons/SubmitButtonSecondary.svelte';
    import InputErrorMessage from '$lib/components/errorMessages/InputErrorMessage.svelte';

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


    let emailInputTouched: boolean = false;
    let nameFirstInputTouched: boolean = false;
    let nameLastInputTouched: boolean = false;
    let subjectInputTouched: boolean = false;
    let messageInputTouched: boolean = false;

    let emailInputErrorMessage: string = "";
    let nameFirstInputErrorMessage: string = "";
    let nameLastInputErrorMessage: string = "";
    let subjectInputErrorMessage: string = "";
    let messageInputErrorMessage: string = "";

    let sendMessageButtonDisabled: boolean = true;

    $: if (
        emailIsValid &&
        nameFirstIsValid &&
        nameLastIsValid &&
        subjectIsValid &&
        messageIsValid &&
        (emailInputValue !== "") &&
        (nameFirstInputValue !== "") &&
        (nameLastInputValue !== "") &&
        (subjectInputValue !== "") &&
        (messageInputValue !== "") 
    ) {
        sendMessageButtonDisabled = false;
    } else {
        sendMessageButtonDisabled = true;
    };

    // begin input value change handlers

    const emailValueChangedHandler = () => {
        if (emailInputTouched) {
            if (emailInputValue === "") {
                emailIsValid = false;
                emailInputErrorMessage = "a valid email required";
            } else if (!emailInputValue.includes('@')) {
                emailIsValid = false;
                emailInputErrorMessage = "email must have an @ symbol";
            } else if (emailInputValue !== "") {
                emailIsValid = true;
            }
        } else if (!emailInputTouched) {
            emailIsValid = true;
        }
    }

    const nameFirstValueChangedHandler = () => {
        if (nameFirstInputTouched) {
            if (nameFirstInputValue === "") {
                nameFirstIsValid = false;
                nameFirstInputErrorMessage = "a first name required";
            } else if (nameFirstInputValue !== "") {
                nameFirstIsValid = true;
            }
        } else if (!nameFirstInputTouched) {
            nameFirstIsValid = true;
        }

    }

    const nameLastValueChangedHandler = () => {
        if (nameFirstInputTouched) {
            if (nameLastInputValue === "") {
                nameLastIsValid = false;
                nameLastInputErrorMessage = "a last name required";
            } else if (nameLastInputValue !== "") {
                nameLastIsValid = true;
            }
        } else if (!nameFirstInputTouched) {
            nameFirstIsValid = true;
        }
    }

    const subjectValueChangedHandler = () => {
        if (subjectInputTouched) {
            if (subjectInputValue === "") {
                subjectIsValid = false;
                subjectInputErrorMessage = "a subject is required";
            } else if (subjectInputValue !== "") {
                subjectIsValid = true;
            }
        } else if (!subjectInputTouched) {
            subjectIsValid = true;
        }
    }

    const messageValueChangedHandler = () => {
        if (messageInputTouched) {
            if (messageInputValue === "") {
                messageIsValid = false;
                messageInputErrorMessage = "a message required"
            } else if (messageInputValue !== "") {
                messageIsValid = true;
            }
        } else if (!messageInputTouched) {
            messageIsValid = true;
        }
    }

    // begin input focus change handlers

    const emailFocusChangedHandler = () => {
        if (emailInputTouched) {
            if (emailInputValue === "") {
                emailIsValid = false;
                emailInputErrorMessage = "a valid email required";
            } else if (!emailInputValue.includes('@')) {
                emailIsValid = false;
                emailInputErrorMessage = "email must have an @ symbol";
            } else if (emailInputValue !== "") {
                emailIsValid = true;
            }
        } else if (!emailInputTouched) {
            emailIsValid = true;
        }
    }

    const nameFirstFocusChangedHandler = () => {
        if (nameFirstInputTouched) {
            if (nameFirstInputValue === "") {
                nameFirstIsValid = false;
                nameFirstInputErrorMessage = "a first name required";
            }
        } else if (!nameFirstInputTouched) {
            nameFirstIsValid = true;
        }
    }

    const nameLastFocusChangedHandler = () => {
        if (nameLastInputTouched) {
            if (nameLastInputValue === "") {
                nameLastIsValid = false;
                nameLastInputErrorMessage = "a last name required";
            }
        } else if (!nameLastInputTouched) {
            nameLastIsValid = true;
        }
    }

    const subjectFocusChangedHandler = () => {
        if (subjectInputTouched) {
            if (subjectInputValue === "") {
                subjectIsValid = false;
                subjectInputErrorMessage = "a subject required";
            }
        } else if (!subjectInputTouched) {
            subjectIsValid = true;
        }
    }

    const messageFocusChangedHandler = () => {
        if (messageInputTouched) {
            if (messageInputValue === "") {
                messageIsValid = false;
                messageInputErrorMessage = "a message required";
            }
        } else if (!messageInputTouched) {
            messageIsValid = true;
        }
    }

    // begin input blur change handlers

    const emailBlurChangedHandler = () => {
        emailInputTouched = true;

        if (emailInputValue === "") {
            emailIsValid = false;
            emailInputErrorMessage = "a valid email required";
        } else if (!emailInputValue.includes('@')) {
            emailIsValid = false;
            emailInputErrorMessage = "email must have an @ symbol";
        } else if (emailInputValue !== "") {
            emailIsValid = true;
        }
    }

    const nameFirstBlurChangedHandler = () => {
        nameFirstInputTouched = true;

        if (nameFirstInputValue === "") {
            nameFirstIsValid = false;
            nameFirstInputErrorMessage = "a first name required";
        } else if (nameFirstInputValue !== "") {
            nameFirstIsValid = true;
        }
    }

    const nameLastBlurChangedHandler = () => {
        nameLastInputTouched = true;

        if (nameLastInputValue === "") {
            nameLastIsValid = false;
            nameLastInputErrorMessage = "a last name required";
        } else if (nameLastInputValue !== "") {
            nameLastIsValid = true;
        }
    }

    const subjectBlurChangedHandler = () => {
        subjectInputTouched = true;

        if (subjectInputValue === "") {
            subjectIsValid = false;
            subjectInputErrorMessage = "a subject is required";
        } else if (subjectInputValue !== "") {
            subjectIsValid = true;
        }
    }

    const messageBlurChangedHandler = () => {
        messageInputTouched = true;

        if (messageInputValue === "") {
            messageIsValid = false;
            messageInputErrorMessage = "a message is required";
        } else if (messageInputValue !== "") {
            messageIsValid = true;
        }
    };

    interface responseObj {
        success: string;
        error: string;
        status: number | null
    }

    // after submit

	let item: responseObj = {
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
    }

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
        console.log(item);
        return item;
    }

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
        }
    } catch (error) {
        console.log("catch");
    }
}

</script>

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
                        inputLabel={true}
                        bind:emailInputValue={emailInputValue}
                        emailInputValueChanged={() => emailValueChangedHandler()}
                        emailInputFocusChanged={() => emailFocusChangedHandler()}
                        emailInputBlurChanged={() => emailBlurChangedHandler()}
                    >
                        email address
                    </EmailInput>
                    {#if (!emailIsValid)}
                        <InputErrorMessage>{emailInputErrorMessage}</InputErrorMessage>
                    {/if}
                </div>
                <div class="form_row">
                    <div class="form_column">
                        <TextInput
                            isValid={nameFirstIsValid}
                            placeholder="Jane"
                            inputID="name_first"
                            inputName="name_first"
                            inputLabel={true}
                            bind:textInputValue={nameFirstInputValue}
                            textInputValueChanged={() => nameFirstValueChangedHandler()}
                            textInputFocusChanged={() => nameFirstFocusChangedHandler()}
                            textInputBlurChanged={() => nameFirstBlurChangedHandler()}
                        >
                            first name
                        </TextInput>
                        {#if (!nameFirstIsValid)}
                            <InputErrorMessage>{nameFirstInputErrorMessage}</InputErrorMessage>
                        {/if}
                    </div>
                    <div class="form_column">
                        <TextInput
                            isValid={nameLastIsValid}
                            placeholder="Eyre"
                            inputID="name_last"
                            inputName="name_last"
                            inputLabel={true}
                            bind:textInputValue={nameLastInputValue}
                            textInputValueChanged={() => nameLastValueChangedHandler()}
                            textInputFocusChanged={() => nameLastFocusChangedHandler()}
                            textInputBlurChanged={() => nameLastBlurChangedHandler()}
                        >
                            last name
                        </TextInput>
                        {#if (!nameLastIsValid)}
                            <InputErrorMessage>{nameLastInputErrorMessage}</InputErrorMessage>
                        {/if}
                    </div>
                </div>
                <div class="form_column">
                    <TextInput
                        isValid={subjectIsValid}
                        placeholder="interest in running for public office"
                        inputID="subject"
                        inputName="subject"
                        inputLabel={true}
                        bind:textInputValue={subjectInputValue}
                        textInputValueChanged={() => subjectValueChangedHandler()}
                        textInputFocusChanged={() => subjectFocusChangedHandler()}
                        textInputBlurChanged={() => subjectBlurChangedHandler()}
                    >
                        subject
                    </TextInput>
                    {#if (!subjectIsValid)}
                        <InputErrorMessage>{subjectInputErrorMessage}</InputErrorMessage>
                    {/if}
                </div>
                <div class="form_column">
                    <TextArea
                        isValid={messageIsValid}
                        placeholder="hello!  I want to run for public office.  Can you help?"
                        inputID="message"
                        inputName="message"
                        inputLabel={true}
                        bind:textareaInputValue={messageInputValue}
                        textareaInputValueChanged={() => messageValueChangedHandler()}
                        textareaInputFocusChanged={() => messageFocusChangedHandler()}
                        textareaInputBlurChanged={() => messageBlurChangedHandler()}
                    >
                        message
                    </TextArea>
                    {#if (!messageIsValid)}
                        <InputErrorMessage>{messageInputErrorMessage}</InputErrorMessage>
                    {/if}
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
                    3136 Hennepin Avenue, #4<br />
                    Minneapolis, Minnesota  55408<br />
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
        padding: 0 1rem 2rem 1rem;
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