import { mysqlConnection } from "$lib/server/db/mysql";

export const LoadAllEndorsedCandidates = async () => {

    /**
     * @type {CandidateWithImage[]}
     */
    let endorsedCandidatesWithImages = [];

    // load all the endorsed candidates

    const loadEndorsedCandidatesWithImagesStatement = `SELECT * 
        FROM endorsed_candidates
        INNER JOIN image_collection 
        ON endorsed_candidates.image_ID=image_collection.image_ID`;

    let res = await mysqlConnection();

    await res.query(loadEndorsedCandidatesWithImagesStatement)
    .then(([ rows ]) => {

        endorsedCandidatesWithImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    return endorsedCandidatesWithImages;
    
};