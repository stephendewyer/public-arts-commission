import { mysqlConnection } from "$lib/server/db/mysql";
import { ImageFileExtensionTest } from "$lib/utils/ImageFileExtensionTest.js";
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARYCLOUDNAME } from "$env/static/private";
import { CLOUDINARYSECRETKEY } from "$env/static/private";
import { CLOUDINARYAPIKEY } from "$env/static/private";
import { GovernmentLevelValidation } from "$lib/utils/GovernmentLevelValidation.js";

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
    rejectedPrimaryProceedingGeneral,
    runningInPrimary,
    electedPrimaryElectedGeneral,
    electedPrimaryProceedingGeneral,
    electedInPrimaryRejectedInGeneral,
    rejectedInPrimaryCampaignEnded,
    rejectedInPrimaryRejectedInGeneral,
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
  let electedPrimaryElectedGeneralINT = 0;
  let electedPrimaryProceedingGeneralINT = 0;
  let rejectedPrimaryProceedingGeneralINT = 0;
  let electedInPrimaryRejectedInGeneralINT = 0;
  let rejectedInPrimaryCampaignEndedINT = 0;
  let rejectedInPrimaryRejectedInGeneralINT = 0;

  if (electedInPrimaryRejectedInGeneral) {

    electedInPrimaryRejectedInGeneralINT = 1;

  };

  if (rejectedInPrimaryCampaignEnded) {

    rejectedInPrimaryCampaignEndedINT = 1;

  };


  if (rejectedInPrimaryRejectedInGeneral) {

    rejectedInPrimaryRejectedInGeneralINT = 1;

  };

  if (runningInPrimary) {

    runningInPrimaryINT = 1;

  };

  if (electedPrimaryElectedGeneral) {

    electedPrimaryElectedGeneralINT = 1;

  };

  if (electedPrimaryProceedingGeneral) {

    electedPrimaryProceedingGeneralINT = 1;

  };

  if (rejectedPrimaryProceedingGeneral) {

    rejectedPrimaryProceedingGeneralINT = 1;

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
	elected_in_primary_and_general,
	elected_in_primary_proceeding_general,
	rejected_in_primary_proceeding_general,
	contact_name_first,
	contact_name_last,
	contact_phone_number,
	contact_street_address,
	contact_street_address_02,
	contact_city,
	contact_state,
	contact_zip_code,
	contact_email,
	elected_in_primary_rejected_in_general,
    rejected_in_primary_campaign_ended,
    rejected_in_primary_rejected_in_general,
	electorate
  ) VALUES (
    "${imageID}",
    "${campaignName}",
    "${yearOfficeSought}",
    "${electionDatePrimary}",
    "${electionDateGeneral}",
    "${governmentLevel}",
    "${state}",
    "${county}",
    "${city}",
    "${party}",
    "${websiteURL}",
    "${runningInPrimaryINT}",
    "${electedPrimaryElectedGeneralINT}",
    "${electedPrimaryProceedingGeneralINT}",
    "${rejectedPrimaryProceedingGeneralINT}",
    "${nameFirstContact}",
    "${nameLastContact}",
    "${phoneContact}",
    "${streetAddressContact}",
    "${streetAddress02Contact}",
    "${cityContact}",
    "${stateContact}",
    "${zipCodeContact}",
    "${emailContact}",
    "${electedInPrimaryRejectedInGeneralINT}",
    "${rejectedInPrimaryCampaignEndedINT}",
    "${rejectedInPrimaryRejectedInGeneralINT}",
    "${electorate}"    
  )`;

  await res.query(insertEndorsedCandidateInformationStatement)
  .then(() => {
    console.log(`candidate endorsement information for ${campaignName} created`);
  })
  .catch(error => {
    throw error;
  });

  return new Response(JSON.stringify({success: `candidate endorsement created!`}), {status: 200});

}