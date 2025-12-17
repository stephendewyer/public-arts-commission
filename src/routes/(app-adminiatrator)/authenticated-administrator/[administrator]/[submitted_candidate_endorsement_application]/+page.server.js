import { mysqlConnection } from "$lib/server/db/mysql";

export const load = async ({params, locals}) => {

    const user = locals.user;

    // first, verify user corresponds with campaign application

    const splitSlug = params.submitted_candidate_endorsement_application.split("_");

    const candidateApplicationID = splitSlug[1];

     // load all the endorsed candidates

     const loadCandidateApplicationWithImagesStatement = `SELECT 
            campaign_applications.*,
            image_collection.*
        FROM 
            campaign_applications
        INNER JOIN
            image_collection
        ON 
            campaign_applications.image_ID=image_collection.image_ID
        WHERE
            campaign_applications.campaign_application_ID=${candidateApplicationID}
    `;

    let res = await mysqlConnection();

    /**
     * @type {CampaignApplicationWithImageRow}
     */
    let candidateApplication;

    await res.query(loadCandidateApplicationWithImagesStatement)
    .then(([ rows ]) => {

        candidateApplication = JSON.parse(JSON.stringify(rows))[0];

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return {
        streamed:{
            // @ts-ignore
            candidateApplication,
            user
        }
    };

}