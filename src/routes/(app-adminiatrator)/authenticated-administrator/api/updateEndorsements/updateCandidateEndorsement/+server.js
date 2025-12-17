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

    const data = await request.json();

    let { 
        userEmail,
        imageFile,
        imageAltText,
        image,
        imageID,
        imagePublicID,
        candidateID,
        campaignName,
        electorate,
        yearOfficeSought,
        electionDatePrimary,
        electionDateGeneral,
        governmentLevel,
        state,
        county,
        city,
        party,
        websiteURL,
        runningInPrimary,
        electedInPrimary,
        rejectedInPrimary,
        runningInGeneral,
        electedInGeneral,
        rejectedInGeneral,
        campaignEnded,
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
        !electorate ||
        !campaignName ||
        !governmentLevel
    ) {

        return new Response(JSON.stringify({error: "missing form data!"}), {status: 422});

    };

    if (imageFile && (ImageFileExtensionTest(imageFile) === "false") ) {

        return new Response(JSON.stringify({error: "invalid image file!"}), {status: 422});

    };

    if (!image) {

        return new Response(JSON.stringify({error: "missing image!"}), {status: 422});

    };

    let runningInPrimaryINT = 0;
    let electedInPrimaryINT = 0;
    let rejectedInPrimaryINT = 0;
    let runningInGeneralINT = 0;
    let electedInGeneralINT = 0;
    let rejectedInGeneralINT = 0;
    let campaignEndedINT = 0;

    if (runningInPrimary) {

        runningInPrimaryINT = 1;

    };

    if (electedInPrimary) {

        electedInPrimaryINT = 1;

    };

    if (rejectedInPrimary) {

        rejectedInPrimaryINT = 1;

    };

    if (runningInGeneral) {

        runningInGeneralINT = 1;

    };

    if (electedInGeneral) {

        electedInGeneralINT = 1;

    };

    if (rejectedInGeneral) {

        rejectedInGeneralINT = 1;

    };

    if (campaignEnded) {

        campaignEndedINT = 1;

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

  // update the candidate information into the endorsed_candidates table

    const updateEndorsedCandidateInformationStatement = `UPDATE endorsed_candidates 
        SET
            campaign_name = "${htmlEntities(campaignName)}",
            office_sought_starting_year = "${yearOfficeSought}",
            election_date_primary = "${new Date(electionDatePrimary).toISOString().split('T')[0]}",
            election_date_general = "${new Date(electionDateGeneral).toISOString().split('T')[0]}",
            government_level = "${htmlEntities(governmentLevel)}",
            state = "${htmlEntities(state)}",
            county = "${htmlEntities(county)}",
            city = "${htmlEntities(city)}",
            party = "${htmlEntities(party)}",
            website_URL = "${htmlEntities(websiteURL)}",
            running_in_primary = "${runningInPrimaryINT}",
            elected_in_primary = "${electedInPrimaryINT}",
            rejected_in_primary = "${rejectedInPrimaryINT}",
            running_in_general = "${runningInGeneralINT}",
            elected_in_general = "${electedInGeneralINT}",
            rejected_in_general = "${rejectedInGeneralINT}",
            campaign_ended = "${campaignEndedINT}",
            contact_name_first = "${htmlEntities(nameFirstContact)}",
            contact_name_last = "${htmlEntities(nameLastContact)}",
            contact_phone_number = "${phoneContact}",
            contact_street_address = "${htmlEntities(streetAddressContact)}",
            contact_street_address_02 = "${htmlEntities(streetAddress02Contact)}",
            contact_city = "${htmlEntities(cityContact)}",
            contact_state = "${htmlEntities(stateContact)}",
            contact_zip_code = "${zipCodeContact}",
            contact_email = "${emailContact}",
            electorate = "${htmlEntities(electorate)}"
        WHERE candidate_ID = "${candidateID}"
    `;

  await res.query(updateEndorsedCandidateInformationStatement)
  .then(() => {
    console.log(`candidate endorsement information for ${campaignName} updated`);
  })
  .catch(error => {
    throw error;
  });

  res.end();

  return new Response(JSON.stringify({success: `candidate endorsement updated!`}), {status: 200});

};