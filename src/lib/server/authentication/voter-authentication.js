import { verifyPassword } from '$lib/authentication/PasswordAuth';
import { mysqlConnection } from "$lib/server/db/mysql";

export const voterAuthentication = async (/** @type {{ email: string; password: string; }} */ credentials) => {
    
    if (credentials.email === "") {

        return null;

    } else if (credentials.password === "") {

        return null;

    };

    // search voters for voter account with email that matches the user

    let res = await mysqlConnection();

    // load query to check if row with same voter first name and voter last name exists

    const checkVoterEmailQuery = `SELECT * FROM users_voters WHERE email = '${credentials.email}'`;

    const [voterRows, voterFields] = await res.query(checkVoterEmailQuery);

    res.end();

    const voterExists = JSON.parse(JSON.stringify(voterRows));

    if (voterExists?.length <= 0) {

        return null;
    
    };

    const voterExistsEmail = voterExists[0].email;

    const voterExistsPassword = voterExists[0].password;

    const isValidPassword = await verifyPassword(credentials.password, voterExistsPassword);
        
    if (!isValidPassword) {

        return null;

    };

    const result = JSON.parse(JSON.stringify({email: voterExistsEmail, name: "voter"}));

    return result;

}