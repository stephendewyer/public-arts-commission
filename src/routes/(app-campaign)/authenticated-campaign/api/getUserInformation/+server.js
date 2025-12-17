import { mysqlConnection } from "$lib/server/db/mysql";

export const POST = async ({request}) => {

    if (request.method !== 'POST') {

        return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});

    };

    const data = await request.json();

    const { userEmail } = data;

    let userID;

    const selectUserIDQuery = `SELECT user_ID FROM users_campaigns 
        WHERE email = '${userEmail}'`;

    let res = await mysqlConnection();

    await res.query(selectUserIDQuery)
    .then(([rows]) => {

        userID = JSON.parse(JSON.stringify(rows))[0].user_ID;

    })
    .catch(error => {

        throw error;

    });

    /**
     * @type {any[]}
     */
    let campaignUsersInformation = [];
    
    const loadCampaignUsersInformationStatement = `SELECT * 
        FROM campaign_users_information
        WHERE user_ID = '${userID}'`;

    await res.query(loadCampaignUsersInformationStatement)
    .then(([ rows ]) => {

        campaignUsersInformation = JSON.parse(JSON.stringify(rows))[0];

    })
    .catch(error => {

        throw error;

    });

    res.end();


    return new Response(

        JSON.stringify(campaignUsersInformation), {status: 200}
        
    );

};