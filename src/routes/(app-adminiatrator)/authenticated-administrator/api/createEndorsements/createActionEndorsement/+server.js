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


export const POST = async ({request}) => {

  if (request.method !== 'POST') {

    return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});

  };

  const data = await request.json();

  const { 
    userEmail,
    imageFile,
    imageAltText,
    image,
    actionName,
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
    !imageFile ||
    !imageAltText ||
    !actionName ||
    !actionStartDate ||
    !actionEndDate ||
    !governmentLevel||
    !details
  ) {

    return new Response(JSON.stringify({error: "missing form data!"}), {status: 422});

  };

  if ((ImageFileExtensionTest(imageFile) === "false") ) {

    return new Response(JSON.stringify({error: "invalid image file!"}), {status: 422});

  };

  if (!image) {

    return new Response(JSON.stringify({error: "missing image!"}), {status: 422});

  };

  // upload image to Cloudinary

  let uploadedImageURL;

  try {

    const uploadImageResponse = await cloudinary.uploader.upload(image, {});

    uploadedImageURL = uploadImageResponse.secure_url;

  } catch (err) {

    console.log(err);

    return new Response(JSON.stringify({error: "problem with the image upload to Cloudinary"}), {status: 500});

  };
  

  // connect to the database
  
  let res = await mysqlConnection();

  // insert image URL, admin_ID and image alt text into image_collection

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

  const insertImageStatement = `INSERT INTO image_collection (
    admin_ID, 
    image_URL,
    alt_text
  ) VALUES (
    "${adminID}", 
    "${uploadedImageURL}",
    "${imageAltText}"
  )`;

  let imageID;

  // insert the image_URL and adminID into the image_collection table and get the image_ID
  await res.query(insertImageStatement)
  .then(([ rows ]) => {
    const rowsJSON = JSON.parse(JSON.stringify(rows));
    imageID = rowsJSON.insertId;
  })
  .catch(error => {
    throw error;
  });

  // insert the action information into the endorsed_actions table

  const insertEndorsedActionInformationStatement = `INSERT INTO endorsed_actions (
    image_ID,
	action_name,
	date_start,
	date_end,
	time_start,
	time_end,
	time_zone,
	action_street_address,
	action_street_address_02,
	action_city,
	action_state,
	action_zip_code,
	government_level,
	website_URL,
	details,
	contact_name_first,
	contact_name_last,
	contact_phone_number,
	contact_street_address,
	contact_street_address_02,
	contact_city,
	contact_state,
	contact_zip_code,
	contact_email
  ) VALUES (
    "${imageID}",
    "${actionName}",
    "${actionStartDate}",
    "${actionEndDate}",
    "${startTime}",
    "${endTime}",
    "${timeZone}",
    "${actionStreetAddress}",
    "${actionStreetAddress02}",
    "${actionCity}",
    "${actionState}",
    "${actionZipCode}",
    "${governmentLevel}",
    "${websiteURL}",
    "${details}",
    "${nameFirstContact}",
    "${nameLastContact}",
    "${phoneContact}",
    "${streetAddressContact}",
    "${streetAddress02Contact}",
    "${cityContact}",
    "${stateContact}",
    "${zipCodeContact}",
    "${emailContact}"
  )`;

  await res.query(insertEndorsedActionInformationStatement)
  .then(() => {
    console.log(`action endorsement information for ${actionName} created`);
  })
  .catch(error => {
    throw error;
  });

  res.end();

  return new Response(JSON.stringify({success: `action endorsement created!`}), {status: 200});

};