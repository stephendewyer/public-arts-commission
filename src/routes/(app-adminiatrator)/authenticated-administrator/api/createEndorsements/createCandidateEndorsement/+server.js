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

  const data = await request.json();

  const { 
    userEmail,
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
    !imageFile ||
    !imageAltText ||
    !campaignName ||
    !electorate ||
    !yearOfficeSought ||
    !electionDateGeneral ||
    !governmentLevel
  ) {

    return new Response(JSON.stringify({error: "missing form data!"}), {status: 422});

  };
  
  GovernmentLevelValidation(governmentLevel, state, county, city);

  if ((ImageFileExtensionTest(imageFile) === "false") ) {

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

  try {

    const uploadImageResponse = await cloudinary.uploader.upload(image, {});

    uploadedImageURL = uploadImageResponse.secure_url;

    uploadedImagePublicID = uploadImageResponse.public_id;


  } catch (err) {

    console.log(err);

    return new Response(JSON.stringify({error: "problem with the image upload to Cloudinary"}), {status: 500});

  };

  // console.log(uploadedImagePublicID)

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

  // insert the candidate information into the endorsed_candidates table

  const insertEndorsedCandidateInformationStatement = `INSERT INTO endorsed_candidates (
    image_ID,
    campaign_name,
    office_sought_starting_year,
    election_date_primary,
    election_date_general,
    government_level,
    state,
    county,
    city,
    party,
    website_URL,
    running_in_primary,
    elected_in_primary,
    rejected_in_primary,
    running_in_general,
    elected_in_general,
    rejected_in_general,
    campaign_ended,
    contact_name_first,
    contact_name_last,
    contact_phone_number,
    contact_street_address,
    contact_street_address_02,
    contact_city,
    contact_state,
    contact_zip_code,
    contact_email,
    electorate
  ) VALUES (
    "${imageID}",
    "${htmlEntities(campaignName)}",
    "${yearOfficeSought}",
    "${electionDatePrimary}",
    "${electionDateGeneral}",
    "${htmlEntities(governmentLevel)}",
    "${htmlEntities(state)}",
    "${htmlEntities(county)}",
    "${htmlEntities(city)}",
    "${htmlEntities(party)}",
    "${htmlEntities(websiteURL)}",
    "${runningInPrimaryINT}",
    "${electedInPrimaryINT}",
    "${rejectedInPrimaryINT}",
    "${runningInGeneralINT}",
    "${electedInGeneralINT}",
    "${rejectedInGeneralINT}",
    "${campaignEndedINT}",
    "${htmlEntities(nameFirstContact)}",
    "${htmlEntities(nameLastContact)}",
    "${phoneContact}",
    "${htmlEntities(streetAddressContact)}",
    "${htmlEntities(streetAddress02Contact)}",
    "${htmlEntities(cityContact)}",
    "${htmlEntities(stateContact)}",
    "${zipCodeContact}",
    "${emailContact}",
    "${htmlEntities(electorate)}"    
  )`;

  await res.query(insertEndorsedCandidateInformationStatement)
  .then(() => {
    console.log(`candidate endorsement information for ${campaignName} created`);
  })
  .catch(error => {
    throw error;
  });

  res.end();

  return new Response(JSON.stringify({success: `candidate endorsement created!`}), {status: 200});

};