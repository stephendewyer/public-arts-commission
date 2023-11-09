import { stripe } from '$lib/server/stripe/stripe';
import { mysqlConnection } from "$lib/server/db/mysql";
import { DOMAIN } from '$env/static/private';

export const load = async ({ url }) => {

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

    let res = await mysqlConnection();

    const customerIdQuery = `SELECT stripe_id FROM users_in_checkout WHERE Email = '${email}';`;

    const [rows, fields] = await res.query(customerIdQuery);

    // convert the rows into valid json to avoid OKPacket type

    const rowsJson = JSON.parse(JSON.stringify(rows));

    const rowsLength = rowsJson.length -1;

    const customerId = rowsJson[rowsLength].stripe_id;

    // console.log(customerId);

    // create the subscription
    // status is `incomplete` until payment succeeds

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
        // expand gets the object from which string originates
        expand: ['latest_invoice.payment_intent']
    });

    const invoice = subscription.latest_invoice;

    let clientSecretKey = "";

    if (invoice) {

        // @ts-ignore
        clientSecretKey = invoice.payment_intent.client_secret;

    }

    return {

        clientSecret: clientSecretKey,
        returnUrl: new URL('/donate/payment/complete', DOMAIN).toString(),
        customerId: customerId,
        nameFirst: nameFirst,
        nameLast: nameLast,
        email: email,
        donationAmount: donationAmount,
        donationOccurence: donationOccurence,
        
    }

}
