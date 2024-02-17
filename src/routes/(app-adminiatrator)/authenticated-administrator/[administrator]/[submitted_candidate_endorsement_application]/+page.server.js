import { mysqlConnection } from "$lib/server/db/mysql";

export const load = async ({params, url}) => {

    // first, verify user corresponds with campaign application

    const candidateApplicationID = url.searchParams.get("candidate_application_ID");

    console.log(candidateApplicationID);

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

    let candidateApplication;

    await res.query(loadCandidateApplicationWithImagesStatement)
    .then(([ rows ]) => {

        candidateApplication = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return {
        candidate_application: candidateApplication
    };

}