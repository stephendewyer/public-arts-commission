import { mysqlConnection } from "$lib/server/db/mysql";

export const LoadAllEndorsedAmendments = async () => {

    /**
     * @type {AmendmentWithImage[]}
     */
    let endorsedAmendmentsWithImages = [];

    /**
     * @type {AmendmentWithSponsorsAndImage[]}
     */
    let endorsedAmendmentsImagesAndSponsors = [];

    // load all the endorsed amendments

    const loadEndorsedAmendmentsStatement = "SELECT * FROM endorsed_amendments";

    /**
     * @type {Amendment[]}
     */
    let endorsedAmendments = [];

    let res = await mysqlConnection();

    await res.query(loadEndorsedAmendmentsStatement)
    .then(([ rows ]) => {

        endorsedAmendments = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    if (endorsedAmendments.length === 0) {

        return endorsedAmendmentsImagesAndSponsors;

    };

    /**
     * @type {number[]}
     */
    let endorsedAmendmentsImageIds = [];

    endorsedAmendments.forEach((amendment) => {

        endorsedAmendmentsImageIds = [...endorsedAmendmentsImageIds, amendment.image_ID];

    });

    const listImageIds = endorsedAmendmentsImageIds.join(", ");

    const loadImagesStatement = `SELECT * FROM image_collection WHERE image_ID in(${listImageIds})`;

    /**
     * @type {Image[]}
     */
    let endorsedAmendmentsImages = [];

    await res.query(loadImagesStatement)
    .then(([ rows ]) => {

        endorsedAmendmentsImages = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    endorsedAmendments.forEach((amendment) => {

        let amendmentImageId = amendment.image_ID;

        endorsedAmendmentsImages.forEach((imageRow) => {

            if (amendmentImageId === imageRow.image_ID) {

                endorsedAmendmentsWithImages = [...endorsedAmendmentsWithImages, {...amendment, ...imageRow}];

            };

        });

    });

    /**
     * @type {number[]}
     */
    let endorsedAmendmentsIds = [];

    endorsedAmendments.forEach((amendment) => {

        endorsedAmendmentsIds = [...endorsedAmendmentsIds, amendment.amendment_ID];
        
    });

    const listAmendmentIds = endorsedAmendmentsIds.join(", ");

    // get the sponsors from House    

    const loadSponsorsHouse = `SELECT * FROM sponsors_House WHERE sponsored_amendment_ID in(${listAmendmentIds})`;

    /**
     * @type {SponsorHouse[]}
     */
    let endorsedAmendmentsSponsorsHouse = [];

    await res.query(loadSponsorsHouse)
    .then(([ rows ]) => {

        endorsedAmendmentsSponsorsHouse = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // get the sponsors from Senate

    const loadSponsorsSenate = `SELECT * FROM sponsors_Senate WHERE sponsored_amendment_ID in(${listAmendmentIds})`;

    /**
     * @type {SponsorSenate[]}
     */
    let endorsedAmendmentsSponsorsSenate = [];

    await res.query(loadSponsorsSenate)
    .then(([ rows ]) => {

        endorsedAmendmentsSponsorsSenate = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // get the co-sponsors from Senate

    const loadCoSponsorsSenate = `SELECT * FROM co_sponsors_Senate WHERE co_sponsored_amendment_ID in(${listAmendmentIds})`;

    /**
     * @type {CoSponsorSenate[]}
     */
    let endorsedAmendmentsCoSponsorsSenate = [];

    await res.query(loadCoSponsorsSenate)
    .then(([ rows ]) => {

        endorsedAmendmentsCoSponsorsSenate = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // get the sponsors from House    

    const loadCoSponsorsHouse = `SELECT * FROM co_sponsors_House WHERE co_sponsored_amendment_ID in(${listAmendmentIds})`;

    /**
     * @type {CoSponsorHouse[]}
     */
    let endorsedAmendmentsCoSponsorsHouse = [];

    await res.query(loadCoSponsorsHouse)
    .then(([ rows ]) => {

        endorsedAmendmentsCoSponsorsHouse = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // add sponsors to endorsedLegislationWithImages objects in array

    endorsedAmendmentsWithImages.forEach((amendment) => {

        let endorsedAmendmentId = amendment.amendment_ID;

        /**
         * @type {SponsorHouse[]}
         */
        let sponsorsHouseByAmendmentID = [];
        /**
         * @type {SponsorSenate[]}
         */
        let sponsorsSenateByAmendmentID = [];
        /**
         * @type {CoSponsorHouse[]}
         */
        let coSponsorsHouseByAmendmentID = [];
        /**
         * @type {CoSponsorSenate[]}
         */
        let coSponsorsSenateByAmendmentID = [];

        endorsedAmendmentsSponsorsHouse.forEach((sponsor) => {
            
            if (endorsedAmendmentId = sponsor.sponsored_amendment_ID) {

                sponsorsHouseByAmendmentID = [...sponsorsHouseByAmendmentID, sponsor];
                
            };

        });

        endorsedAmendmentsSponsorsSenate.forEach((sponsor) => {

            if (endorsedAmendmentId = sponsor.sponsored_amendment_ID) {

                sponsorsSenateByAmendmentID = [...sponsorsSenateByAmendmentID, sponsor];

            };

        });

        endorsedAmendmentsCoSponsorsHouse.forEach((sponsor) => {

            if (endorsedAmendmentId = sponsor.co_sponsored_amendment_ID) {

                coSponsorsHouseByAmendmentID = [...coSponsorsHouseByAmendmentID, sponsor];

            };

        });

        endorsedAmendmentsCoSponsorsSenate.forEach((sponsor) => {

            if (endorsedAmendmentId = sponsor.co_sponsored_amendment_ID) {

                coSponsorsSenateByAmendmentID = [...coSponsorsSenateByAmendmentID, sponsor];

            };

        });

        endorsedAmendmentsImagesAndSponsors = [
            ...endorsedAmendmentsImagesAndSponsors, 
            {
                ...amendment, 
                sponsors_House: sponsorsHouseByAmendmentID,
                sponsors_Senate: sponsorsSenateByAmendmentID,
                co_sponsors_House: coSponsorsHouseByAmendmentID,
                co_sponsors_Senate: coSponsorsSenateByAmendmentID
            }
        ];

    });

    res.end();

    return endorsedAmendmentsImagesAndSponsors;

};