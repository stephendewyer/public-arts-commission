import { verifyPassword } from '$lib/authentication/PasswordAuth';
import { mysqlConnection } from "$lib/server/db/mysql";
import { signAccessToken } from '$lib/server/authentication/auth';

export async function POST({request, cookies}) {

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});
    };

    const data = await request.json();

    const email = data.email;
    const password = data.password;

    if (!email && !password) {
        return new Response(JSON.stringify({error: "missing email address and password"}), {status: 422});
    } else if (!email && password) {
        return new Response(JSON.stringify({error: "missing email"}), {status: 422});
    } else if (email && !password) {
        return new Response(JSON.stringify({error: "missing password"}), {status: 422});
    };

    // search voters for voter account with email that matches the user

    let res = await mysqlConnection();

    /**
     * @type {string | any[]}
     */
    let voterRows = [];

    const checkVoterEmailQuery = `SELECT * FROM users_voters WHERE email = '${email}'`;

    await res.query(checkVoterEmailQuery)
    .then(([ rows ]) => {
        voterRows = JSON.parse(JSON.stringify(rows));
    })
    .catch(error => {
        throw error;
    });

    res.end();

    if (voterRows?.length === 0) {
        return new Response(JSON.stringify({error: "invalid email and/or password"}), {status: 422});
    };

    const user = {
        id: voterRows[0].user_ID,
        email: voterRows[0].email,
        role: "voter"
    };

    const voterPassword = voterRows[0].password;

    const isValidPassword = await verifyPassword(password, voterPassword);
        
    if (!isValidPassword) {
        return new Response(JSON.stringify({error: "invalid email and/or password"}), {status: 422});
    };

    // credentials are valid.  Create session cookie.
    const token = signAccessToken(user);

    cookies.set("session", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60*60*24*7
    });

    return new Response(JSON.stringify({ loggedIn: true, success: `Valid credentials.  Logging into voter account.`}), {status: 200});

};