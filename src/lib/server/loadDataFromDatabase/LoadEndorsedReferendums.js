import { mysqlConnection } from "$lib/server/db/mysql";

export const LoadAllEndorsedReferendums = async () => {

    /**
     * @type {ReferendumWithImage[]}
     */
    let endorsedReferendumsWithImages = [];

    const loadEndorsedReferendumsStatement = "SELECT * FROM endorsed_referendums";

    /**
     * @type {Referendum[]}
     */
    let endorsedReferendums = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedReferendumsStatement)
    .then(([ rows ]) => {

        endorsedReferendums = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    if (endorsedReferendums.length === 0) {

        return endorsedReferendumsWithImages;

    };

    /**
     * @type {number[]}
     */
    let endorsedReferendumsImageIds = [];

    endorsedReferendums.forEach((referendum) => {
        endorsedReferendumsImageIds = [...endorsedReferendumsImageIds, referendum.image_ID];
    });

    const listImageIds = endorsedReferendumsImageIds.join(", ");

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID in(${listImageIds})`;

    /**
     * @type {Image[]}
     */
    let endorsedReferendumsImages = [];

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        endorsedReferendumsImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    endorsedReferendums.forEach((referendum) => {
        let referendumImageId = referendum.image_ID;

        endorsedReferendumsImages.forEach((imageRow) => {
            if (referendumImageId = imageRow.image_ID) {
                endorsedReferendumsWithImages = [...endorsedReferendumsWithImages, {...referendum, ...imageRow}];
            };
        });
    });

    res.end();

    return endorsedReferendumsWithImages;

};