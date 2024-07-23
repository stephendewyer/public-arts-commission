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


export const POST = async ({request}) => {

  if (request.method !== 'POST') {

    return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});

  };

  let electedINT = 0;
  let pendingElectionINT = 0;
  let rejectedINT = 0;

  const data = await request.json();

  const { 
    userEmail,
    image,
    imageFileName,
    imageAltText,
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
    !imageFileName ||
    !imageAltText ||
    !referendumName ||
    !startingYearIfEnacted ||
    !electionDate ||
    !governmentLevel ||
    !details 
  ) {

    return new Response(JSON.stringify({error: "missing form data!"}), {status: 422});

  };
  
  GovernmentLevelValidation(governmentLevel, state, county, city);

  if ((ImageFileExtensionTest(imageFileName) === "false") ) {

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

  // insert the referendum information into the endorsed_referendums table

  const insertEndorsedReferendumInformationStatement = `INSERT INTO endorsed_referendums (
    image_ID,
    referendum_name,
    starting_year_if_enacted,
    election_date,
    government_level,
    state,
    county,
    city,
    website_URL,
    details,
    elected,
    rejected,
    pending_election,
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
    "${htmlEntities(referendumName)}",
    "${startingYearIfEnacted}",
    "${electionDate}",
    "${htmlEntities(governmentLevel)}",
    "${htmlEntities(state)}",
    "${htmlEntities(county)}",
    "${htmlEntities(city)}",
    "${htmlEntities(websiteURL)}",
    "${htmlEntities(details)}",
    "${electedINT}",
    "${rejectedINT}",
    "${pendingElectionINT}",
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

  await res.query(insertEndorsedReferendumInformationStatement)
  .then(() => {
    console.log(`referendum endorsement information for ${referendumName} created`);
  })
  .catch(error => {
    throw error;
  });

  res.end();

  return new Response(JSON.stringify({success: `referendum endorsement created!`}), {status: 200});

};