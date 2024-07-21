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
        campaignApplicationID,
        campaignUserID,
        imageID,
        imagePublicID,
        imageFile,
        imageAltText,
        image,
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
        authorizedRepresentative
    } = data;

    if (
        !imageAltText ||
        !campaignName ||
        !electorate ||
        !yearOfficeSought ||
        !electionDateGeneral ||
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

    if (authorizedRepresentative) {

        authorizedRepresentative = 1;

    };

    // upload image to Cloudinary

    let uploadedImageURL;

    let uploadedImagePublicID;

    // connect to the database
    
    let res = await mysqlConnection();

    // if local image file:
    
    if (imageFile) {

        // delete the image associated with the action from Cloudinary and update the image row if any 

        if (imageID) {

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

            // insert image URL, campaign_ID and image alt text into image_collection  

            const updateImageStatement = `UPDATE image_collection
            SET
                campaign_ID = "${campaignUserID}", 
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

        } else if (!imageID) {

            // upload image to Cloudinary

            try {

                const uploadImageResponse = await cloudinary.uploader.upload(image, {});

                uploadedImageURL = uploadImageResponse.secure_url;

                uploadedImagePublicID = uploadImageResponse.public_id;


            } catch (err) {

                console.log(err);

                return new Response(JSON.stringify({error: "problem with the image upload to Cloudinary"}), {status: 500});

            };

            // create the image row for the added image

            const insertImageStatement = `INSERT INTO image_collection (
                campaign_ID, 
                image_URL,
                alt_text,
                public_ID
            ) VALUES (
                "${campaignUserID}", 
                "${uploadedImageURL}",
                "${htmlEntities(imageAltText)}",
                "${uploadedImagePublicID}"
            )`;

            // insert the image_URL and adminID into the image_collection table and get the image_ID
            await res.query(insertImageStatement)
            .then(([ rows ]) => {
                const rowsJSON = JSON.parse(JSON.stringify(rows));
                imageID = rowsJSON.insertId;
            })
            .catch(error => {
                throw error;
            });

        };
        
    };

    // update the campaign registration information in the campaign_applications table

    const updateCampaignApplicationRegistrationStatement = `UPDATE campaign_applications 
        SET
            image_ID = "${imageID}",
            campaign_name = "${htmlEntities(campaignName)}",
            starting_year_for_office_sought = "${yearOfficeSought}",
            primary_election_date = "${electionDatePrimary}",
            general_election_date = "${electionDateGeneral}",
            government_level = "${htmlEntities(governmentLevel)}",
            state = "${htmlEntities(state)}",
            county = "${htmlEntities(county)}",
            city = "${htmlEntities(city)}",
            party = "${htmlEntities(party)}",
            website_URL = "${htmlEntities(websiteURL)}",
            electorate = "${htmlEntities(electorate)}",
            authorized_campaign_representative = "${authorizedRepresentative}"
        WHERE campaign_application_ID = "${campaignApplicationID}"
    `;

    await res.query(updateCampaignApplicationRegistrationStatement)
    .then(() => {
        console.log(`campaign registration for ${campaignName} updated`);
    })
    .catch(error => {
        throw error;
    });

    res.end();

    return new Response(JSON.stringify({success: {
        message: `campaign registration for ${campaignName} updated!`,
        campaign_application_ID: campaignApplicationID
    }}), {status: 200});

};