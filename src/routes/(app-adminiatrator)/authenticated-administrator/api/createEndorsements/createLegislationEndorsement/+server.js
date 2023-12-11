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

  let passedInHouseINT = 0;
  let passedInSenateINT = 0;
  let rejectedByHouseINT = 0;
  let rejectedBySenateINT = 0;
  let vetoedByExecutiveINT = 0;
  let ExecutiveSignedIntoLawINT = 0;

  const data = await request.json();

  console.log(data);

  const { 
    userEmail,
    imageFile,
    imageAltText,
    image,
    legislationTitle,
    yearReleased,
    yearIntroducedInHouse,
    yearIntroducedInSenate,
    governmentLevel,
    state,
    county,
    city,
    websiteURL,
    details,
    introducedInHouse,
    introducedInSenate,
    sponsorsHouse,
    sponsorsSenate,
    houseSession,
    senateSession,
    passedInHouse,
    passedInSenate,
    rejectedByHouse,
    rejectedBySenate,
    vetoedByExecutive,
    ExecutiveSignedIntoLaw,
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
    !legislationTitle ||
    !yearReleased ||
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

  if ((ImageFileExtensionTest(imageFile) === "false") ) {

    return new Response(JSON.stringify({error: "invalid image file!"}), {status: 422});

  };

  if (!image) {

    return new Response(JSON.stringify({error: "missing image!"}), {status: 422});

  };

  if (passedInHouse) {

    passedInHouseINT = 1;

  };

  if (passedInSenate) {

    passedInSenateINT = 1;

  };

  if (rejectedByHouse) {

    rejectedByHouseINT = 1;

  };

  if (rejectedBySenate) {

    rejectedBySenateINT = 1;

  };

  if (vetoedByExecutive) {

    vetoedByExecutiveINT = 1;

  };

  if (ExecutiveSignedIntoLaw) {

    ExecutiveSignedIntoLawINT = 1;

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

  // insert the campaign information in the endorsed_legislation table

  /**
     * @type {any}
     */
  let legislationID;

  const insertEndorsedRLegislationInformationStatement = `INSERT INTO endorsed_legislation (
    image_ID,
	legislation_name,
	year_released,
	year_introduced_House,
	year_introduced_Senate,
	government_level,
	state,
	county,
	city,
	website_URL,
	details,
	session_House,
	session_Senate,
	passed_in_House,
	passed_in_Senate,
	rejected_in_House,
	rejected_in_Senate,
	vetoed_by_Executive,
	signed_by_Executive,
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
    "${legislationTitle}",
    "${yearReleased}",
    "${yearIntroducedInHouse}",
    "${yearIntroducedInSenate}",
    "${governmentLevel}",
    "${state}",
    "${county}",
    "${city}",
    "${websiteURL}",
    "${details}",
    "${houseSession}",
    "${senateSession}",
    "${passedInHouseINT}",
    "${passedInSenateINT}",
    "${rejectedByHouseINT}",
    "${rejectedBySenateINT}",
    "${vetoedByExecutiveINT}",
    "${ExecutiveSignedIntoLawINT}",
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

  await res.query(insertEndorsedRLegislationInformationStatement)
  .then(([ rows ]) => {
    const rowsJSON = JSON.parse(JSON.stringify(rows));
    legislationID = rowsJSON.insertId;
    console.log(`legislation endorsement information for ${legislationTitle} created`);
  })
  .catch(error => {
    throw error;
  });

    // insert the House sponsors into the sponsors_House table

    let sponsorsHouseValues = "";

    sponsorsHouse.forEach((/** @type {any} */ sponsorObj) => {

        sponsorsHouseValues = (sponsorsHouseValues.concat(`("${legislationID}", "${sponsorObj.sponsor}"),`))

    });

    const insertHouseSponsorsStatement = `INSERT INTO sponsors_House (
        sponsored_legislation_ID, 
        sponsor_name
    ) VALUES ${sponsorsHouseValues.slice(0, -1)}`;

    await res.query(insertHouseSponsorsStatement)
    .then(() => {
        console.log(`added legislation House sponsors`);
    })
    .catch(error => {
        throw error;
    });

    // insert the Senate sponsors into the sponsors_Senate table

    let sponsorsSenateValues = "";

    sponsorsSenate.forEach((/** @type {any} */ sponsorObj) => {

        sponsorsSenateValues = (sponsorsSenateValues.concat(`("${legislationID}", "${sponsorObj.sponsor}"),`))

    });

    const insertSenateSponsorsStatement = `INSERT INTO sponsors_Senate (
        sponsored_legislation_ID, 
        sponsor_name
    ) VALUES ${sponsorsSenateValues.slice(0, -1)}`;

    await res.query(insertSenateSponsorsStatement)
    .then(() => {
        console.log(`added legislation Senate sponsors`);
    })
    .catch(error => {
        throw error;
    });

    return new Response(JSON.stringify({success: `legislation endorsement created!`}), {status: 200});

}