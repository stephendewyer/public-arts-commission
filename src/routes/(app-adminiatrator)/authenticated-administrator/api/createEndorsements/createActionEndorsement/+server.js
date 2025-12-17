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
    !imageFile ||
    !imageAltText ||
    !actionName ||
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

  let allDayActionINT = 0;

  if (allDayAction) {

    allDayActionINT = 1;

  };

  // check if image is the same as image already in database

  

  // upload image to Cloudinary

  let uploadedImageURL;

  let uploadedImagePublicID;

  try {

    const uploadImageResponse = await cloudinary.uploader.upload(image, {});

    uploadedImageURL = uploadImageResponse.secure_url;

    uploadedImagePublicID = uploadImageResponse.public_id;

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
    alt_text,
    public_ID
  ) VALUES (
    "${adminID}", 
    "${uploadedImageURL}",
    "${htmlEntities(imageAltText)}",
    "${uploadedImagePublicID}"
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
    all_day_event,
    all_day_event_date,
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
    "${htmlEntities(actionName)}",
    "${allDayActionINT}",
    "${allDayActionDate}",
    "${actionStartDate}",
    "${actionEndDate}",
    "${startTime}",
    "${endTime}",
    "${htmlEntities(timeZone)}",
    "${htmlEntities(actionStreetAddress)}",
    "${htmlEntities(actionStreetAddress02)}",
    "${htmlEntities(actionCity)}",
    "${htmlEntities(actionState)}",
    "${actionZipCode}",
    "${htmlEntities(governmentLevel)}",
    "${htmlEntities(websiteURL)}",
    "${htmlEntities(details)}",
    "${htmlEntities(nameFirstContact)}",
    "${htmlEntities(nameLastContact)}",
    "${phoneContact}",
    "${htmlEntities(streetAddressContact)}",
    "${htmlEntities(streetAddress02Contact)}",
    "${htmlEntities(cityContact)}",
    "${htmlEntities(stateContact)}",
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