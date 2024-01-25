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
     * @type {CampaignApplication[]}
     */
    let userCampaignApplications = [];

    // load campaign applications for the user
    
    const loadUserCampaignApplicationsStatement = `SELECT * 
        FROM campaign_applications
        WHERE user_ID = '${userID}'`;

    await res.query(loadUserCampaignApplicationsStatement)
    .then(([ rows ]) => {

        userCampaignApplications = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // load all image rows where campaign_ID = userID

    /**
     * @type {Image[]}
     */
    let userImageRows = [];

    const loadImageRowsStatement = `SELECT * 
        FROM image_collection
        WHERE campaign_ID = '${userID}'`;

    await res.query(loadImageRowsStatement)
    .then(([ rows ]) => {

        userImageRows = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // for each campaign application, select corresponding image row if any
    /**
     * @type {CampaignApplicationWithImageRow[] | CampaignApplication[]}
     */
    let campaignApplicationsWithImages = [];

    userCampaignApplications.forEach((campaignApplication, i) => {

        if (campaignApplication.image_ID) {

            userImageRows.filter((imageRow, i) => {
                if (campaignApplication.image_ID === imageRow.image_ID) {
                    return (
                        campaignApplicationsWithImages = [...campaignApplicationsWithImages, {...campaignApplication, ...imageRow}]
                    );
                };
                
            });

        } else if (!campaignApplication.image_ID) {

            return (

                campaignApplicationsWithImages = [...campaignApplicationsWithImages, {...campaignApplication}]

            );

        };
        
    });

    res.end();

    return new Response(

        JSON.stringify(campaignApplicationsWithImages), {status: 200}
        
    );

};