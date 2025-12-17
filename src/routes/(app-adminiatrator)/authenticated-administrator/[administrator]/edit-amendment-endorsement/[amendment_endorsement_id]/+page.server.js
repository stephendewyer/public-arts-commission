import { mysqlConnection } from "$lib/server/db/mysql";

export const load = async ({params, locals}) => {

    const user = locals.user;

    const id = params.amendment_endorsement_id;

    // load the amendment endorsement using the amendment endorsement_id

    /**
     * @type {AmendmentWithImage}
     */
    let endorsedAmendmentWithImage;

    // begin load amendment
    
    const loadEndorsedAmendmentByIDStatement = `SELECT * FROM endorsed_amendments 
    WHERE amendment_ID = ${id}`;


    /**
     * @type { Amendment[]}
     */
    let endorsedAmendment = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedAmendmentByIDStatement)
    .then(([ rows ]) => {

        endorsedAmendment = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });
    
    /**
     * @type {number}
     */
    let endorsedAmendmentImageId = endorsedAmendment[0].image_ID;

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID = ${endorsedAmendmentImageId}`;

    /**
     * @type {Image[]}
     */
    let endorsedAmendmentImage = [];

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        endorsedAmendmentImage = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    endorsedAmendmentWithImage = {...endorsedAmendment[0], ...endorsedAmendmentImage[0]};

    // get the sponsors from House    

    const loadSponsorsHouse = `SELECT * FROM sponsors_House WHERE sponsored_amendment_ID = ${id}`;

    /**
     * @type {SponsorHouse[]}
     */
    let endorsedAmendmentSponsorsHouse = [];

    await res.query(loadSponsorsHouse)
    .then(([ rows ]) => {

        endorsedAmendmentSponsorsHouse = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // get the sponsors from Senate

    const loadSponsorsSenate = `SELECT * FROM sponsors_Senate WHERE sponsored_amendment_ID  = "${id}"`;

    /**
     * @type {SponsorSenate[]}
     */
    let endorsedAmendmentSponsorsSenate = [];

    await res.query(loadSponsorsSenate)
    .then(([ rows ]) => {

        endorsedAmendmentSponsorsSenate = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // get the co-sponsors from Senate

    const loadCoSponsorsSenate = `SELECT * FROM co_sponsors_Senate WHERE co_sponsored_amendment_ID = "${id}"`;

    /**
     * @type {CoSponsorSenate[]}
     */
    let endorsedAmendmentCoSponsorsSenate = [];

    await res.query(loadCoSponsorsSenate)
    .then(([ rows ]) => {

        endorsedAmendmentCoSponsorsSenate = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // get the sponsors from House    

    const loadCoSponsorsHouse = `SELECT * FROM co_sponsors_House WHERE co_sponsored_amendment_ID = "${id}"`;

    /**
     * @type {CoSponsorHouse[]}
     */
    let endorsedAmendmentCoSponsorsHouse = [];

    await res.query(loadCoSponsorsHouse)
    .then(([ rows ]) => {

        endorsedAmendmentCoSponsorsHouse = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });
    /**
     * @type {AmendmentWithSponsorsAndImage}
     */
    let endorsedAmendmentImagesAndSponsors = {
        ...endorsedAmendmentWithImage,
        sponsors_House: endorsedAmendmentSponsorsHouse,
        sponsors_Senate: endorsedAmendmentSponsorsSenate,
        co_sponsors_House: endorsedAmendmentCoSponsorsHouse,
        co_sponsors_Senate: endorsedAmendmentCoSponsorsSenate
    }

    res.end();

    return {
        streamed: {
            user,
            endorsedAmendmentImagesAndSponsors
        }
    };

};