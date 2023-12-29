import { mysqlConnection } from "$lib/server/db/mysql";

export const load = async ({params}) => {

    const id = params.amendment_endorsement_id;

    // load the amendment endorsement using the amendment endorsement_id

    /**
     * @type {AmendmentWithImage}
     */
    let endorsedAmendmentWithImage;

    // begin load amendment
    
    const loadEndorsedAmendmentByIDStatement = `SELECT * FROM endorsed_amendments 
    WHERE amendment_ID = ${id}`;


    /**
     * @type { Amendment[]}
     */
    let endorsedAmendment = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedAmendmentByIDStatement)
    .then(([ rows ]) => {

        endorsedAmendment = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });


    /**
     * @type {number}
     */
    let endorsedAmendmentImageId = endorsedAmendment[0].image_ID;

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID = ${endorsedAmendmentImageId}`;

    /**
     * @type {Image[]}
     */
    let endorsedAmendmentImage = [];

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        endorsedAmendmentImage = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    endorsedAmendmentWithImage = {...endorsedAmendment[0], ...endorsedAmendmentImage[0]};

    res.end();

    return {

        endorsedAmendmentWithImage

    };

};