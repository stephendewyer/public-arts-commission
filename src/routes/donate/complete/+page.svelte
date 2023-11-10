<script lang="ts">
    import ActionButton from '$lib/components/buttons/ActionButton.svelte';

    export let data;
    
    const {paymentIntent, message, nameFirst, nameLast, customerEmail} = data;

    const customerId = paymentIntent?.customer?.toString();

    let donationAmount: number | undefined;

    if (paymentIntent?.amount) {

        donationAmount = paymentIntent.amount * 0.01;

    }

    let paymentIntentCreated: number;

    let timeStamp: Date;

    if (paymentIntent?.created) {
        // get the timeStamp in seconds for when invoice intent created
        paymentIntentCreated = paymentIntent?.created;

        // get convert the timestamp to milliseconds and then convert to human readable date
        timeStamp = new Date(paymentIntentCreated * 1000);

    };

</script>

<div class="thank_you_container">
    <h1>thank you, {nameFirst} {nameLast} for your donation!</h1>

    <p class="paragraph">Your confirmation code is: <span class="bold_text">{customerId?.slice(4, -1)}</span>.</p>
    <p class="paragraph">Your donation of <span class="bold_text">${donationAmount}</span> on <span class="bold_text">{timeStamp}</span> has been received.</p>
    <p class="paragraph">{message}</p>

    <div class="action_button_container">
        <a href="/">
            <ActionButton>return to index</ActionButton>
        </a>
    </div>
</div>

<style>

    .thank_you_container {
        width: 100%;
        max-width: 40rem;
        padding: 0 1rem;
        margin: 0 auto;
    }

    .bold_text {
        font-weight: 600;
    }

    .paragraph {
        margin: 0 0 1rem 0;
    }

    .action_button_container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

</style>

