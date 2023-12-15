import { mysqlConnection } from "$lib/server/db/mysql";

export const LoadAllEndorsedAmendments = async () => {

    // begin loaad amendments 

    const loadEndorsedAmendmentsStatement = "SELECT * FROM endorsed_amendments";

    /**
     * @type {Amendment[]}
     */
    let endorsedAmendments = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedAmendmentsStatement)
    .then(([ rows ]) => {

        endorsedAmendments = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    /**
     * @type {number[]}
     */
    let endorsedAmendmentsImageIds = [];

    endorsedAmendments.forEach((amendment) => {
        endorsedAmendmentsImageIds.push(amendment.image_ID);
    });

    const listImageIds = endorsedAmendmentsImageIds.join(", ");

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID in(${listImageIds})`;

    /**
     * @type {Image[]}
     */
    let endorsedAmendmentsImages = [];

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        endorsedAmendmentsImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    /**
     * @type {AmendmentWithImage[]}
     */
    let endorsedAmendmentsWithImages = [];

    endorsedAmendments.forEach((amendment) => {
        let amendmentImageId = amendment.image_ID;

        endorsedAmendmentsImages.forEach((imageRow) => {
            if (amendmentImageId === imageRow.image_ID) {
                endorsedAmendmentsWithImages.push({...amendment, ...imageRow});
            };
        });
    });

    res.end();

    return endorsedAmendmentsWithImages;

};