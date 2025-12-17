import { mysqlConnection } from "$lib/server/db/mysql";
import { htmlEntities } from "$lib/utils/htmlEntities.js";

export const PATCH = async ({request}) => {

    if (request.method !== 'PATCH') {

        return new Response(JSON.stringify({error: "method is not PATCH"}), {status: 422});

    };

    const data = await request.json();

    let { 
        campaignUserID,
        campaignUserInformationID,
        email,
        nameFirst,
        nameLast,
        phoneNumber,
        streetAddress,
        streetAddress02,
        city,
        state,
        zipCode
    } = data;

    if (
        !email ||
        !nameFirst ||
        !nameLast ||
        !streetAddress ||
        !city ||
        !state ||
        !zipCode
    ) {

        return new Response(JSON.stringify({error: "missing form data!"}), {status: 422});

    };

    // connect to the database
    
    let res = await mysqlConnection();

    // update the campaign user email in users_campaigns table

    const updateCampaignUserEmailStatement = `UPDATE users_campaigns
        SET
            email = "${email}"
        WHERE user_ID = "${campaignUserID}"`;

    await res.query(updateCampaignUserEmailStatement)
    .then(() => {
        console.log(`campaign user with ${email} updated`);
    })
    .catch(error => {
        throw error;
    });

    // update the campaign contact information in the campaign_users_information table

    const updateCampaignUserInformationStatement = `UPDATE campaign_users_information 
        SET
            name_first = "${htmlEntities(nameFirst)}",
            name_last = "${htmlEntities(nameLast)}",
            phone_number = "${phoneNumber}",
            street_address = "${htmlEntities(streetAddress)}",
            street_address_02 = "${htmlEntities(streetAddress02)}",
            city = "${htmlEntities(city)}",
            state = "${htmlEntities(state)}",
            zip_code = "${zipCode}"
        WHERE campaign_user_information_ID = "${campaignUserInformationID}"`;

    await res.query(updateCampaignUserInformationStatement)
    .then(() => {
        console.log(`campaign user information for ${nameFirst} ${nameLast} updated`);
    })
    .catch(error => {
        throw error;
    });

    res.end();

    return new Response(JSON.stringify({success: `campaign user information for  ${nameFirst} ${nameLast} updated!`}), {status: 200});

};