import { mysqlConnection } from "$lib/server/db/mysql";
import { ImageFileExtensionTest } from "$lib/utils/ImageFileExtensionTest.js";
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARYCLOUDNAME } from "$env/static/private";
import { CLOUDINARYSECRETKEY } from "$env/static/private";
import { CLOUDINARYAPIKEY } from "$env/static/private";
import { GovernmentLevelValidation } from "$lib/utils/GovernmentLevelValidation.js";
import { htmlEntities } from "$lib/utils/htmlEntities.js";

cloudinary.config({ 
  cloud_name: CLOUDINARYCLOUDNAME, 
  api_key: CLOUDINARYAPIKEY, 
  api_secret: CLOUDINARYSECRETKEY
});

export const PATCH = async ({request}) => {

    if (request.method !== 'PATCH') {

        return new Response(JSON.stringify({error: "method is not PATCH"}), {status: 422});

    };

    let passedInHouseINT = 0;
    let passedInSenateINT = 0;
    let rejectedByHouseINT = 0;
    let rejectedBySenateINT = 0;
    let vetoedByExecutiveINT = 0;
    let ExecutiveSignedIntoLawINT = 0;

    const data = await request.json();

    let { 
        legislationID,
        userEmail,
        imageFile,
        imagePublicID,
        imageAltText,
        image,
        imageID,
        legislationTitle,
        yearReleased,
        yearIntroducedInHouse,
        yearIntroducedInSenate,
        governmentLevel,
        state,
        county,
        city,
        websiteURL,
        details,
        introducedInHouse,
        introducedInSenate,
        sponsorHouse,
        sponsorSenate,
        coSponsorsHouse,
        coSponsorsSenate,
        houseSession,
        senateSession,
        passedInHouse,
        passedInSenate,
        rejectedByHouse,
        rejectedBySenate,
        vetoedByExecutive,
        ExecutiveSignedIntoLaw,
        nameFirstContact,
        nameLastContact,
        phoneContact,
        streetAddressContact,
        streetAddress02Contact,
        cityContact,
        stateContact,
        zipCodeContact,
        emailContact
    } = data;

    if (
        !image ||
        !imageAltText ||
        !legislationTitle ||
        !yearReleased ||
        !governmentLevel ||
        !details 
    ) {

        return new Response(JSON.stringify({error: "missing form data!"}), {status: 422});

    };

    GovernmentLevelValidation(governmentLevel, state, county, city);

    if (passedInHouse) {

        passedInHouseINT = 1;

    };

    if (passedInSenate) {

        passedInSenateINT = 1;

    };

    if (rejectedByHouse) {

        rejectedByHouseINT = 1;

    };

    if (rejectedBySenate) {

        rejectedBySenateINT = 1;

    };

    if (vetoedByExecutive) {

        vetoedByExecutiveINT = 1;

    };

    if (ExecutiveSignedIntoLaw) {

        ExecutiveSignedIntoLawINT = 1;

    };

    if (imageFile && (ImageFileExtensionTest(imageFile) === "false") ) {

        return new Response(JSON.stringify({error: "invalid image file!"}), {status: 422});

    };

    if (!image) {

        return new Response(JSON.stringify({error: "missing image!"}), {status: 422});

    };

    // check to see if any duplicates in coSponsorHouse names

    let coSponsorsHouseHasDuplicate = false;

    /**
     * @type {string[]}
     */
    let duplicateCoSponsorsHouse = [];

    let hasEmptyHouseCoSponsors = false;

    coSponsorsHouse.forEach((/** @type {CoSponsorInputValue} */ coSponsor) => {

        if (coSponsor.co_sponsor === "") {

            hasEmptyHouseCoSponsors = true;

        };

        let results = coSponsorsHouse.filter((/** @type {CoSponsorInputValue} */ item) => item.co_sponsor === coSponsor.co_sponsor);

        if (results.length >= 2) {

            coSponsorsHouseHasDuplicate = true;

            duplicateCoSponsorsHouse = [...duplicateCoSponsorsHouse, coSponsor.co_sponsor];

        };

    });

    if (hasEmptyHouseCoSponsors) {

        return new Response(JSON.stringify({error: `Cannot have empty House co-sponsors.`}), {status: 422});

    };

    if (coSponsorsHouseHasDuplicate) {

        return new Response(JSON.stringify({error: `House co-sponsors cannot contain duplicates.  Found duplicates ${duplicateCoSponsorsHouse.join(", ")}`}), {status: 422});

    };

    // check to see if any duplicates in coSponsorSenate names and if any inputs are empty

    let coSponsorsSenateHasDuplicate = false;
    /**
     * @type {string[]}
     */
    let duplicateCoSponsorsSenate = [];

    let hasEmptySenateCoSponsors = false;

    coSponsorsSenate.forEach((/** @type {CoSponsorInputValue} */ coSponsor) => {

        let results = coSponsorsSenate.filter((/** @type {CoSponsorInputValue} */ item) => item.co_sponsor === coSponsor.co_sponsor);

        if (coSponsor.co_sponsor === "") {

            hasEmptySenateCoSponsors = true;

        };

        if (results.length >= 2) {

            coSponsorsSenateHasDuplicate = true;

            duplicateCoSponsorsSenate = [...duplicateCoSponsorsSenate, coSponsor.co_sponsor];

        };

    });

    if (hasEmptySenateCoSponsors) {

        return new Response(JSON.stringify({error: `Cannot have empty Senate co-sponsors`}), {status: 422});

    };

    if (coSponsorsSenateHasDuplicate) {

        return new Response(JSON.stringify({error: `Senate co-sponsors cannot contain duplicates.  Found duplicates ${duplicateCoSponsorsSenate.join(", ")}`}), {status: 422});

    };

    // upload image to Cloudinary

    let uploadedImageURL;

    let uploadedImagePublicID;

    // connect to the database
    
    let res = await mysqlConnection();

    // if local image file:
    
    if (imageFile) {
        // delete the image associated with the action from Cloudinary 
        try {

            await cloudinary.uploader.destroy(imagePublicID);

        } catch(error) {

            console.log(error);

            return new Response(JSON.stringify({error: "problem with deleting image from Cloudinary"}), {status: 500});

        };

        // upload a new image to cloudinary 

        try {

            const uploadImageResponse = await cloudinary.uploader.upload(image, {});

            uploadedImageURL = uploadImageResponse.secure_url;

            uploadedImagePublicID = uploadImageResponse.public_id;

        } catch (err) {

            console.log(err);

            return new Response(JSON.stringify({error: "problem with the image upload to Cloudinary"}), {status: 500});

        };

        // save the image data in the database

        // get the admin ID from the database

        const getAdminRowQuery = `SELECT * FROM administrators WHERE email = '${userEmail}'`;

        /**
         * @type {{ ID: number; }[]}
         */
        let userInAdministrators = [];

        await res.query(getAdminRowQuery)
        .then(([ rows ]) => {

            userInAdministrators = JSON.parse(JSON.stringify(rows));

        })
        .catch(error => {

            throw error;

        });

        const adminID = userInAdministrators[0].ID;

        // insert image URL, admin_ID and image alt text into image_collection  

        const updateImageStatement = `UPDATE image_collection
        SET
            admin_ID = "${adminID}", 
            image_URL = "${uploadedImageURL}",
            alt_text = "${htmlEntities(imageAltText)}",
            public_ID = "${uploadedImagePublicID}",
            timestamp = "${Date.now()}"
        WHERE image_ID = "${imageID}"`;

        // insert the image_URL and adminID into the image_collection table and get the image_ID
        await res.query(updateImageStatement)
        .then(([ rows ]) => {
            const rowsJSON = JSON.parse(JSON.stringify(rows));
            imageID = rowsJSON.insertId;
        })
        .catch(error => {
            throw error;
        });

    };

    // update the House sponsors

    // update the House sponsor into the sponsors_House table

    // load all the House sponsors from database 

    const getHouseSponsorsQuery = `SELECT * FROM sponsors_House WHERE sponsored_legislation_ID = '${legislationID}'`;

    /**
     * @type {SponsorHouse[]}
     */
    let sponsorsHouseDatabase = [];

    await res.query(getHouseSponsorsQuery)
    .then(([ rows ]) => {

        sponsorsHouseDatabase = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // check if any of the House sponsors from database are equal to House sponsor from form

    // if not, update the House sponsor
    /**
     * @type {SponsorHouse[]}
     */
    let deleteHouseSponsors = [];
    /**
     * @type {SponsorHouse[]}
     */
    let matchingHouseSponsors = [];

    sponsorsHouseDatabase.forEach((sponsorFromDatabase) => {

        if (sponsorFromDatabase.sponsor_name !== sponsorHouse) {

            deleteHouseSponsors = [...deleteHouseSponsors, sponsorFromDatabase]

        };

        if (sponsorFromDatabase.sponsor_name === sponsorHouse) {

            matchingHouseSponsors = [...matchingHouseSponsors, sponsorFromDatabase]

        };

    });

    // delete the House sponsors from database that do nat match the sponsorHouse from form

    if (deleteHouseSponsors.length > 0) {

        /**
         * @type {number[]}
         */
        let sponsorIDs = [];

        deleteHouseSponsors.forEach((sponsor) => {
            sponsorIDs = [...sponsorIDs, sponsor.sponsor_ID];
        });

        const listSponsorIds = sponsorIDs.join(", ");

        const deleteHouseSponsorsStatement = `DELETE FROM sponsors_House WHERE sponsor_ID in(${listSponsorIds})`;

        await res.query(deleteHouseSponsorsStatement)
        .then(() => {
            console.log(`deleted unused House sponsors`);
        })
        .catch(error => {
            throw error;
        });

    };

    // if House sponsor exists and does not match existing House sponsor in database, insert the House sponsor into the database

    if (sponsorHouse && matchingHouseSponsors.length === 0) {

        const insertHouseSponsorStatement = `INSERT INTO sponsors_House (
            sponsored_legislation_ID, 
            sponsor_name
        ) VALUES ("${legislationID}", "${htmlEntities(sponsorHouse)}")`;
    
        await res.query(insertHouseSponsorStatement)
        .then(() => {
            console.log(`added legislation House sponsor`);
        })
        .catch(error => {
            throw error;
        });

    };

    // update the Senate sponsors

    // update the Senate sponsor into the sponsors_Senate table

    // load all the Senate sponsors from database 

    const getSenateSponsorsQuery = `SELECT * FROM sponsors_Senate WHERE sponsored_legislation_ID = '${legislationID}'`;

    /**
     * @type {SponsorSenate[]}
     */
    let sponsorsSenateDatabase = [];

    await res.query(getSenateSponsorsQuery)
    .then(([ rows ]) => {

        sponsorsSenateDatabase = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    // check if any of the Senate sponsors from database are equal to Senate sponsor from form

    // if not, update the House sponsor
    /**
     * @type {SponsorSenate[]}
     */
    let deleteSenateSponsors = [];
    /**
     * @type {SponsorSenate[]}
     */
    let matchingSenateSponsors = [];

    sponsorsSenateDatabase.forEach((sponsorFromDatabase) => {

        if (sponsorFromDatabase.sponsor_name !== sponsorSenate) {

            deleteSenateSponsors = [...deleteSenateSponsors, sponsorFromDatabase]

        };

        if (sponsorFromDatabase.sponsor_name === sponsorSenate) {

            matchingSenateSponsors = [...matchingSenateSponsors, sponsorFromDatabase]

        };

    });

    // delete the Senate sponsors from database that do nat match the sponsorSenate from form

    if (deleteSenateSponsors.length > 0) {

        /**
         * @type {number[]}
         */
        let sponsorIDs = [];

        deleteSenateSponsors.forEach((sponsor) => {
            sponsorIDs = [...sponsorIDs, sponsor.sponsor_ID];
        });

        const listSponsorIds = sponsorIDs.join(", ");

        const deleteSenateSponsorsStatement = `DELETE FROM sponsors_Senate WHERE sponsor_ID in(${listSponsorIds})`;

        await res.query(deleteSenateSponsorsStatement)
        .then(() => {
            console.log(`deleted unused Senate sponsors`);
        })
        .catch(error => {
            throw error;
        });

    };

    // if House sponsor exists and does not match existing House sponsor in database, insert the House sponsor into the database

    if (sponsorSenate && matchingSenateSponsors.length === 0) {

        const insertSenateSponsorStatement = `INSERT INTO sponsors_Senate (
            sponsored_legislation_ID, 
            sponsor_name
        ) VALUES ("${legislationID}", "${htmlEntities(sponsorSenate)}")`;
    
        await res.query(insertSenateSponsorStatement)
        .then(() => {
            console.log(`added legislation Senate sponsor`);
        })
        .catch(error => {
            throw error;
        });

    };

    // if co-sponsor name and co-sponsored legislation ID from database are equal to co-sponsor name and legislation ID from form, do nothing

    const selectHouseCoSponsors = `SELECT * FROM co_sponsors_House WHERE co_sponsored_legislation_ID = "${legislationID}"`;
    /**
     * @type {CoSponsorHouse[]}
     */
    let coSponsorsHouseDatabase = [];

    await res.query(selectHouseCoSponsors)
    .then(([ rows ]) => {

        coSponsorsHouseDatabase = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });
    
    // if co-sponsor name from database with same legislation ID as form legislation ID is not any of the the co-sponsor names from form, delete the co-sponsor row from the database
    /**
     * @type {CoSponsorHouse[]}
     */
    let deleteCoSponsorsHouse = [];
    /**
     * @type {CoSponsorHouse[]}
     */
    let matchingCoSponsorsHouse = [];

    coSponsorsHouseDatabase.forEach((coSponsorDatabase) => {

        let coSponsorHasMatch = false;

        coSponsorsHouse.forEach((/** @type {CoSponsorInputValue} */ coSponsorForm) => {            

            if (coSponsorDatabase.co_sponsor_name === coSponsorForm.co_sponsor) {

                coSponsorHasMatch = true;

                matchingCoSponsorsHouse = [...matchingCoSponsorsHouse, coSponsorDatabase];

            };

        });

        if (!coSponsorHasMatch) {

            deleteCoSponsorsHouse = [...deleteCoSponsorsHouse, coSponsorDatabase];

        };

    });

    if (deleteCoSponsorsHouse.length > 0) {

        /**
         * @type {number[]}
         */
        let coSponsorIDs = [];

        deleteCoSponsorsHouse.forEach((coSponsor) => {

            coSponsorIDs = [...coSponsorIDs, coSponsor.co_sponsor_ID];

        });

        const listCoSponsorIds = coSponsorIDs.join(", ");

        console.log("co-sponsors to delete from House: ", listCoSponsorIds)

        const deleteHouseCoSponsorsStatement = `DELETE FROM co_sponsors_House WHERE co_sponsor_ID in(${listCoSponsorIds})`;

        console.log(deleteHouseCoSponsorsStatement)

        await res.query(deleteHouseCoSponsorsStatement)
        .then(() => {
            console.log(`deleted unused House co-sponsors`);
        })
        .catch(error => {
            throw error;
        });

    };
    
    // if no co-sponsor name from database with same legislation ID as form legislation ID is equal to co-sponsor name from form, add the co-sponsor to the database
    /**
     * @type {string[]}
     */
    let coSponsorHouseToAdd = [];

    coSponsorsHouse.forEach((/** @type {CoSponsorInputValue} */ coSponsorForm) => {

        // if no match found in matchingCoSponsorsHouse, add to coSponsorsHouseToAdd
        /**
         * @type {string[]}
         */
        let matches = [];

        matchingCoSponsorsHouse.forEach((coSponsor) => {

            if (coSponsor.co_sponsor_name === coSponsorForm.co_sponsor) {

                matches = [...matches, coSponsor.co_sponsor_name];

            };

        });

        if (matches.length === 0) {

            coSponsorHouseToAdd = [...coSponsorHouseToAdd, coSponsorForm.co_sponsor]

        };

    });

    console.log("House co-sponsors to add: ", coSponsorHouseToAdd)

    if (coSponsorHouseToAdd.length > 0) {

        let coSponsorsHouseValues = "";

        coSponsorHouseToAdd.forEach((coSponsorName) => {

            coSponsorsHouseValues = (coSponsorsHouseValues.concat(`("${legislationID}", "${htmlEntities(coSponsorName)}"),`))

        });

        const insertHouseCoSponsorsStatement = `INSERT INTO co_sponsors_House (
            co_sponsored_legislation_ID, 
            co_sponsor_name
        ) VALUES ${coSponsorsHouseValues.slice(0, -1)}`;

        await res.query(insertHouseCoSponsorsStatement)
        .then(() => {
            console.log(`added legislation House co-sponsors`);
        })
        .catch(error => {
            throw error;
        });

    };

    // Senate co-sponsors

    // if co-sponsor name and co-sponsored legislation ID from database are equal to co-sponsor name and legislation ID from form, do nothing

    const selectSenateCoSponsors = `SELECT * FROM co_sponsors_Senate WHERE co_sponsored_legislation_ID = "${legislationID}"`;
    /**
     * @type {CoSponsorSenate[]}
     */
    let coSponsorsSenateDatabase = [];

    await res.query(selectSenateCoSponsors)
    .then(([ rows ]) => {

        coSponsorsSenateDatabase = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });
    
    // if co-sponsor name from database with same legislation ID as form legislation ID is not any of the the co-sponsor names from form, delete the co-sponsor row from the database
    /**
     * @type {CoSponsorSenate[]}
     */
    let deleteCoSponsorsSenate = [];
    /**
     * @type {CoSponsorSenate[]}
     */
    let matchingCoSponsorsSenate = [];

    coSponsorsSenateDatabase.forEach((coSponsorDatabase) => {

        let coSponsorHasMatch = false;

        coSponsorsSenate.forEach((/** @type {CoSponsorInputValue} */ coSponsorForm) => {

            if (coSponsorDatabase.co_sponsor_name === coSponsorForm.co_sponsor) {

                matchingCoSponsorsSenate = [...matchingCoSponsorsSenate, coSponsorDatabase];

                coSponsorHasMatch = true;

            };

        });

        // if coSponsorHasMatch is false, delete the co-sponsor from the database

        if (!coSponsorHasMatch) {

            deleteCoSponsorsSenate = [...deleteCoSponsorsSenate, coSponsorDatabase];

        };

    });

    if (deleteCoSponsorsSenate.length > 0) {

        /**
         * @type {number[]}
         */
        let coSponsorIDs = [];

        deleteCoSponsorsSenate.forEach((coSponsor) => {

            coSponsorIDs = [...coSponsorIDs, coSponsor.co_sponsor_ID];

        });

        const listCoSponsorIds = coSponsorIDs.join(", ");

        console.log("list of co-sponsors to delete from Senate: ", listCoSponsorIds)

        const deleteSenateCoSponsorsStatement = `DELETE FROM co_sponsors_Senate WHERE co_sponsor_ID in(${listCoSponsorIds})`;

        console.log(deleteSenateCoSponsorsStatement);

        await res.query(deleteSenateCoSponsorsStatement)
        .then(() => {
            console.log(`deleted unused Senate co-sponsors`);
        })
        .catch(error => {
            throw error;
        });

    };
    
    // if no co-sponsor name from database with same legislation ID as form legislation ID is equal to co-sponsor name from form, add the co-sponsor to the database
    /**
     * @type {string[]}
     */
    let coSponsorSenateToAdd = [];

    coSponsorsSenate.forEach((/** @type {CoSponsorInputValue} */ coSponsorForm) => {

        // if no match found in matchingCoSponsorsSenate, add to coSponsorsSenateToAdd
        /**
         * @type {string[]}
         */
        let matches = [];

        matchingCoSponsorsSenate.forEach((coSponsor) => {

            if (coSponsor.co_sponsor_name === coSponsorForm.co_sponsor) {

                matches = [...matches, coSponsor.co_sponsor_name];

            };

        });

        if (matches.length === 0) {

            coSponsorSenateToAdd = [...coSponsorSenateToAdd, coSponsorForm.co_sponsor]

        };

    });

    console.log("Senate co-sponsors to add: ", coSponsorSenateToAdd)

    if (coSponsorSenateToAdd.length > 0) {

        let coSponsorsSenateValues = "";

        coSponsorSenateToAdd.forEach((coSponsorName) => {

            coSponsorsSenateValues = (coSponsorsSenateValues.concat(`("${legislationID}", "${htmlEntities(coSponsorName)}"),`))

        });

        const insertSenateCoSponsorsStatement = `INSERT INTO co_sponsors_Senate (
            co_sponsored_legislation_ID, 
            co_sponsor_name
        ) VALUES ${coSponsorsSenateValues.slice(0, -1)}`;

        await res.query(insertSenateCoSponsorsStatement)
        .then(() => {
            console.log(`added legislation Senate co-sponsors`);
        })
        .catch(error => {
            throw error;
        });

    };

  // update the action information into the endorsed_actions table

    const updateEndorsedLegislationInformationStatement = `UPDATE endorsed_legislation 
        SET
            legislation_name = "${htmlEntities(legislationTitle)}",
            year_released = "${yearReleased}",
            year_introduced_House = "${yearIntroducedInHouse}",
            year_introduced_Senate = "${yearIntroducedInSenate}",
            government_level = "${htmlEntities(governmentLevel)}",
            state = "${htmlEntities(state)}",
            county = "${htmlEntities(county)}",
            city = "${htmlEntities(city)}",
            website_URL = "${htmlEntities(websiteURL)}",
            details = "${htmlEntities(details)}",
            session_House = "${houseSession}",
            session_Senate = "${senateSession}",
            passed_in_House = "${passedInHouseINT}",
            passed_in_Senate = "${passedInSenateINT}",
            rejected_in_House = "${rejectedByHouseINT}",
            rejected_in_Senate = "${rejectedBySenateINT}",
            vetoed_by_Executive = "${vetoedByExecutiveINT}",
            signed_by_Executive = "${ExecutiveSignedIntoLawINT}",
            contact_name_first = "${htmlEntities(nameFirstContact)}",
            contact_name_last = "${htmlEntities(nameLastContact)}",
            contact_phone_number = "${phoneContact}",
            contact_street_address = "${htmlEntities(streetAddressContact)}",
            contact_street_address_02 = "${htmlEntities(streetAddress02Contact)}",
            contact_city = "${htmlEntities(cityContact)}",
            contact_state = "${htmlEntities(stateContact)}",
            contact_zip_code = "${zipCodeContact}",
            contact_email = "${emailContact}"
        WHERE legislation_ID = "${legislationID}"
    `;

  await res.query(updateEndorsedLegislationInformationStatement)
  .then(() => {
    console.log(`legislation endorsement information for ${legislationTitle} updated`);
  })
  .catch(error => {
    throw error;
  });

  res.end();

  return new Response(JSON.stringify({success: `legislation endorsement updated!`}), {status: 200});

};