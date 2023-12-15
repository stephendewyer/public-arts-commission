import { mysqlConnection } from "$lib/server/db/mysql";

export const LoadAllEndorsedCandidates = async () => {

    // begin load candidates

    const loadEndorsedCandidatesStatement = "SELECT * FROM endorsed_candidates";

    /**
     * @type {Candidate[]}
     */
    let endorsedCandidates = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedCandidatesStatement)
    .then(([ rows ]) => {

        endorsedCandidates = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    /**
     * @type {number[]}
     */
    let endorsedCandidatesImageIds = [];

    endorsedCandidates.forEach((candidate) => {
        endorsedCandidatesImageIds.push(candidate.image_ID);
    });

    // select images from image_collection table where image_ID == image_ID
    //image ids comma separated list
    const listImageIds = endorsedCandidatesImageIds.join(", ");

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID in(${listImageIds})`;

    /**
     * @type {Image[]}
     */
    let candidatesImages = [];

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        candidatesImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });
    /**
     * @type {CandidateWithImage[]}
     */
    let endorsedCandidatesWithImages = [];

    endorsedCandidates.forEach((candidate) => {
        let candidateImageId = candidate.image_ID;

        candidatesImages.forEach((imageRow) => {
            if (candidateImageId === imageRow.image_ID) {
                endorsedCandidatesWithImages.push({...candidate, ...imageRow});
            };
        });
    });

    res.end();

    return endorsedCandidatesWithImages;
    
};