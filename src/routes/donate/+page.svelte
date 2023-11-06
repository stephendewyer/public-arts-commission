<script lang="ts">
    import DonateAmountButton from "$lib/components/buttons/DonateAmountButton.svelte";
    import ActionButton from "$lib/components/buttons/ActionButton.svelte";
    import TextInput from "$lib/components/inputs/TextInput.svelte";
    import EmailInput from "$lib/components/inputs/EmailInput.svelte";
    import InputErrorMessage from "$lib/components/errorMessages/InputErrorMessage.svelte";
    import DonateAnyAmountButton from "$lib/components/buttons/DonateAnyAmountButton.svelte";
    import PaymentOccurence from "$lib/components/payments/PaymentOccurence.svelte";
    import ErrorFlashMessage from '$lib/components/flashMessages/ErrorFlashMessage.svelte';
	import SuccessFlashMessage from '$lib/components/flashMessages/SuccessFlashMessage.svelte';
	import PendingFlashMessage from '$lib/components/flashMessages/PendingFlashMessage.svelte';
    import { goto } from '$app/navigation';

    // set the variables for donate any amount button

    let donationAmountInputValue: number | undefined;
    let donationAmountIndexValue: number;
    let donateAnyAmountValue: number | undefined;

    let donationAmountIsValid: boolean = true;

    $: if (donateAnyAmountValue !== undefined) { donationAmountIsValid = true}

    // set the varibable for donation occurence value

    let donationOccurenceInputValue: string;

    let nameFirstInputValue: string = "";
    let nameLastInputValue: string = "";
    let emailInputValue: string = "";

    let nameFirstIsValid: boolean = true;
    let nameLastIsValid: boolean = true;
    let emailIsValid: boolean = true;

    let nameFirstInputTouched: boolean = false;
    let nameLastInputTouched: boolean = false;
    let emailInputTouched: boolean = false;

    // let loginVoterButtonDisabled: boolean = true;

    let nameFirstInputErrorMessage: string = "";
    let nameLastInputErrorMessage: string = "";
    let emailInputErrorMessage: string = "";

    let disableButton: boolean = false;

    interface contributionAmount {
        id: number;
        amount: number;
    }

    const contributionAmounts: contributionAmount[] = [
        {
            id: 1,
            amount: 5
        },
        {
            id: 2,
            amount: 10
        },
        {
            id: 3,
            amount: 25
        },
        {
            id: 4,
            amount: 50
        },
        {
            id: 5,
            amount: 100
        },
        {
            id: 6,
            amount: 250
        },
    ];

    // convert the active donation amount index to donation amount value

    $: if (donationAmountIndexValue < 7  && donationAmountIndexValue > 0) {
        donationAmountInputValue = contributionAmounts[donationAmountIndexValue -1].amount;
    } else {
        donationAmountInputValue = donateAnyAmountValue;
    };

    // $: if (
    //     emailIsValid &&
    //     passwordIsValid &&
    //     (passwordInputValue !== "") &&
    //     (emailInputValue !== "")
    // ) {
    //     loginVoterButtonDisabled = false;
    // } else {
    //     loginVoterButtonDisabled = true;
    // }

    // begin client-side form error handling

    const nameFirstValueChangeHandler = () => {
        if (nameFirstInputTouched) {
            if (nameFirstInputValue === "") {
                nameFirstIsValid = false;
                nameFirstInputErrorMessage = "first name required";
            } else if (nameFirstInputValue !== "") {
                nameFirstIsValid = true;
            }
        } else if (!nameFirstInputTouched) {
            nameFirstIsValid = true;
        }
    }

    const nameLastValueChangeHandler = () => {
        console.log(nameLastInputValue)
        if (nameLastInputTouched) {
            if (nameLastInputValue === "") {
                nameLastIsValid = false;
                nameLastInputErrorMessage = "last name required";
            } else if (nameLastInputValue !== "") {
                nameLastIsValid = true;
            }
        } else if (!nameFirstInputTouched) {
            nameLastIsValid = true;
        }
    }

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

    const nameFirstFocusChangedHandler = () => {
        if (nameFirstInputTouched) {
            if (nameFirstInputValue === "") {
                nameFirstIsValid = false;
                nameFirstInputErrorMessage = "first name required";
            } else if (nameFirstInputValue !== "") {
                nameFirstIsValid = true;
            }
        } else if (!nameFirstInputTouched) {
            nameFirstIsValid = true;
        }
        
    }
    const nameLastFocusChangedHandler = () => {
        if (nameLastInputTouched) {
            if (nameLastInputValue === "") {
                nameLastIsValid = false;
                nameLastInputErrorMessage = "last name required";
            } else if (nameLastInputValue !== "") {
                nameLastIsValid = true;
            }
        } else if (!nameLastInputTouched) {
            nameLastIsValid = true;
        }
        
    }

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

    const nameFirstBlurChangedHandler = () => {

        nameFirstInputTouched = true;

        if (nameFirstInputValue === "") {
            nameFirstIsValid = false;
            nameFirstInputErrorMessage = "first name required";
        } else if (nameFirstInputValue !== "") {
            nameFirstIsValid = true;
        }
    }

    const nameLastBlurChangedHandler = () => {

        nameLastInputTouched = true;

        if (nameLastInputValue === "") {
            nameLastIsValid = false;
            nameLastInputErrorMessage = "last name required";
        } else if (nameLastInputValue !== "") {
            nameLastIsValid = true;
        }
    }

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

    // after submit

    interface responseObj {
        success: string;
        error: string;
        status: number | null
    };

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
    };

    async function createPaymentIntent (
        donationOccurenceInputValue: string, 
        donationAmountInputValue: number | undefined, 
        nameFirstInputValue: string, 
        nameLastInputValue: string, 
        emailInputValue: string
    ) {		
        const response = await fetch("/api/createPaymentIntent", {

            method: 'POST',
            body: JSON.stringify({
                donationOccurenceInputValue,
                donationAmountInputValue,
                nameFirstInputValue,
                nameLastInputValue,
                emailInputValue
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        item = await response.json();
        console.log(item);
        return item;
    };

    let pending: boolean = false;

    $: if((item.success) || (item.error)) {
        pending = false;
    }

    async function submitPaymentIntentHandler() {

        pending = true;

        try {

            await createPaymentIntent(
                donationOccurenceInputValue,
                donationAmountInputValue,
                nameFirstInputValue,
                nameLastInputValue,
                emailInputValue
            );

            pending = false;

            if (!donationAmountInputValue) {
                donationAmountIsValid = false;
            }

            if (!nameFirstInputValue) {
                nameFirstInputErrorMessage = "first name required"
                nameFirstIsValid = false;
                nameFirstInputTouched = true;
            }

            if (!nameLastInputValue) {
                nameLastInputErrorMessage = "last name required"
                nameLastIsValid = false;
                nameLastInputTouched = true;
            }

            if (!emailInputValue) {
                emailInputErrorMessage = "email required"
                emailIsValid = false;
                emailInputTouched = true;
            }

        } catch (error) {
            console.log(error);
        }

        if (item.success) {
            goto(`/donate/payment?donation_occurence=${donationOccurenceInputValue}?donation_amount=${donationAmountInputValue}?checkout_user_nameFirst=${nameFirstInputValue}?checkout_user_nameLast=${nameLastInputValue}?email=${emailInputValue}`);
        }

    };

    // async function submit() {

    //     // avoid processing duplicates
    //     if (processing) {
    //         return
    //     }

    //     processing = true

    //     // create the payment intent server-side
    //     const clientSecret = await createPaymentIntent()

    //     // confirm payment with stripe
    //     const result = await stripe.confirmCardPayment(clientSecret, {
    //         payment_method: {
    //             card: cardElement,
    //             billing_details: {
    //                 name
    //             }
    //         }
    //     })

    //     // log results, for debugging
    //     console.log({ result })

    //     if (result.error) {
    //     // payment failed, notify user
    //     error = result.error
    //     processing = false
    //     } else {
    //     // payment succeeded, redirect to "thank you" page
    //     goto('/examples/credit-card/thanks')
    //     }
    // }

</script>

<section>
    <div class="donate_section">
        <h1>
            help amplify the voice of the art community in politics to strengthen democracy by donating to public arts commission
        </h1>
        <h2>
            how often would like you like to donate?
        </h2>
        <PaymentOccurence bind:activatedOccurence={donationOccurenceInputValue}/>
        <h2>
            how much would you like to donate at a time?
        </h2>
        
        <div class="donation_amounts">
            {#each contributionAmounts as contributionAmount, i}
                <DonateAmountButton
                    bind:activatedIndex={donationAmountIndexValue}
                    index={i}
                >
                    {contributionAmount.amount}
                </DonateAmountButton>
            {/each}
            <DonateAnyAmountButton 
                bind:activatedIndex={donationAmountIndexValue}
                bind:anyAmountValue={donateAnyAmountValue}
            />
        </div>
        {#if (!donationAmountIsValid)}
            <InputErrorMessage>donation amount is required</InputErrorMessage>
        {/if}
        <h3>
            your contribution will benefit public arts commission and help us expand the political imagination
        </h3>
        <h2>
            checkout
        </h2>
        <form method="POST" on:submit|preventDefault={submitPaymentIntentHandler}>
            <label 
                for="donation_occurence" 
                class="hidden_label"
            />
            <input 
                value={donationOccurenceInputValue} 
                id="donation_occurence" 
                name="donation_occurence"
                class="hidden_input"
            />
            <label 
                for="donation_amount" 
                class="hidden_label"
            />
            <input 
                value={donationAmountInputValue}
                id="donation_amount"
                name="donation_amount"
                class="hidden_input"
            />
            <TextInput 
                isValid={nameFirstIsValid}
                placeholder="Marco"
                inputID="checkout_user_nameFirst"
                inputName="checkout_user_nameFirst"
                bind:textInputValue={nameFirstInputValue}
                inputLabel={true}
                textInputValueChanged={() => nameFirstValueChangeHandler()}
                textInputFocusChanged={() => nameFirstFocusChangedHandler()}
                textInputBlurChanged={() => nameFirstBlurChangedHandler()}
            >
                first name
            </TextInput>
            {#if (!nameFirstIsValid)}
                <InputErrorMessage>{nameFirstInputErrorMessage}</InputErrorMessage>
            {/if}
            <TextInput 
                isValid={nameLastIsValid}
                placeholder="Polo"
                inputID="checkout_user_nameLast"
                inputName="checkout_user_nameLast"
                bind:textInputValue={nameLastInputValue}
                inputLabel={true}
                textInputValueChanged={() => nameLastValueChangeHandler()}
                textInputFocusChanged={() => nameLastFocusChangedHandler()}
                textInputBlurChanged={() => nameLastBlurChangedHandler()}
            >
                last name
            </TextInput>
            {#if (!nameLastIsValid)}
                <InputErrorMessage>{nameLastInputErrorMessage}</InputErrorMessage>
            {/if}
            <EmailInput
                isValid={emailIsValid}
                placeholder="myEmail@myDomain.com"
                inputID="checkout_user_nameFirst"
                inputName="email"
                bind:emailInputValue={emailInputValue}
                inputLabel={true}
                emailInputValueChanged={() => emailValueChangedHandler()}
                emailInputFocusChanged={() => emailFocusChangedHandler()}
                emailInputBlurChanged={() => emailBlurChangedHandler()}
            >
                email
            </EmailInput>
            {#if (!emailIsValid)}
                <InputErrorMessage>{emailInputErrorMessage}</InputErrorMessage>
            {/if}
            
            <ActionButton bind:disable={disableButton} >
                continue
            </ActionButton>
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
    
</section>

<style>

    .donate_section {
        width: 100%;
        max-width: 40rem;
        padding: 0 1rem;
        margin: 0 auto;
        justify-content: center;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .hidden_label {
        display: none;
    }

    .hidden_input {
        display: none;
    }

    .donation_amounts {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

</style>