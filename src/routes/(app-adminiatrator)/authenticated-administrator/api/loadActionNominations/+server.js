import { mysqlConnection } from "$lib/server/db/mysql";

export const GET = async ({request}) => {

    if (request.method !== 'GET') {

        return new Response(JSON.stringify({error: "method is not GET"}), {status: 422});

    };

    let res = await mysqlConnection();

    /**
     * @type {ActionWithImageNominated[]}
     */
    let nominatedActionsWithImages = [];

    // load all nominated actions
    
    const loadNominatedActionsStatement = `SELECT 
            nominated_actions.*,
            image_collection.*,
            users_voters.email,
            voter_information.name_first,
            voter_information.name_last
        FROM 
            nominated_actions
        INNER JOIN 
            image_collection
        ON 
            nominated_actions.image_ID=image_collection.image_ID
        INNER JOIN 
            users_voters
        ON
            nominated_actions.user_ID=users_voters.user_ID
        INNER JOIN 
            voter_information
        ON
            nominated_actions.user_ID=voter_information.user_ID
    `;

    await res.query(loadNominatedActionsStatement)
    .then(([ rows ]) => {

        nominatedActionsWithImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return new Response(

        JSON.stringify(nominatedActionsWithImages), {status: 200}
        
    );

};