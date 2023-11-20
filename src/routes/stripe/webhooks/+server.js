import { stripe } from '$lib/server/stripe/stripe';
import { error } from '@sveltejs/kit';
import SECRET_STRIPE_WEBHOOK_KEY from '$env/static/private';

// endpoint to handle incoming webhooks

export async function POST({ request }) {

    // extract the body

    const body = await request.text();

    // get the signature from the header

    const signature = request.headers.get('stripe-signature');

    // var to hold event data

    console.log(signature);

    let event;

    // verify the signature matches the body

    try {

        // @ts-ignore
        event = stripe.webhooks.constructEvent(body, signature, SECRET_STRIPE_WEBHOOK_KEY)

    
    } catch (err) {

        // warn when signature is invalid
        // @ts-ignore
        console.warn('⚠️ webhook signature verification failed!', err.message)

        // return, because signature is invalid

        throw error(400, 'invalid request!');

    };

    // signature has been verified, so we can process events
    // review important events for Billing webhooks at https://stripe.com/docs/billing/webhooks

    switch (event.type) {

        case 'customer.subscription.created':

            // subscription was created
            // note: status will be 'incomplete'

            break;

        case 'customer.subscription.updated':

            // subscription has been changed

            break;

        case 'invoice.paid':

            // used to provision services after the trial has ended.
            // the status of the invoice will show up as paid.
            // store status in your database to reference when a user accesses your service to avoid hitting rate limits.

            break;

        case 'invoice.payment_failed':

            // if the payment fails or the customer does not have a valid payment method,
            // an invoice.payment_failed event is sent, the subscription becomes past due.
            // use this webhook to notify your user that their payment has failed and to retrieve new card details

            break;

        case 'customer.subscription.deleted':

            if (event.request !== null) {

                // handle a subscription canced by your request from above

            } else {

                // handle subscription canceled automatically based up your subscription settings

            }

            break;

        default:

        // unexpected event type
        
    }

    // return a 200 with an empty JSON response

    return new Response(JSON.stringify({success: "payment processed"}), {status: 200});;

}