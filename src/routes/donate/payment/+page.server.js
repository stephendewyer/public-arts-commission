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
    
    /**
     * @type {string | any[]}
     */
    let rowsJson = [];

    await res.query(customerIdQuery)
    .then(([ rows ]) => {

        rowsJson = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    const rowsLength = rowsJson.length -1;

    const customerId = rowsJson[rowsLength].stripe_id;

    // create the subscription
    // status is `incomplete` until payment succeeds

    // create the subscription instance

    let subscription;

    // create the sessions instance

    let paymentIntent;

    // create the client secret key

    let clientSecretKey;

    // const productKey = "prod_OywpYrMrJQw6L1"; // productKey for test mode

    const productKey = "prod_OxttdibezV52Y0"; // productKey for live mode

    if (donationOccurence === "monthly_contribution") {
        subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [
                {
                    price_data: {
                        currency: 'usd',
                        product: productKey,
                        unit_amount: chargeAmount,
                        recurring: {
                            interval: 'month'
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

    } else if (donationOccurence === "yearly_contribution") {
        subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [
                {
                    price_data: {
                        currency: 'usd',
                        product: productKey,
                        unit_amount: chargeAmount,
                        recurring: {
                            interval: 'year'
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
    } else if (donationOccurence === "one-time_donation") {
        paymentIntent = await stripe.paymentIntents.create({
            customer: customerId,
            amount: chargeAmount,
            currency: 'usd',
            receipt_email: email,
            automatic_payment_methods: {
                enabled: true
            }
        });
    };

    const invoice = subscription?.latest_invoice;

    let createdTimeStamp;
    
    if (donationOccurence === "yearly_contribution" || donationOccurence === "monthly_contribution") {

        // @ts-ignore
        clientSecretKey = invoice?.payment_intent.client_secret;

        // @ts-ignore
        // get the timeStamp in seconds for when invoice intent created
        const invoiceCreated = invoice?.payment_intent.created;
        
        const timeStamp = new Date(invoiceCreated * 1000);

        createdTimeStamp = timeStamp;

    } else if (donationOccurence === "one-time_donation") {

        clientSecretKey = paymentIntent?.client_secret;

        // get the timeStamp in seconds for when invoice intent created
        const paymentIntentCreated = paymentIntent?.created;

        // @ts-ignore

        // get convert the timestamp to milliseconds and then convert to human readable date
        const timeStamp = new Date(paymentIntentCreated * 1000);

        createdTimeStamp = timeStamp;

    };

    return {

        clientSecret: clientSecretKey,
        timeStamp: createdTimeStamp,
        returnUrl: new URL('/donate/complete', DOMAIN).toString(),
        customerId: customerId,
        nameFirst: nameFirst,
        nameLast: nameLast,
        email: email,
        donationAmount: donationAmount,
        donationOccurence: donationOccurence,

    }

}
