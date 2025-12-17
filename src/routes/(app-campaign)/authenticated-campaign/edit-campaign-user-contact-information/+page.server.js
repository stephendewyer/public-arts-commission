import { mysqlConnection } from "$lib/server/db/mysql";
import { error } from '@sveltejs/kit';

export const load = async ({locals}) => {

    // first, verify user corresponds with campaign application

    const user = await locals.user;

    const loadCampaignUserStatement = `SELECT *
        FROM users_campaigns
        WHERE email = '${user?.email}'`;
    /**
     * @type {CampaignUser[]}
     */
    let campaignUserRow = [];

    let res = await mysqlConnection();

    await res.query(loadCampaignUserStatement)
    .then(([rows]) => {

        campaignUserRow = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // if no campaign user row exists, throw error

    if (campaignUserRow.length === 0) {

        error(422, {

                    message: "could not find valid campaign user!"

                });

    };

    // load the user contact information
    /**
     * @type {CampaignUserInformation | any}
     */
    let campaignUserInformationRow;

    const loadCampaignUserInformationStatement = `SELECT *
        FROM campaign_users_information
        WHERE user_ID = "${campaignUserRow[0].user_ID}"
        `;
    
    await res.query(loadCampaignUserInformationStatement)
    .then(([rows]) => {

        campaignUserInformationRow = JSON.parse(JSON.stringify(rows))[0];

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return {
        streamed: {
            user,
            campaignUserInformationRow
        }
    };

};