import { mysqlConnection } from "$lib/server/db/mysql";

export const LoadAllEndorsedLegislation = async () => {

    /**
     * @type {LegislationWithImage[]}
     */
    let endorsedLegislationWithImages = [];

    // begin load legislation

    const loadEndorsedLegislationStatement = "SELECT * FROM endorsed_legislation";

    /**
     * @type {Legislation[]}
     */
    let endorsedLegislation = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedLegislationStatement)
    .then(([ rows ]) => {

        endorsedLegislation = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    if (endorsedLegislation.length === 0) {

        return endorsedLegislationWithImages;

    };

    /**
     * @type {number[]}
     */
    let endorsedLegislationImageIds = [];

    endorsedLegislation.forEach((legislation) => {
        endorsedLegislationImageIds.push(legislation.image_ID);
    });

    const listImageIds = endorsedLegislationImageIds.join(", ");

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID in(${listImageIds})`;

    /**
     * @type {Image[]}
     */
    let endorsedLegislationImages = [];

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        endorsedLegislationImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    endorsedLegislation.forEach((legislation) => {
        let endorsedLegislationImageId = legislation.image_ID;

        endorsedLegislationImages.forEach((imageRow) => {
            if (endorsedLegislationImageId = imageRow.image_ID) {
                endorsedLegislationWithImages.push({...legislation, ...imageRow});
            };
        });
    });

    res.end();

    return endorsedLegislationWithImages;

};