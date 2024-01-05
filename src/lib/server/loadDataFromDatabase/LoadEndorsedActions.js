import { mysqlConnection } from "$lib/server/db/mysql";

export const LoadAllEndorsedActions = async () => {

    /**
     * @type {ActionWithImage[]}
     */
    let endorsedActionsWithImages = [];

    // load all the endorsed actions with respective matching image rows by joining the tables endorsed_actions and image_collection
    
    const loadEndorsedActionsWithImagesStatement = `SELECT * 
    FROM endorsed_actions
    INNER JOIN image_collection
    ON endorsed_actions.image_ID=image_collection.image_ID`;

    let res = await mysqlConnection();

    await res.query(loadEndorsedActionsWithImagesStatement)
    .then(([ rows ]) => {

        endorsedActionsWithImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return endorsedActionsWithImages;

};