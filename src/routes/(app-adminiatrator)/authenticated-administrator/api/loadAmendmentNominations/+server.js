import { mysqlConnection } from "$lib/server/db/mysql";

export const GET = async ({request}) => {

    if (request.method !== 'GET') {

        return new Response(JSON.stringify({error: "method is not GET"}), {status: 422});

    };

    let res = await mysqlConnection();

    /**
     * @type {AmendmentWithSponsorsAndImageNominated[]}
     */
    let amendmentsWithImageNominated = [];

    // load all nominated amendments
    
    const loadNominatedAmendmentsStatement = `SELECT 
            nominated_amendments.*,
            image_collection.*,
            users_voters.email,
            voter_information.name_first,
            voter_information.name_last
        FROM 
            nominated_amendments
        INNER JOIN 
            image_collection
        ON 
            nominated_amendments.image_ID=image_collection.image_ID
        INNER JOIN
            users_voters
        ON 
            nominated_amendments.user_ID=users_voters.user_ID
        INNER JOIN
            voter_information
        ON
            nominated_amendments.user_ID=voter_information.user_ID
    `;

    await res.query(loadNominatedAmendmentsStatement)
    .then(([ rows ]) => {

        amendmentsWithImageNominated = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    if (amendmentsWithImageNominated.length === 0) {

        return new Response(

            JSON.stringify(amendmentsWithImageNominated), {status: 200}
            
        );

    };

    /**
     * @type {number[]}
     */
    let amendmentsIdsNominated = [];

    amendmentsWithImageNominated.forEach((amendment) => {

        amendmentsIdsNominated = [...amendmentsIdsNominated, amendment.amendment_ID];
        
    });

    const listAmendmentIds = amendmentsIdsNominated.join(", ");

    // get the sponsors from House    

    const loadSponsorsHouse = `SELECT * FROM sponsors_House WHERE sponsored_amendment_ID in(${listAmendmentIds})`;

    /**
     * @type {SponsorHouse[]}
     */
    let amendmentsNominatedSponsorsHouse = [];

    await res.query(loadSponsorsHouse)
    .then(([ rows ]) => {

        amendmentsNominatedSponsorsHouse = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // get the sponsors from Senate

    const loadSponsorsSenate = `SELECT * FROM sponsors_Senate WHERE sponsored_amendment_ID in(${listAmendmentIds})`;

    /**
     * @type {SponsorSenate[]}
     */
    let amendmentsNominatedSponsorsSenate = [];

    await res.query(loadSponsorsSenate)
    .then(([ rows ]) => {

        amendmentsNominatedSponsorsSenate = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // get the co-sponsors from Senate

    const loadCoSponsorsSenate = `SELECT * FROM co_sponsors_Senate WHERE co_sponsored_amendment_ID in(${listAmendmentIds})`;

    /**
     * @type {CoSponsorSenate[]}
     */
    let amendmentsNominatedCoSponsorsSenate = [];

    await res.query(loadCoSponsorsSenate)
    .then(([ rows ]) => {

        amendmentsNominatedCoSponsorsSenate = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // get the sponsors from House    

    const loadCoSponsorsHouse = `SELECT * FROM co_sponsors_House WHERE co_sponsored_amendment_ID in(${listAmendmentIds})`;

    /**
     * @type {CoSponsorHouse[]}
     */
    let amendmentsNominatedCoSponsorsHouse = [];

    await res.query(loadCoSponsorsHouse)
    .then(([ rows ]) => {

        amendmentsNominatedCoSponsorsHouse = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });
    /**
     * @type {AmendmentWithSponsorsAndImageNominated[]}
     */
    let amendmentsNominatedImagesAndSponsors = [];

    amendmentsWithImageNominated.forEach((amendment) => {

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

        amendmentsNominatedSponsorsHouse.forEach((sponsor) => {
            
            if (endorsedAmendmentId === sponsor.sponsored_amendment_ID) {

                sponsorsHouseByAmendmentID = [...sponsorsHouseByAmendmentID, sponsor];
                
            };

        });

        amendmentsNominatedSponsorsSenate.forEach((sponsor) => {

            if (endorsedAmendmentId === sponsor.sponsored_amendment_ID) {

                sponsorsSenateByAmendmentID = [...sponsorsSenateByAmendmentID, sponsor];

            };

        });

        amendmentsNominatedCoSponsorsHouse.forEach((sponsor) => {

            if (endorsedAmendmentId === sponsor.co_sponsored_amendment_ID) {

                coSponsorsHouseByAmendmentID = [...coSponsorsHouseByAmendmentID, sponsor];

            };

        });

        amendmentsNominatedCoSponsorsSenate.forEach((sponsor) => {

            if (endorsedAmendmentId === sponsor.co_sponsored_amendment_ID) {

                coSponsorsSenateByAmendmentID = [...coSponsorsSenateByAmendmentID, sponsor];

            };

        });

        amendmentsNominatedImagesAndSponsors = [
            ...amendmentsNominatedImagesAndSponsors, 
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

    return new Response(

        JSON.stringify(amendmentsNominatedImagesAndSponsors), {status: 200}
        
    );

};