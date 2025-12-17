import { mysqlConnection } from "$lib/server/db/mysql";

export const GET = async ({request}) => {

    if (request.method !== 'GET') {

        return new Response(JSON.stringify({error: "method is not GET"}), {status: 422});

    };

    /**
     * @type {LegislationWithImage[]}
     */
    let legislationWithImagesNominations = [];

    /**
     * @type {LegislationWithSponsorsAndImageNominated[] | any[]}
     */
    let legislationWithImagesAndSponsorsNominations = [];

    // begin load legislation with images

    const loadNominatedLegislationWithImagesStatement = `SELECT 
            nominated_legislation.*,
            image_collection.*,
            users_voters.email,
            voter_information.name_first,
            voter_information.name_last
        FROM 
            nominated_legislation
        INNER JOIN 
            image_collection
        ON 
            nominated_legislation.image_ID=image_collection.image_ID
        INNER JOIN
            users_voters
        ON
            nominated_legislation.user_ID=users_voters.user_ID
        INNER JOIN
            voter_information
        ON
            nominated_legislation.user_ID=voter_information.user_ID
    `;

    let res = await mysqlConnection();

    await res.query(loadNominatedLegislationWithImagesStatement)
    .then(([ rows ]) => {

        legislationWithImagesNominations = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    if (legislationWithImagesNominations.length === 0) {

        return new Response(

            JSON.stringify(legislationWithImagesNominations), {status: 200}
            
        );

    };

    // load all the legislation IDs from legislationWithImagesNominations

    /**
     * @type {number[]}
     */
    let nominatedLegislationIds = [];

    legislationWithImagesNominations.forEach((legislation) => {

        nominatedLegislationIds = [...nominatedLegislationIds, legislation.legislation_ID];

    });

    const listLegislationIds = nominatedLegislationIds.join(", ");

    // load all the House sponsors who have a sponsored_legislation_ID

    const loadSponsorsHouse = `SELECT * FROM sponsors_House WHERE sponsored_legislation_ID in(${listLegislationIds})`;

    /**
     * @type {SponsorHouse[]}
     */
    let nominatedLegislationSponsorsHouse = [];

    await res.query(loadSponsorsHouse)
    .then(([ rows ]) => {

        nominatedLegislationSponsorsHouse = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // load all the Senate sponsors who have a sponsored_Legislation_ID

    const loadSponsorsSenate = `SELECT * FROM sponsors_Senate WHERE sponsored_legislation_ID in(${listLegislationIds})`;

    /**
     * @type {SponsorSenate[]}
     */
    let nominatedLegislationSponsorsSenate = [];

    await res.query(loadSponsorsSenate)
    .then(([ rows ]) => {

        nominatedLegislationSponsorsSenate = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // load all the Senate co-sponsors who have a co_sponsored_legislation_ID

    const loadCoSponsorsSenate = `SELECT * FROM co_sponsors_Senate WHERE co_sponsored_legislation_ID in(${listLegislationIds})`;

    /**
     * @type {CoSponsorSenate[]}
     */
    let nominatedLegislationCoSponsorsSenate = [];

    await res.query(loadCoSponsorsSenate)
    .then(([ rows ]) => {

        nominatedLegislationCoSponsorsSenate = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // load all the House co-sponsors who have a co_sponsored_legislation_ID

    const loadCoSponsorsHouse = `SELECT * FROM co_sponsors_House WHERE co_sponsored_legislation_ID in(${listLegislationIds})`;

    /**
     * @type {CoSponsorHouse[]}
     */
    let nominatedLegislationCoSponsorsHouse = [];

    await res.query(loadCoSponsorsHouse)
    .then(([ rows ]) => {

        nominatedLegislationCoSponsorsHouse = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });


    // add sponsors to legislationWithImagesNominations objects in array

    legislationWithImagesNominations.forEach((legislation) => {

        let nominatedLegislationId = legislation.legislation_ID;

        /**
         * @type {SponsorHouse[]}
         */
        let sponsorsHouseByLegislationID = [];
        /**
         * @type {SponsorSenate[]}
         */
        let sponsorsSenateByLegislationID = [];
        /**
         * @type {CoSponsorHouse[]}
         */
        let coSponsorsHouseByLegislationID = [];
        /**
         * @type {CoSponsorSenate[]}
         */
        let coSponsorsSenateByLegislationID = [];

        nominatedLegislationSponsorsHouse.forEach((sponsor) => {
            
            if (nominatedLegislationId === sponsor.sponsored_legislation_ID) {

                sponsorsHouseByLegislationID = [...sponsorsHouseByLegislationID, sponsor];
                
            };

        });

        nominatedLegislationSponsorsSenate.forEach((sponsor) => {

            if (nominatedLegislationId === sponsor.sponsored_legislation_ID) {

                sponsorsSenateByLegislationID = [...sponsorsSenateByLegislationID, sponsor];

            };

        });

        nominatedLegislationCoSponsorsHouse.forEach((sponsor) => {

            if (nominatedLegislationId === sponsor.co_sponsored_legislation_ID) {

                coSponsorsHouseByLegislationID = [...coSponsorsHouseByLegislationID, sponsor];

            };

        });

        nominatedLegislationCoSponsorsSenate.forEach((sponsor) => {

            if (nominatedLegislationId === sponsor.co_sponsored_legislation_ID) {

                coSponsorsSenateByLegislationID = [...coSponsorsSenateByLegislationID, sponsor];

            };

        });

        legislationWithImagesAndSponsorsNominations = [
            ...legislationWithImagesAndSponsorsNominations, 
            {
                ...legislation, 
                sponsors_House: sponsorsHouseByLegislationID,
                sponsors_Senate: sponsorsSenateByLegislationID,
                co_sponsors_House: coSponsorsHouseByLegislationID,
                co_sponsors_Senate: coSponsorsSenateByLegislationID
            }
        ];

    });

    res.end();

    return new Response(

        JSON.stringify(legislationWithImagesAndSponsorsNominations), {status: 200}
        
    );

};