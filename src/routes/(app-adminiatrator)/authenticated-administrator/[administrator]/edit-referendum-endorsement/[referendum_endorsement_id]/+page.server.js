import { mysqlConnection } from "$lib/server/db/mysql";

export const load = async ({ params, locals }) => {

    const user = locals.user;

    const id = params.referendum_endorsement_id;

    // load the referendum endorsement using the referendum endorsement_id

    /**
     * @type {ReferendumWithImage}
     */
    let endorsedReferendumWithImage;
    
    const loadEndorsedReferendumByIDStatement = `SELECT * FROM endorsed_referendums 
    WHERE referendum_ID = ${id}`;

    /**
     * @type { Referendum[]}
     */
    let endorsedReferendum = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedReferendumByIDStatement)
    .then(([ rows ]) => {

        endorsedReferendum = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });


    /**
     * @type {number}
     */
    let endorsedReferendumImageId = endorsedReferendum[0].image_ID;

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID = ${endorsedReferendumImageId}`;

    /**
     * @type {Image[]}
     */
    let endorsedReferendumImage = [];

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        endorsedReferendumImage = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    endorsedReferendumWithImage = {...endorsedReferendum[0], ...endorsedReferendumImage[0]};

    res.end();

    return {
        streamed: {
            user,
            endorsedReferendumWithImage
        }
    };
};