import { stripe } from '$lib/server/stripe/stripe';
import { mysqlConnection } from "$lib/server/db/mysql";

export const POST = async ({request}) => {

    if (request.method !== 'POST') {

      return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});

    }
  
    const data = await request.json();
  
    const donationOccurence = data.donationOccurenceInputValue;
    const donationAmount = data.donationAmountInputValue;
    const nameFirst = data.nameFirstInputValue;
    const nameLast = data.nameLastInputValue;
    const email = data.emailInputValue;
  
    if (
        !donationOccurence ||
        !nameFirst ||
        !nameLast ||
        !email
    ) {
      return new Response(JSON.stringify({error: "missing form data"}), {status: 422});
    }

    if (donationAmount <= 0 || !donationAmount) {
        return new Response(JSON.stringify({error: "a donation amount greater than 0 required"}), {status: 422});
    };

    const customer = await stripe.customers.create({

        email: email,

        name: `${nameFirst} ${nameLast}`

    });

    let res = await mysqlConnection();

    const insertQuery = `INSERT INTO users_in_checkout (NameFirst, NameLast, Email, stripe_id) VALUES ("${nameFirst}", "${nameLast}", "${email}", "${customer.id}")`;

    let success = false;

    try {

        // add the user data to users_in_checkout database table

        res.query(insertQuery);

        // redirect to collect payment

        success = true;

        // return {success: "data entered into user checkout registration database"};

    } catch (error) {

        success = false;

    }

    if (success) {

        return new Response(JSON.stringify({success: "donation intent created"}), {status: 200});

    } else {

        return new Response(JSON.stringify({error: "failed to enter user checkout registration data into database"}), {status: 422});

    }
}