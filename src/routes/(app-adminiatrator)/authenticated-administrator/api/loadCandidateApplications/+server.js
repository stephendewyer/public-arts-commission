import { mysqlConnection } from "$lib/server/db/mysql";

export const GET = async ({request}) => {

    if (request.method !== 'GET') {

        return new Response(JSON.stringify({error: "method is not GET"}), {status: 422});

    };

    let res = await mysqlConnection();

    /**
     * @type {CampaignApplication[]}
     */
    let campaignApplicationsWithImages = [];

    // load all campaign applications
    
    const loadCampaignApplicationsStatement = `SELECT * 
        FROM campaign_applications
        INNER JOIN image_collection
        ON campaign_applications.image_ID=image_collection.image_ID`;

    await res.query(loadCampaignApplicationsStatement)
    .then(([ rows ]) => {

        campaignApplicationsWithImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return new Response(

        JSON.stringify(campaignApplicationsWithImages), {status: 200}
        
    );

};