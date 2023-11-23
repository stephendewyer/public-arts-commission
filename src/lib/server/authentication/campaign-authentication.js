import { verifyPassword } from '$lib/authentication/PasswordAuth';
import { mysqlConnection } from "$lib/server/db/mysql";

export const campaignAuthentication = async (/** @type {{ email: string; password: string; }} */ credentials) => {
    
    if (credentials.email === "") {

        return null;

    } else if (credentials.password === "") {

        return null;
        
    };

    // search campaigns for campaign account with email that matches the user

    let res = await mysqlConnection();

    // load query to check if row with same voter first name and voter last name exists

    const checkCampaignsEmailQuery = `SELECT * FROM campaigns WHERE email = '${credentials.email}'`;

    const [campaignRows, campaignFields] = await res.query(checkCampaignsEmailQuery);

    const campaignExists = JSON.parse(JSON.stringify(campaignRows));

    if (campaignExists?.length <= 0) {

        return null;
    
    };

    const campaignExistsEmail = campaignExists[0].email;

    const campaignExistsPassword = campaignExists[0].password;

    const isValidPassword = await verifyPassword(credentials.password, campaignExistsPassword);
        
    if (!isValidPassword) {

        return null;

    };

    const result = JSON.parse(JSON.stringify({email: campaignExistsEmail, name: "campaign"}));

    return result;

}