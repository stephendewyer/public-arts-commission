import { stripe } from '$lib/server/stripe/stripe';
import { redirect } from '@sveltejs/kit';
import { mysqlConnection } from "$lib/server/db/mysql";

export async function load({ url }) {

    // pull payment intent id from the URL query string

    const id = url.searchParams.get('payment_intent');

    // ask Stripe for latest info about this paymentIntent

    let paymentIntent;

    if (id != null) {

        paymentIntent = await stripe.paymentIntents.retrieve(id);

    };

    // inspect the PaymentIntent `status` to indicate the status of the payment to your customer.

    // some payment methods will [immediately succeed or fail][0] upon confirmation, while others will first enter a `processing` state.

    // [0] https://stripe.com/docs/payments/payment-methods#payment-notification

    let message;

    switch (paymentIntent?.status) {

        case 'succeeded':

            message = 'Payment successfully received!'

            // todo: provision account here

            break;

        case 'processing':

            message = "Payment processing.  We'll update you when payment is received."
        
            break;

        case 'requires_payment_method':

            // redirect the user back to payment page to re-attempt payment

            throw redirect(303, '/donate/payment');

        default:

            message = "Something went wrong!"

            break;
    };

    let res = await mysqlConnection();

    const customerQuery = `SELECT * FROM users_in_checkout WHERE stripe_id = "${paymentIntent?.customer}";`

    const [rows, fields] = await res.query(customerQuery);

    // convert the rows into valid json to avoid OKPacket type

    const rowsJson = JSON.parse(JSON.stringify(rows));

    const nameFirst = rowsJson[0].NameFirst;

    const nameLast = rowsJson[0].NameLast;

    const customerEmail = rowsJson[0].Email;

    return { paymentIntent, message, nameFirst, nameLast, customerEmail };
    
}