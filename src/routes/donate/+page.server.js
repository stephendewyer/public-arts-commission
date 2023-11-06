import { stripe } from '$lib/server/stripe/stripe';
import { mysqlConnection } from "$lib/server/db/mysql";
import { fail, redirect } from '@sveltejs/kit';

export const actions = {

    register_user_checkout: async ({request}) => {

        const data = await request.formData();

        const nameFirst = data.get('checkout_user_nameFirst');

        const nameLast = data.get('checkout_user_nameLast');

        const email = data.get('email');

        const customer = await stripe.customers.create({

            email: email?.toString(),

            name: `${nameFirst} ${nameLast}`

        });

        let res = await mysqlConnection();

        const insertQuery = `INSERT INTO users_in_checkout (NameFirst, NameLast, Email) VALUES ("${nameFirst}", "${nameLast}", "${email}")`;

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

            throw redirect(303, '/donate/payment');

        } else {

            return {fail: "failed to enter user checkout registration data into database" };

        }
        
    }
}
