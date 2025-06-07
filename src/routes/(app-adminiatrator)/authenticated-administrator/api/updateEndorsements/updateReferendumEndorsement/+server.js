import { mysqlConnection } from "$lib/server/db/mysql";
import { ImageFileExtensionTest } from "$lib/utils/ImageFileExtensionTest.js";
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARYCLOUDNAME } from "$env/static/private";
import { CLOUDINARYSECRETKEY } from "$env/static/private";
import { CLOUDINARYAPIKEY } from "$env/static/private";
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

    let electedINT = 0;
    let pendingElectionINT = 0;
    let rejectedINT = 0;

    const data = await request.json();

    let { 
        userEmail,
        imageID,
        image,
        imageFileName,
        imageAltText,
        imagePublicID,
        referendumID,
        referendumName,
        startingYearIfEnacted,
        electionDate,
        governmentLevel,
        state,
        county,
        city,
        websiteURL,
        details,
        elected,
        rejected,
        pendingElection,
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
        !imageAltText ||
        !referendumName ||
        !startingYearIfEnacted ||
        !electionDate ||
        !governmentLevel ||
        !details 
    ) {

        return new Response(JSON.stringify({error: "missing form data!"}), {status: 422});

    };

    if (imageFileName && (ImageFileExtensionTest(imageFileName) === "false") ) {

        return new Response(JSON.stringify({error: "invalid image file!"}), {status: 422});

    };

    if (!image) {

        return new Response(JSON.stringify({error: "missing image!"}), {status: 422});

    };

    if (elected) {

        electedINT = 1;

    };

    if (pendingElection) {

        pendingElectionINT = 1;

    };

    if (rejected) {

        rejectedINT = 1;

    };

    // upload image to Cloudinary

    // upload image to Cloudinary

    let uploadedImageURL;

    let uploadedImagePublicID;

    // connect to the database
    
    let res = await mysqlConnection();

    // if local image file:
    
    if (imageFileName) {
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
    
  // update the referendum information into the endorsed_referendums table

    const updateEndorsedReferendumInformationStatement = `UPDATE endorsed_referendums 
        SET
            referendum_name = "${htmlEntities(referendumName)}",
            starting_year_if_enacted = "${startingYearIfEnacted}",
            election_date = "${new Date(electionDate).toISOString().split('T')[0]}",
            government_level = "${htmlEntities(governmentLevel)}",
            state = "${htmlEntities(state)}",
            county = "${htmlEntities(county)}",
            city = "${htmlEntities(city)}",
            website_URL = "${htmlEntities(websiteURL)}",
            details = "${htmlEntities(details)}",
            elected = "${electedINT}",
            rejected = "${rejectedINT}",
            pending_election = "${pendingElectionINT}",
            contact_name_first = "${htmlEntities(nameFirstContact)}",
            contact_name_last = "${htmlEntities(nameLastContact)}",
            contact_phone_number = "${phoneContact}",
            contact_street_address = "${htmlEntities(streetAddressContact)}",
            contact_street_address_02 = "${htmlEntities(streetAddress02Contact)}",
            contact_city = "${htmlEntities(cityContact)}",
            contact_state = "${htmlEntities(stateContact)}",
            contact_zip_code = "${zipCodeContact}",
            contact_email = "${emailContact}"
        WHERE referendum_ID = "${referendumID}"
    `;

  await res.query(updateEndorsedReferendumInformationStatement)
  .then(() => {
    console.log(`referendum endorsement information for ${referendumName} updated`);
  })
  .catch(error => {
    throw error;
  });

  res.end();

  return new Response(JSON.stringify({success: `referendum endorsement updated!`}), {status: 200});

};