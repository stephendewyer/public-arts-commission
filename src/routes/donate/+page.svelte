<script lang="ts">
    import DonateAmountButton from "$lib/components/buttons/DonateAmountButton.svelte";
    import { goto } from '$app/navigation';
    import { loadStripe } from '@stripe/stripe-js';
    import { Elements, CardNumber, CardExpiry, CardCvc } from 'svelte-stripe';
    import { onMount } from 'svelte';
    import { PUBLIC_STRIPEPUBLISHABLEKey } from "$env/static/public";
    import SubmitButtonSecondary from "$lib/components/buttons/SubmitButtonSecondary.svelte";
    import DonateAnyAmountButton from "$lib/components/buttons/DonateAnyAmountButton.svelte";
    import PaymentOccurence from "$lib/components/payments/PaymentOccurence.svelte";

    let processing: boolean = false;
    let stripe: any = null;
    let error: any = null;
    let cardElement: any;
    let name: string = "";

    let donateAmountButtonClicked: boolean = false;
    let clickedIndex: number = 0;

    $: console.log(clickedIndex);
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

    onMount(async () => {
        stripe = await loadStripe(PUBLIC_STRIPEPUBLISHABLEKey);
    });

    async function createPaymentIntent() {
        const response = await fetch('/api/createPaymentIntent', { 
            method: 'POST' 
        });
        const { clientSecret } = await response.json();

        return clientSecret
    }

    async function submit() {

        // avoid processing duplicates
        if (processing) {
            return
        }

        processing = true

        // create the payment intent server-side
        const clientSecret = await createPaymentIntent()

        // confirm payment with stripe
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name
                }
            }
        })

        // log results, for debugging
        console.log({ result })

        if (result.error) {
        // payment failed, notify user
        error = result.error
        processing = false
        } else {
        // payment succeeded, redirect to "thank you" page
        goto('/examples/credit-card/thanks')
        }
    }

</script>

<section>
    <div class="donate_section">
        <h1>
            help amplify the voice of the art community in politics to strengthen democracy by donating to public arts commission
        </h1>
        <h2>
            how often would like you like to donate?
        </h2>
        <PaymentOccurence />
        <h2>
            how much would you like to donate?
        </h2>
        
        <div class="donation_amounts">
            {#each contributionAmounts as contributionAmount, i}
                <DonateAmountButton
                    bind:clicked={donateAmountButtonClicked}
                    bind:activatedIndex={clickedIndex}
                    index={i}
                >
                    {contributionAmount.amount}
                </DonateAmountButton>
            {/each}
            <DonateAnyAmountButton bind:activatedIndex={clickedIndex}/>
        </div>
        <h3>
            your contribution will benefit public arts commission and help us expand the political imagination
        </h3>
        {#if error}
            <p class="error">{error.message} Please try again.</p>
        {/if}
        {#if stripe}
            <Elements {stripe}>
                <form on:submit|preventDefault={submit}>
                    <input 
                        name="name" 
                        bind:value={name}
                        placeholder="your name"
                        disabled={processing}
                    />
                    <CardNumber 
                        bind:element={cardElement} 
                        classes={{base: 'base_input', invalid: 'invalid_input'}}
                    />
                    <div class="row">
                        <CardExpiry 
                            classes={{base: 'base_input', invalid: 'invalid_input'}} 
                        />
                        <CardCvc classes={{base: 'base_input', invalid: 'invalid_input'}} />
                    </div>
                    
                    <div class="submit_payment_button">
                        <SubmitButtonSecondary 
                            disable={processing}
                        >
                            {#if processing}
                                processing...
                            {:else}
                                pay 
                            {/if}
                        </SubmitButtonSecondary>
                    </div>
                    
                </form>
            </Elements>
        {:else}
            loading...
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

    .submit_payment_button {
        width: auto;
        margin: 0 auto;
    }

    .row {
        display: flex;
        flex-direction: row;
        gap: 5px;
    }

    input,
    :global(.base_input) {
        background-color: #EFF9F2;
        border-radius: 3rem;
        color: #484B47;
        padding: 0.5rem 1rem;
        border-width: 2px;
        border-color: #EFF9F2;
        border-style: solid;
        transition: border-color 0.2s linear;
        outline: none;
        width: 100%;
    }


    :global(.invalid_input) {
        background-color: #EFF9F2;
        border-radius: 3rem;
        color: #484B47;
        padding: 0.5rem 1rem;
        border-width: 2px;
        border-color: #9F1D20;
        border-style: solid;
        transition: border-color 0.2s linear;
        outline: none;
        width: 100%;
    }

    input:hover,
    :global(.base_input:hover) {
        border-color: #CB6D44;
        transition: border-color 0.2s linear;
    }

    input:focus,
    :global(.base_input:focus) {
        border-color: #1C2226;
        transition: border-color 0.2s linear;
    }

    ::placeholder {
        color: #484B47;
        opacity: 50%; /* Firefox */
    }

    .donation_amounts {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

</style>