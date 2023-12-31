import { mysqlConnection } from "$lib/server/db/mysql";
import { ImageFileExtensionTest } from "$lib/utils/ImageFileExtensionTest.js";
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARYCLOUDNAME } from "$env/static/private";
import { CLOUDINARYSECRETKEY } from "$env/static/private";
import { CLOUDINARYAPIKEY } from "$env/static/private";

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
        actionID,
        imageID,
        imageFile,
        imagePublicID,
        imageAltText,
        image,
        actionName,
        allDayAction,
        allDayActionDate,
        actionStartDate,
        actionEndDate,
        startTime,
        endTime,
        timeZone,
        actionStreetAddress,
        actionStreetAddress02,
        actionCity,
        actionState,
        actionZipCode,
        governmentLevel,
        websiteURL,
        details,
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
        !actionName ||
        !governmentLevel||
        !details
    ) {

        return new Response(JSON.stringify({error: "missing form data!"}), {status: 422});

    };

    if (imageFile && (ImageFileExtensionTest(imageFile) === "false") ) {

        return new Response(JSON.stringify({error: "invalid image file!"}), {status: 422});

    };

    if (!image) {

        return new Response(JSON.stringify({error: "missing image!"}), {status: 422});

    };

    let allDayActionINT = 0;

    if (allDayAction) {

        allDayActionINT = 1;

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
            alt_text = "${imageAltText}",
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

  // update the action information into the endorsed_actions table

    const updateEndorsedActionInformationStatement = `UPDATE endorsed_actions 
        SET
            action_name = "${actionName}",
            all_day_event = "${allDayActionINT}",
            all_day_event_date = "${allDayActionDate}",
            date_start = "${actionStartDate}",
            date_end = "${actionEndDate}",
            time_start = "${startTime}",
            time_end = "${endTime}",
            time_zone = "${timeZone}",
            action_street_address = "${actionStreetAddress}",
            action_street_address_02 = "${actionStreetAddress02}",
            action_city = "${actionCity}",
            action_state = "${actionState}",
            action_zip_code = "${actionZipCode}",
            government_level = "${governmentLevel}",
            website_URL = "${websiteURL}",
            details = "${details}",
            contact_name_first = "${nameFirstContact}",
            contact_name_last = "${nameLastContact}",
            contact_phone_number = "${phoneContact}",
            contact_street_address = "${streetAddressContact}",
            contact_street_address_02 = "${streetAddress02Contact}",
            contact_city = "${cityContact}",
            contact_state = "${stateContact}",
            contact_zip_code = "${zipCodeContact}",
            contact_email = "${emailContact}"
        WHERE action_ID = "${actionID}"
    `;

  await res.query(updateEndorsedActionInformationStatement)
  .then(() => {
    console.log(`action endorsement information for ${actionName} updated`);
  })
  .catch(error => {
    throw error;
  });

  res.end();

  return new Response(JSON.stringify({success: `action endorsement updated!`}), {status: 200});

};