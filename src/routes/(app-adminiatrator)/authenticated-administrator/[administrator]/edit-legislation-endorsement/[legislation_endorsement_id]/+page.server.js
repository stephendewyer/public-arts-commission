import { mysqlConnection } from "$lib/server/db/mysql";

export const load = async ({params, locals}) => {

    const user = locals.user;

    // load the legislation endorsement ID

    const id = params.legislation_endorsement_id;

    // load the legislation endorsement using the legislation endorsement_id

    /**
     * @type {LegislationWithImage}
     */
    let endorsedLegislationWithImage;
    
    const loadEndorsedLegislationByIDStatement = `SELECT * FROM endorsed_legislation 
    WHERE legislation_ID = ${id}`;

    /**
     * @type { Legislation[]}
     */
    let endorsedLegislation = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedLegislationByIDStatement)
    .then(([ rows ]) => {

        endorsedLegislation = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // console.log("endorsed legislation to edit: ", endorsedLegislation);

    // load the endorsed legsilation image from image_collection table

    /**
     * @type {number}
     */
    let endorsedLegislationImageId = endorsedLegislation[0].image_ID;

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID = ${endorsedLegislationImageId}`;

    /**
     * @type {Image[]}
     */
    let endorsedLegislationImage = [];

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        endorsedLegislationImage = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    endorsedLegislationWithImage = {...endorsedLegislation[0], ...endorsedLegislationImage[0]};

    // load the endorsed_legislation House sponsors  

    const loadSponsorsHouse = `SELECT * FROM sponsors_House WHERE sponsored_legislation_ID = ${id}`;

    /**
     * @type {SponsorHouse[]}
     */
    let endorsedLegislationSponsorsHouse = [];

    await res.query(loadSponsorsHouse)
    .then(([ rows ]) => {

        endorsedLegislationSponsorsHouse = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // load the endorsed legislation Senate sponsors

    const loadSponsorsSenate = `SELECT * FROM sponsors_Senate WHERE sponsored_legislation_ID  = "${id}"`;

    /**
     * @type {SponsorSenate[]}
     */
    let endorsedLegislationSponsorsSenate = [];

    await res.query(loadSponsorsSenate)
    .then(([ rows ]) => {

        endorsedLegislationSponsorsSenate = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // load the endorsed legislation Senate co-sponsors

    const loadCoSponsorsSenate = `SELECT * FROM co_sponsors_Senate WHERE co_sponsored_legislation_ID = "${id}"`;

    /**
     * @type {CoSponsorSenate[]}
     */
    let endorsedLegislationCoSponsorsSenate = [];

    await res.query(loadCoSponsorsSenate)
    .then(([ rows ]) => {

        endorsedLegislationCoSponsorsSenate = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // load the endorsed legislation House co-sponsors  

    const loadCoSponsorsHouse = `SELECT * FROM co_sponsors_House WHERE co_sponsored_legislation_ID = "${id}"`;

    /**
     * @type {CoSponsorHouse[]}
     */
    let endorsedLegislationCoSponsorsHouse = [];

    await res.query(loadCoSponsorsHouse)
    .then(([ rows ]) => {

        endorsedLegislationCoSponsorsHouse = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });
    /**
     * @type {LegislationWithSponsorsAndImage}
     */
    let endorsedLegislationImagesAndSponsors = {
        ...endorsedLegislationWithImage,
        sponsors_House: endorsedLegislationSponsorsHouse,
        sponsors_Senate: endorsedLegislationSponsorsSenate,
        co_sponsors_House: endorsedLegislationCoSponsorsHouse,
        co_sponsors_Senate: endorsedLegislationCoSponsorsSenate
    }

    res.end();

    return {
        streamed: {
            endorsedLegislationImagesAndSponsors,
            user
        } 
    };
};