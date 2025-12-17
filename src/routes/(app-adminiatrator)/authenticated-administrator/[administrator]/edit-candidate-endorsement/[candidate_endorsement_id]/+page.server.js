import { mysqlConnection } from "$lib/server/db/mysql";

export const load = async ({ params, locals }) => {

    const user = locals.user;

    const id = params.candidate_endorsement_id

    // load the candidate endorsement using the candidate endorsement_id

    /**
     * @type {CandidateWithImage}
     */
    let endorsedCandidateWithImage;
    
    const loadEndorsedCandidateByIDStatement = `SELECT * FROM endorsed_candidates 
    WHERE candidate_ID = ${id}`;

    /**
     * @type { Candidate[]}
     */
    let endorsedCandidate = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedCandidateByIDStatement)
    .then(([ rows ]) => {

        endorsedCandidate = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });


    /**
     * @type {number}
     */
    let endorsedCandidateImageId = endorsedCandidate[0].image_ID;

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID = ${endorsedCandidateImageId}`;

    /**
     * @type {Image[]}
     */
    let endorsedCandidateImage = [];

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        endorsedCandidateImage = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    endorsedCandidateWithImage = {...endorsedCandidate[0], ...endorsedCandidateImage[0]};

    res.end();

    return {
        streamed: {
            user,
            endorsedCandidateWithImage
        }
    };

};