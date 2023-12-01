import { mysqlConnection } from "$lib/server/db/mysql";
import { verifyPassword } from '$lib/authentication/PasswordAuth';

export const adminAuthentication = async (/** @type {{ email: string; password: string; }} */ credentials) => {
    
    if (credentials.email === "") {

        return null;

    } else if (credentials.password === "") {

        return null;
        
    };

    // search campaigns for campaign account with email that matches the user

    let res = await mysqlConnection();

    // load query to check if row with same voter first name and voter last name exists

    const checkAdminsEmailQuery = `SELECT * FROM administrators WHERE email = '${credentials.email}'`;

    const [adminRows, adminFields] = await res.query(checkAdminsEmailQuery);

    const adminExists = JSON.parse(JSON.stringify(adminRows));

    if (adminExists?.length <= 0) {

        return null;
    
    };

    const adminExistsEmail = adminExists[0].email;

    const adminExistsPassword = adminExists[0].password;

    const isValidPassword = await verifyPassword(credentials.password, adminExistsPassword);
        
    if (!isValidPassword) {

        return null;

    };

    const result = JSON.parse(JSON.stringify({email: adminExistsEmail, name: "administrator"}));

    return result;

}