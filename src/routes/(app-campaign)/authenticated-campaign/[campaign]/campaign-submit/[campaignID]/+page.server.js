import { mysqlConnection } from "$lib/server/db/mysql";
import { error, redirect } from '@sveltejs/kit';

export const load = async ({params, locals}) => {

    // first, verify user corresponds with campaign application

    const campaignApplicationID = params.campaignID.split("=")[1];

    // get the userID from campaign application row in campaign_applications

    const loadCampaignApplicationUserIDStatement = `SELECT user_ID 
        FROM campaign_applications
        WHERE campaign_application_ID = '${campaignApplicationID}'`;

    /**
     * @type {number | undefined}
     */
    let userCampaignApplicationID;

    let res = await mysqlConnection();

    await res.query(loadCampaignApplicationUserIDStatement)
    .then(([ rows ]) => {

        userCampaignApplicationID = JSON.parse(JSON.stringify(rows))[0];

    })
    .catch(error => {

        throw error;

    });

    // get the user_ID from users_campaigns where email equals session email

    const session = await locals.getSession();

    const loadSessionUserCampaignID = `SELECT user_ID
        FROM users_campaigns
        WHERE email = '${session?.user?.email}'`;

    let sessionUserCampaignID;

    await res.query(loadSessionUserCampaignID)
    .then(([rows]) => {

        sessionUserCampaignID = JSON.parse(JSON.stringify(rows))[0];

    })
    .catch(error => {

        throw error;

    });

    // check if userID matches session user ID
    // if session user ID does not match campaign application user ID, return invalid user

    if (sessionUserCampaignID !== userCampaignApplicationID) {

        error(422, {

            message: "invalid user!"

        });

    };

    // load the campaign application using campaign application ID

    let campaignApplication;

    // select campaign applications and corresponding image rows for the user
    
    const loadUserCampaignApplicationStatement = `SELECT * 
        FROM campaign_applications
        INNER JOIN image_collection
        ON campaign_applications.image_ID=image_collection.image_ID
        WHERE campaign_application_ID = '${campaignApplicationID}'`;

    await res.query(loadUserCampaignApplicationStatement)
    .then(([ rows ]) => {

        campaignApplication = JSON.parse(JSON.stringify(rows))[0];

        if (campaignApplication?.campaign_application_submitted === 1) {

            throw redirect(
                302, 
                `http://localhost:5173/authenticated-campaign/campaign/campaign-submit-confirmation/campaign=${campaignApplication?.campaign_application_ID}`
            );
    
        };

    })
    .catch(error => {

        throw error;

    });  

    res.end();

    return {

        campaignApplication

    };

};