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

    // console.log("endorsed legislation: ", endorsedLegislation);

    if (endorsedLegislation.length === 0) {

        return endorsedLegislationImagesAndSponsors;

    };

    // create an array of legislation image_IDs

    /**
     * @type {number[]}
     */
    let endorsedLegislationImageIds = [];

    endorsedLegislation.forEach((legislation) => {

        endorsedLegislationImageIds = [...endorsedLegislationImageIds, legislation.image_ID];

    });

    // load all the image rows from image_collection table that have an ID that matches an ID in endorsedLegislationImageIds

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

    // console.log("endorsed legislation images, ", endorsedLegislationImages);

    // combine each endorsedLegislation object with imageRow object that has matching image_ID

    endorsedLegislation.forEach((legislation) => {

        let endorsedLegislationImageId = legislation.image_ID;

        endorsedLegislationImages.forEach((imageRow) => {

            if (endorsedLegislationImageId === imageRow.image_ID) {

                endorsedLegislationWithImages = [...endorsedLegislationWithImages, {...legislation, ...imageRow}];

            };

        });

    });

    // console.log("endorsed legislation with images: ", endorsedLegislationWithImages);

    // get all the legislation IDs

    /**
     * @type {number[]}
     */
    let endorsedLegislationIds = [];

    endorsedLegislation.forEach((legislation) => {
        endorsedLegislationIds = [...endorsedLegislationIds, legislation.legislation_ID];
    });

    const listLegislationIds = endorsedLegislationIds.join(", ");

    // get the sponsors from House    

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

    // get the sponsors from Senate

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

    // get the co-sponsors from Senate

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

    // get the sponsors from House    

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
            
            if (endorsedLegislationId = sponsor.sponsored_legislation_ID) {

                sponsorsHouseByLegislationID = [...sponsorsHouseByLegislationID, sponsor];
                
            };

        });

        endorsedLegislationSponsorsSenate.forEach((sponsor) => {

            if (endorsedLegislationId = sponsor.sponsored_legislation_ID) {

                sponsorsSenateByLegislationID = [...sponsorsSenateByLegislationID, sponsor];

            };

        });

        endorsedLegislationCoSponsorsHouse.forEach((sponsor) => {

            if (endorsedLegislationId = sponsor.co_sponsored_legislation_ID) {

                coSponsorsHouseByLegislationID = [...coSponsorsHouseByLegislationID, sponsor];

            };

        });

        endorsedLegislationCoSponsorsSenate.forEach((sponsor) => {

            if (endorsedLegislationId = sponsor.co_sponsored_legislation_ID) {

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