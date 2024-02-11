import { mysqlConnection } from "$lib/server/db/mysql";

export const GET = async ({request}) => {

    if (request.method !== 'GET') {

        return new Response(JSON.stringify({error: "method is not GET"}), {status: 422});

    };

    /**
     * @type {ReferendumWithImageNominated[]}
     */
    let nominatedReferendumsWithImages = [];

    const loadNominatedReferendumsWithImagesStatement = `SELECT 
            nominated_referendums.*,
            image_collection.*,
            users_voters.email,
            voter_information.name_first,
            voter_information.name_last
        FROM 
            nominated_referendums
        INNER JOIN 
            image_collection
        ON 
            nominated_referendums.image_ID=image_collection.image_ID
        INNER JOIN
            users_voters
        ON 
            nominated_referendums.user_ID=users_voters.user_ID
        INNER JOIN
            voter_information
        ON
            nominated_referendums.user_ID=voter_information.user_ID
    `;

    let res = await mysqlConnection();

    await res.query(loadNominatedReferendumsWithImagesStatement)
    .then(([ rows ]) => {

        nominatedReferendumsWithImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return new Response(

        JSON.stringify(nominatedReferendumsWithImages), {status: 200}
        
    );

};