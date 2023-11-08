<script lang="ts">
    import { PUBLIC_STRIPEPUBLISHABLEKey } from '$env/static/public';
    import { onMount } from 'svelte';
    import { loadStripe } from '@stripe/stripe-js';
    import { Elements, PaymentElement } from 'svelte-stripe';

    // data from server
    export let data;

    // destructure the server data
    $: ({ clientSecret, returnUrl, customerId } = data);

    // const options = {
    //     // passing the client secret key
    //     clientSecret: clientSecret,

    //     // fully customizable with appearance API
    //     appearance: {/*...*/},
    // };

    // Stripe instance
    let stripe: any = null;

    // Stripe Elements instance
    let elements: any;

    // when components mounts
    onMount(async () => {

        // load the Stripe client

        stripe = await loadStripe(PUBLIC_STRIPEPUBLISHABLEKey);
        
    })

    // handle form submission
    const submitPayment = async () => {

        // ask Stripe to confirm the payment
        
        const { error } = await stripe.confirmPayment({

            // pass instance that was used to create the Payment Element

            elements,

            // specify where to send the user when payment succeeds

            confirmParams: {

                return_url: returnUrl
            }

        });

        if (error) {

            // handle error

            console.log(error);
        }
    };

</script>



<div class="payment_container">
    <h1>payment</h1>
    <div class="payment_form_container">
        {#if stripe && clientSecret}

            <form on:submit|preventDefault={submitPayment}> 

                <!-- container for Stripe components -->

                <Elements 
                    {stripe} 
                    {clientSecret}
                    bind:elements
                >
                    <PaymentElement  />
                    
                </Elements>
                <button>pay</button>
            </form>

        {:else}

            Loading stripe...

        {/if}
    </div>
    
</div>

<style>
    .payment_container {
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .payment_form_container {
        width: 100%;
    }
</style>
