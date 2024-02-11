import { mysqlConnection } from "$lib/server/db/mysql";

export const GET = async ({request}) => {

    if (request.method !== 'GET') {

        return new Response(JSON.stringify({error: "method is not GET"}), {status: 422});

    };

    let res = await mysqlConnection();

    /**
     * @type {CandidateWithImageNominated[]}
     */
    let campaignNominationsWithImages = [];

    // load all campaign nominations
    
    const loadCampaignNominationsStatement = `SELECT 
            campaign_nominations.*,
            image_collection.*,
            users_voters.email,
            voter_information.name_first,
            voter_information.name_last
        FROM 
            campaign_nominations
        INNER JOIN 
            image_collection
        ON 
            campaign_nominations.image_ID=image_collection.image_ID
        INNER JOIN
            users_voters
        ON 
            campaign_nominations.user_ID=users_voters.user_ID
        INNER JOIN
            voter_information
        ON
            campaign_nominations.user_ID=voter_information.user_ID

    `;

    await res.query(loadCampaignNominationsStatement)
    .then(([ rows ]) => {

        campaignNominationsWithImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return new Response(

        JSON.stringify(campaignNominationsWithImages), {status: 200}
        
    );

};