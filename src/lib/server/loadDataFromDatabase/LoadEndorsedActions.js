import { mysqlConnection } from "$lib/server/db/mysql";

export const LoadAllEndorsedActions = async () => {

    // begin load actions
    
    const loadEndorsedActionsStatement = "SELECT * FROM endorsed_actions";

    /**
     * @type {Action[]}
     */
    let endorsedActions = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedActionsStatement)
    .then(([ rows ]) => {

        endorsedActions = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    /**
     * @type {number[]}
     */
    let endorsedActionsImageIds = [];

    endorsedActions.forEach((action) => {
        endorsedActionsImageIds.push(action.image_ID);
    });

    const listImageIds = endorsedActionsImageIds.join(", ");

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID in(${listImageIds})`;

    /**
     * @type {Image[]}
     */
    let endorsedActionsImages = [];

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        endorsedActionsImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });
    
    /**
     * @type {ActionWithImage[]}
     */
    let endorsedActionsWithImages = [];

    endorsedActions.forEach((action) => {
        let actionImageId = action.image_ID;

        endorsedActionsImages.forEach((imageRow) => {
            if (actionImageId === imageRow.image_ID) {
                endorsedActionsWithImages.push({...action, ...imageRow});
            };
        });
    });

    res.end();

    return endorsedActionsWithImages;

};