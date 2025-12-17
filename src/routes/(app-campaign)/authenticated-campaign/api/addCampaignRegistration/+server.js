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
    authorizedRepresentative
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

  let authorizedCampaignRepresentativeINT;

    if (authorizedRepresentative === false) {

        authorizedCampaignRepresentativeINT = 0;

        return new Response(JSON.stringify({error: "only authorized representatives of a campaign can submit an application on behalf of a campaign"}))
  
    } else if (authorizedRepresentative === true) {

        authorizedCampaignRepresentativeINT = 1;

    };
  
  GovernmentLevelValidation(governmentLevel, state, county, city);

  if ((ImageFileExtensionTest(imageFile) === "false") ) {

    return new Response(JSON.stringify({error: "invalid image file!"}), {status: 422});

  };

  if (!image) {

    return new Response(JSON.stringify({error: "missing image!"}), {status: 422});

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

  const getCampaignUserRowQuery = `SELECT user_ID FROM users_campaigns WHERE email = '${userEmail}'`;

  /**
   * @type {{ ID: number; }[]}
   */
  let campaignUserID = [];

  await res.query(getCampaignUserRowQuery)
  .then(([ rows ]) => {

    campaignUserID = JSON.parse(JSON.stringify(rows))[0].user_ID;

  })
  .catch(error => {

      throw error;

  });

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

  const insertCampaignInformationStatement = `INSERT INTO campaign_applications (
    user_ID,
    image_ID,
    campaign_name,
    starting_year_for_office_sought,
    primary_election_date,
    general_election_date,
    government_level,
    state,
    county,
    city,
    party,
    website_URL,
    electorate,
    authorized_campaign_representative,
    campaign_registered
  ) VALUES (
    "${campaignUserID}",
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
    "${htmlEntities(electorate)}",
    "${authorizedCampaignRepresentativeINT}",
    "${1}"
  )`;

  let campaignApplicationID;

  await res.query(insertCampaignInformationStatement)
  .then(([rows]) => {
    console.log(`campaign registration completed for ${campaignName}`);
    const rowsJSON = JSON.parse(JSON.stringify(rows));
    campaignApplicationID = rowsJSON.insertId;
  })
  .catch(error => {
    throw error;
  });

  res.end();

  return new Response(JSON.stringify({success: {
    message: `campaign registration completed for ${campaignName}`,
    campaign_application_ID: campaignApplicationID
  }}), {status: 200});

};