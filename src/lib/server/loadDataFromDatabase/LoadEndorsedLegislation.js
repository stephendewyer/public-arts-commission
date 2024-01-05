import { mysqlConnection } from "$lib/server/db/mysql";

export const LoadAllEndorsedLegislation = async () => {

    /**
     * @type {LegislationWithImage[]}
     */
    let endorsedLegislationWithImages = [];

    /**
     * @type {LegislationWithSponsorsAndImage[]}
     */
    let endorsedLegislationImagesAndSponsors = [];

    // begin load legislation with images

    const loadEndorsedLegislationWithImagesStatement = `SELECT * 
        FROM endorsed_legislation
        INNER JOIN image_collection
        ON endorsed_legislation.image_ID=image_collection.image_ID`;

    let res = await mysqlConnection();

    await res.query(loadEndorsedLegislationWithImagesStatement)
    .then(([ rows ]) => {

        endorsedLegislationWithImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    if (endorsedLegislationWithImages.length === 0) {

        return endorsedLegislationImagesAndSponsors;

    };

    // load all the legislation IDs from endorsedLegislation

    /**
     * @type {number[]}
     */
    let endorsedLegislationIds = [];

    endorsedLegislationWithImages.forEach((legislation) => {

        endorsedLegislationIds = [...endorsedLegislationIds, legislation.legislation_ID];

    });

    const listLegislationIds = endorsedLegislationIds.join(", ");

    // load all the House sponsors who have a sponsored_legislation_ID

    const loadSponsorsHouse = `SELECT * FROM sponsors_House WHERE sponsored_legislation_ID in(${listLegislationIds})`;

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

    // load all the Senate sponsors who have a sponsored_Legislation_ID

    const loadSponsorsSenate = `SELECT * FROM sponsors_Senate WHERE sponsored_legislation_ID in(${listLegislationIds})`;

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

    // load all the Senate co-sponsors who have a co_sponsored_legislation_ID

    const loadCoSponsorsSenate = `SELECT * FROM co_sponsors_Senate WHERE co_sponsored_legislation_ID in(${listLegislationIds})`;

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

    // load all the House co-sponsors who have a co_sponsored_legislation_ID

    const loadCoSponsorsHouse = `SELECT * FROM co_sponsors_House WHERE co_sponsored_legislation_ID in(${listLegislationIds})`;

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
    

    // add sponsors to endorsedLegislationWithImages objects in array

    endorsedLegislationWithImages.forEach((legislation) => {

        let endorsedLegislationId = legislation.legislation_ID;

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

        endorsedLegislationSponsorsHouse.forEach((sponsor) => {
            
            if (endorsedLegislationId === sponsor.sponsored_legislation_ID) {

                sponsorsHouseByLegislationID = [...sponsorsHouseByLegislationID, sponsor];
                
            };

        });

        endorsedLegislationSponsorsSenate.forEach((sponsor) => {

            if (endorsedLegislationId === sponsor.sponsored_legislation_ID) {

                sponsorsSenateByLegislationID = [...sponsorsSenateByLegislationID, sponsor];

            };

        });

        endorsedLegislationCoSponsorsHouse.forEach((sponsor) => {

            if (endorsedLegislationId === sponsor.co_sponsored_legislation_ID) {

                coSponsorsHouseByLegislationID = [...coSponsorsHouseByLegislationID, sponsor];

            };

        });

        endorsedLegislationCoSponsorsSenate.forEach((sponsor) => {

            if (endorsedLegislationId === sponsor.co_sponsored_legislation_ID) {

                coSponsorsSenateByLegislationID = [...coSponsorsSenateByLegislationID, sponsor];

            };

        });

        endorsedLegislationImagesAndSponsors = [
            ...endorsedLegislationImagesAndSponsors, 
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

    return endorsedLegislationImagesAndSponsors;

};