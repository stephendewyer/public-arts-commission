import { mysqlConnection } from "$lib/server/db/mysql";

export const load = async ({params}) => {

    const id = params.legislation_endorsement_id;

    // load the legislation endorsement using the legislation endorsement_id

    /**
     * @type {LegislationWithImage}
     */
    let endorsedLegislationWithImage;
    
    const loadEndorsedLegislationByIDStatement = `SELECT * FROM endorsed_legislation 
    WHERE legislation_ID = ${id}`;

    /**
     * @type { Legislation[]}
     */
    let endorsedLegislation = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedLegislationByIDStatement)
    .then(([ rows ]) => {

        endorsedLegislation = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });


    /**
     * @type {number}
     */
    let endorsedLegislationImageId = endorsedLegislation[0].image_ID;

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID = ${endorsedLegislationImageId}`;

    /**
     * @type {Image[]}
     */
    let endorsedLegislationImage = [];

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        endorsedLegislationImage = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    endorsedLegislationWithImage = {...endorsedLegislation[0], ...endorsedLegislationImage[0]};

    res.end();

    return {

        endorsedLegislationWithImage

    };

};