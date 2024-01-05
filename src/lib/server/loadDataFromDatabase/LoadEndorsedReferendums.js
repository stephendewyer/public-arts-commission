import { mysqlConnection } from "$lib/server/db/mysql";

export const LoadAllEndorsedReferendums = async () => {

    /**
     * @type {ReferendumWithImage[]}
     */
    let endorsedReferendumsWithImages = [];

    const loadEndorsedReferendumsWithImagesStatement = `SELECT * 
    FROM endorsed_referendums
    INNER JOIN image_collection
    ON endorsed_referendums.image_ID=image_collection.image_ID`;

    let res = await mysqlConnection();

    await res.query(loadEndorsedReferendumsWithImagesStatement)
    .then(([ rows ]) => {

        endorsedReferendumsWithImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return endorsedReferendumsWithImages;

};