import { hashPassword } from '$lib/authentication/PasswordAuth';
import { mysqlConnection } from "$lib/server/db/mysql";
import sgMail from "@sendgrid/mail";
import { SENDGRIDAPIKey } from '$env/static/private';

export async function PATCH({request}) {
    
    if (request.method !== 'PATCH') {

        return new Response(JSON.stringify({error: "method is not PATCH"}), {status: 422});

    };

    const data = await request.json();

    const {password, reenteredPassword, paramsTokenID, } = data;

    // connect to the database

    let res = await mysqlConnection();

    const searchTokenQuery = `SELECT * FROM users_campaigns WHERE reset_token = '${paramsTokenID}';`;

    /**
     * @type {string | any[]}
     */
    let userInCampaigns = [];

    await res.query(searchTokenQuery)
    .then(([ rows ]) => {

        userInCampaigns = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    const userEmail = userInCampaigns[0].email;

    if (userInCampaigns.length === 0) {

        return new Response(JSON.stringify({error: "no user found with token ID"}), {status: 422});

    };

    if (
        !password || 
        password.trim().length < 7
    ) {
        
        return new Response(JSON.stringify({error: "invalid input - password should be at least 7 characters long"}), {status: 422});

    };

    // hash the password

    const hashedPassword = await hashPassword(password);

    // update the password in the database

    const passwordUpdateStatement = `UPDATE users_campaigns
    SET 
        password = "${hashedPassword}"
    WHERE email = "${userEmail}";`

    await res.query(passwordUpdateStatement)
    .then(() => {

        console.log("password has been updated!");

    })
    .catch(error => {

        throw error;

    });

    // begin send email verification

    sgMail.setApiKey(SENDGRIDAPIKey)
    const msg = {
        to: userEmail,
        from: 'sdewyer@publicartscommission.org',
        subject: 'password update',
        html: `<p>Hi ${userEmail},<p>
        <p>Your public arts commission campaign password has been updated.</p>
        <p>Kind regards,</p>
        <p>public arts commission</p>
        <a href="https://www.publicartscommission.org">https://www.publicartscommission.org</a>`
    };
    try {

        await sgMail.send(msg);

    } catch (error) {

        console.error(error);

        return new Response(JSON.stringify({error: "message not sent due to a problem with the API"}), {status: 422});
    
    };

    return new Response(JSON.stringify({success: "your password has been updated"}), {status: 200});

}