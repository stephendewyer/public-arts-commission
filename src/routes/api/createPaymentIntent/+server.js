import { stripe } from '$lib/server/stripe/stripe';

// handle POST /createPaymentIntent
export async function POST() {
    // create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 2000,
        currency: 'usd',
        // specify what payment methods are allowed
        // can be card, sepa_debit, ideal, etc...
        payment_method_types: ['card']
    });

    // return the clientSecret to the client
    return new Response(JSON.stringify({clientSecret: paymentIntent.client_secret}));
};