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
     * @type {userID[]}
     */
    let userCampaignApplicationID = [];

    let res = await mysqlConnection();

    await res.query(loadCampaignApplicationUserIDStatement)
    .then(([ rows ]) => {

        userCampaignApplicationID = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // get the user_ID from users_campaigns where email equals session email

    const user = await locals.user;

    const loadSessionUserCampaignID = `SELECT user_ID
        FROM users_campaigns
        WHERE email = '${user?.email}'`;
    /**
     * @type {userID[]}
     */
    let sessionUserCampaignID = [];

    await res.query(loadSessionUserCampaignID)
    .then(([rows]) => {

        sessionUserCampaignID = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // check if userID matches session user ID
    // if session user ID does not match campaign application user ID, return invalid user

    if (sessionUserCampaignID[0]?.user_ID !== userCampaignApplicationID[0]?.user_ID) {

        error(422, {

                    message: "invalid user!"

                });

    };

    // load the campaign application using campaign application ID
    /**
     * @type {CampaignApplication | any}
     */
    let campaignApplication = {};

    // select campaign applications and corresponding image rows for the user
    
    const loadUserCampaignApplicationStatement = `SELECT * 
        FROM campaign_applications
        WHERE campaign_application_ID = '${campaignApplicationID}'`;

    await res.query(loadUserCampaignApplicationStatement)
    .then(([ rows ]) => {

        campaignApplication = JSON.parse(JSON.stringify(rows))[0];

        // if campaign application has been submitted, redirect user to campaign submit confirmation page

        if (campaignApplication?.campaign_application_submitted === 1) {

            redirect(
                            302, 
                            `http://localhost:5173/authenticated-campaign/campaign-submit-confirmation/campaign=${campaignApplication?.campaign_application_ID}`
                        );

        };

    })
    .catch(error => {

        throw error;

    });

    // if campaign application has no image id, return just the campaign application object as campaignApplicationWithImage
    // else get image row with corresponding image_ID and combine campaign application with image row as campaignApplicationWithImage

    /**
     * @type {CampaignApplicationWithImageRow | any}
     */
    let campaignApplicationWithImage = {};

    if (campaignApplication.image_ID) {
        /**
         * @type {Image[]}
         */
        let userImageRow = [];

        const loadImageRowsStatement = `SELECT * 
            FROM image_collection
            WHERE image_ID = '${campaignApplication.image_ID}'`;

        await res.query(loadImageRowsStatement)
        .then(([ rows ]) => {

            userImageRow = JSON.parse(JSON.stringify(rows))[0]

        })
        .catch(error => {

            throw error;

        });

        campaignApplicationWithImage = {...campaignApplication, ...userImageRow};

    } else if (!campaignApplication.image_ID) {

        campaignApplicationWithImage = {...campaignApplication};

    };

    // load the corresponding image row and add to campaign application object
    

    res.end();

    return {
        streamed: {
            user,
            campaignApplicationWithImage
        }
    };

};