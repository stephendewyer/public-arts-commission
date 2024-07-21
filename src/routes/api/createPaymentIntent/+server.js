import { stripe } from '$lib/server/stripe/stripe';
import { mysqlConnection } from "$lib/server/db/mysql";
import { htmlEntities } from '$lib/utils/htmlEntities.js';

export const POST = async ({request}) => {

    if (request.method !== 'POST') {

      return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});

    };
  
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

        name: `${htmlEntities(nameFirst)} ${htmlEntities(nameLast)}`

    });

    let res = await mysqlConnection();

    const insertQuery = `INSERT INTO 
        users_in_checkout (
            NameFirst, 
            NameLast, 
            Email, 
            stripe_id
        ) VALUES (
            "${htmlEntities(nameFirst)}", 
            "${htmlEntities(nameLast)}", 
            "${email}", 
            "${customer.id}")
    `;

    let success = false;
    // add the user data to users_in_checkout database table
    await res.query(insertQuery)
    .then(() => {

        success = true;
        
    })
    .catch(error => {

        success = false;

        throw error;

    });

    res.end();

    if (success) {

        return new Response(JSON.stringify({success: "donation intent created"}), {status: 200});

    } else {

        return new Response(JSON.stringify({error: "failed to enter user checkout registration data into database"}), {status: 422});

    };

};