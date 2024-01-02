import { mysqlConnection } from "$lib/server/db/mysql";

export const LoadAllEndorsedActions = async () => {

    /**
     * @type {ActionWithImage[]}
     */
    let endorsedActionsWithImages = [];

    // load all the endorsed actions
    
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

    if (endorsedActions.length === 0) {

        return endorsedActionsWithImages;

    };

    // load all the image rows from image_collection table with image_IDs that match action image_IDs

    /**
     * @type {number[]}
     */
    let endorsedActionsImageIds = [];

    endorsedActions.forEach((action) => {

        endorsedActionsImageIds = [...endorsedActionsImageIds, action.image_ID];

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

    // combine each endorsed action object with image object that has matching image_ID 

    endorsedActions.forEach((action) => {

        let actionImageId = action.image_ID;

        endorsedActionsImages.forEach((imageRow) => {

            if (actionImageId === imageRow.image_ID) {

                endorsedActionsWithImages = [...endorsedActionsWithImages, {...action, ...imageRow}];

            };

        });
        
    });

    res.end();

    return endorsedActionsWithImages;

};