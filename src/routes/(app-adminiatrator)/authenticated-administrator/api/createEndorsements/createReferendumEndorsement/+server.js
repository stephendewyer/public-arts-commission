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
  
  if (governmentLevel === "state" && state === "") {

    return new Response(JSON.stringify({error: "state value missing for government level of state!"}), {status: 422});

  } else if (governmentLevel === "county" && county === "" && state !== "") {

    return new Response(JSON.stringify({error: "county value missing for government level of county!"}), {status: 422});

  } else if (governmentLevel === "county" && county === "" && state === "") {

    return new Response(JSON.stringify({error: "county and state values missing for government level of county!"}), {status: 422});

  } else if (governmentLevel === "county" && county !== "" && state === "") {

    return new Response(JSON.stringify({error: "state value missing for government level of county!"}), {status: 422});

  } else if (governmentLevel === "city" && city !== "" && county !== "" && state === "") {

    return new Response(JSON.stringify({error: "state value missing for government level of city!"}), {status: 422});
    
  } else if (governmentLevel === "city" && city !== "" && county === "" && state === "") {

    return new Response(JSON.stringify({error: "state and county values missing for government level of city!"}), {status: 422});
    
  } else if (governmentLevel === "city" && city === "" && county === "" && state === "") {

    return new Response(JSON.stringify({error: "state, county and city values missing for government level of city!"}), {status: 422});
    
  } else if (governmentLevel === "city" && city === "" && county === "" && state !== "") {

    return new Response(JSON.stringify({error: "county and city values missing for government level of city!"}), {status: 422});
    
  } else if (governmentLevel === "city" && city === "" && county !== "" && state !== "") {

    return new Response(JSON.stringify({error: "city value missing for government level of city!"}), {status: 422});
    
  } else if (governmentLevel === "city" && city !== "" && county === "" && state !== "") {

    return new Response(JSON.stringify({error: "county value missing for government level of city!"}), {status: 422});
    
  };

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

  const insertReferendumImageStatement = `INSERT INTO image_collection (
    admin_ID, 
    image_URL,
    alt_text
  ) VALUES (
    "${adminID}", 
    "${uploadedImageURL}",
    "${imageAltText}"
  )`;

  let imageID;

  // insert the user into users_campaigns table and get the user_ID
  await res.query(insertReferendumImageStatement)
  .then(([ rows ]) => {
    const rowsJSON = JSON.parse(JSON.stringify(rows));
    imageID = rowsJSON.insertId;
  })
  .catch(error => {
    throw error;
  });

  // insert the campaign information in the campaign_information table

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
    "${referendumName}",
    "${startingYearIfEnacted}",
    "${electionDate}",
    "${governmentLevel}",
    "${state}",
    "${county}",
    "${city}",
    "${websiteURL}",
    "${details}",
    "${electedINT}",
    "${rejectedINT}",
    "${pendingElectionINT}",
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

  await res.query(insertEndorsedReferendumInformationStatement)
  .then(() => {
    console.log(`referendum endorsement information for ${referendumName} created`);
  })
  .catch(error => {
    throw error;
  });

  return new Response(JSON.stringify({success: `referendum endorsement created!`}), {status: 200});

}