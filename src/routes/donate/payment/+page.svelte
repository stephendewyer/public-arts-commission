<script lang="ts">
    import { PUBLIC_STRIPEPUBLISHABLEKey } from '$env/static/public';
    import { onMount } from 'svelte';
    import { loadStripe } from '@stripe/stripe-js';
    import { Elements, PaymentElement } from 'svelte-stripe';
    import SubmitButtonSecondary from "$lib/components/buttons/SubmitButtonSecondary.svelte";
    import CancelButton from '$lib/components/buttons/CancelButton.svelte';
    // data from server
    export let data;

    // destructure the server data
    $: ({ 
        clientSecret, 
        returnUrl,
        donationOccurence, 
        donationAmount, 
        nameFirst,
        nameLast,
        email,
        timeStamp
    } = data);

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
        
        const result = await stripe.confirmPayment({

            // pass instance that was used to create the Payment Element

            elements,

            // specify where to send the user when payment succeeds

            confirmParams: {

                return_url: returnUrl
            },

        });

        if (result.error) {

            // handle error

            console.log(result.error);
        }
    };

</script>

<div class="payment_container">
    <h1>review payment intent</h1>
    <table>
        <tr>
            <td><h3>donation occurence:</h3></td>
            <td><h3>{donationOccurence?.replace(/_/g, ' ')}</h3></td>
        </tr>
        <tr>
            <td><h3>donation amount at a time:</h3></td>
            <td><h3>${donationAmount}</h3></td>
        </tr>
        <tr>
            <td><h3>name:</h3></td>
            <td><h3>{nameFirst} {nameLast}</h3></td>
        </tr>
        <tr>
            <td><h3>email:</h3></td>
            <td><h3>{email}</h3></td>
        </tr>
        <tr>
            <td><h3>date created:</h3></td>
            <td><h3>{timeStamp}</h3></td>
        </tr>
    </table>
    <h4>
        Donations to public arts commission are not tax deductible because public arts commission is a 501(c)(4) non-profit organization.
    </h4>
    <div class="payment_form_container">
        {#if stripe && clientSecret}

            <form on:submit|preventDefault={submitPayment}> 

                <!-- container for Stripe components -->

                <Elements 
                    {stripe} 
                    {clientSecret}
                    bind:elements
                >
                    <PaymentElement />
                    
                </Elements>
                <div class="submit_button_container">
                    <SubmitButtonSecondary
                        disable={false}
                    >
                        pay
                    </SubmitButtonSecondary>
                </div>
                
            </form>
            <div class="cancel_button_container">
                <a href="/donate" >
                    <CancelButton>cancel payment</CancelButton>
                </a>
            </div>
            
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

    table {
        border-spacing: 0;
        margin: 0 0 2rem 0;
        width: 100%;
        table-layout: fixed;
    }
    
    td {
        padding: 0.5rem 1rem 0.5rem 1rem;
        overflow-wrap: break-word;
        hyphens: auto;
    }

    td > h3 {
        margin: 0;
        overflow-wrap: break-word;
        hyphens: auto;
    }

    td:nth-child(odd) {
        width: 25%;
    }

    tr:nth-child(even) {
        background-color: #FBF4F9;
    }

    .payment_form_container {
        width: 100%;
    }

    .submit_button_container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .cancel_button_container {
        padding: 2rem 0 0 0;
    }
    
    @media (max-width: 1440px) {

        table {
            margin: 0 0 1.5rem 0;
        }

        td {
            padding: 0.5rem 1rem 0.5rem 1rem;
        }

        td > h3 {
            font-size: 1rem;
        }

    }

    @media (max-width: 720px) {

        table {
            margin: 0 0 1rem 0;
        }

        td {
            padding: 0.25rem 0.5rem 0.25rem 0.5rem;
        }
        
        td > h3 {
            font-size: 0.8rem;
        }
    }

</style>
