import { mysqlConnection } from "$lib/server/db/mysql";

export const load = async ({params, locals}) => {

    const user = locals.user;

    const id = params.action_endorsement_id;

    // load the action endorsement using the action endorsement_id

    /**
     * @type {ActionWithImage}
     */
    let endorsedActionWithImage;

    // begin load actions
    
    const loadEndorsedActionByIDStatement = `SELECT * FROM endorsed_actions 
    WHERE action_ID = ${id}`;


    /**
     * @type { Action[]}
     */
    let endorsedAction = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedActionByIDStatement)
    .then(([ rows ]) => {

        endorsedAction = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });


    /**
     * @type {number}
     */
    let endorsedActionImageId = endorsedAction[0].image_ID;

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID = ${endorsedActionImageId}`;

    /**
     * @type {Image[]}
     */
    let endorsedActionImage = [];

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        endorsedActionImage = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    endorsedActionWithImage = {...endorsedAction[0], ...endorsedActionImage[0]};

    res.end();

    return {
        streamed: {
            user,
            endorsedActionWithImage
        }
    };

};