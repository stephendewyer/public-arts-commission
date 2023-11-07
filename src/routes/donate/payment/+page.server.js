import { stripe } from '$lib/server/stripe/stripe';
import { mysqlConnection } from "$lib/server/db/mysql";
import { DOMAIN } from '$env/static/private';

export const load = async ({ url }) => {
    console.log(url);

    // const paramsSearch = url.search.slice(1).split("&");

    const paramsSearch = url.searchParams;

    let donationOccurence;
    let donationAmount;
    let nameFirst;
    let nameLast;
    let email;

    for (const [key, value] of paramsSearch) {
        if (key === "donation_occurence") {
            donationOccurence = value;
        } else if (key === "donation_amount") {
            donationAmount = parseInt(value);
        } else if (key === "checkout_user_nameFirst") {
            nameFirst = value;
        } else if (key === "checkout_user_nameLast") {
            nameLast = value;
        } else if (key === "email") {
            email = value;
        }
    };

    let chargeAmount = 0;

    if (donationAmount) {

        chargeAmount = donationAmount * 100;

    };

    console.log(chargeAmount);

    let res = await mysqlConnection();

    const customerIdQuery = `SELECT stripe_id FROM users_in_checkout WHERE Email = '${email}';`;

    const [rows, fields] = await res.query(customerIdQuery);

    // convert the rows into valid json to avoid OKPacket type

    const rowsJson = JSON.parse(JSON.stringify(rows));

    const rowsLength = rowsJson.length -1;

    const customerId = rowsJson[rowsLength].stripe_id;

    console.log(customerId);

    // create the subscription
    // status is `incomplete` until payment succeeds

    // if 

    const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
            {
                price_data: {
                    currency: 'usd',
                    product: 'prod_OxttdibezV52Y0',
                    unit_amount: chargeAmount,
                    recurring: {
                        interval: "month"
                    }
                },
                quantity: 1,
            }
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: {
            save_default_payment_method: 'on_subscription'
        },
        // expand: ['latest_invoice.payment.intent']
    });


    console.log(subscription);

    return {

        // @ts-ignore
        // clientSecret: subscription.latest_invoice?.payment_intent.client_secret,
        // returnUrl: new URL('/payment/complete', DOMAIN).toString();
    }

}
