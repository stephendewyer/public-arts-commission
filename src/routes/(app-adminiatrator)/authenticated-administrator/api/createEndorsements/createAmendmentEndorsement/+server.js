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
    amendmentName,
    yearReleased,
    yearIntroducedInHouse,
    yearIntroducedInSenate,
    electionDate,
    governmentLevel,
    state,
    county,
    city,
    introducedInHouse,
    introducedInSenate,
    houseSession,
    senateSession,
    sponsorHouse,
    sponsorSenate,
    coSponsorsHouse,
    coSponsorsSenate,
    details,
    websiteURL,
    twoThirdsHouseAndSenatePassed,
    simpleMajorityHouseAndSenatePassed,
    simpleMajorityVotersPassed,
    ratifiedByStateLegislatures,
    ratifiedByStateConventions,
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
    !amendmentName ||
    !yearReleased ||
    !governmentLevel ||
    !details 
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
  let introducedInHouseINT = 0;
  let introducedInSenateINT = 0;
  let twoThirdsHouseAndSenatePassedINT = 0;
  let simpleMajorityHouseAndSenatePassedINT = 0;
  let simpleMajorityVotersPassedINT = 0;
  let ratifiedByStateLegislaturesINT = 0;
  let ratifiedByStateConventionsINT = 0;

  if (introducedInHouse) {

    introducedInHouseINT = 1;

  };

  if (introducedInSenate) {

    introducedInSenateINT = 1;

  };

  if (twoThirdsHouseAndSenatePassed) {

    twoThirdsHouseAndSenatePassedINT = 1;

  };

  if (simpleMajorityHouseAndSenatePassed) {

    simpleMajorityHouseAndSenatePassedINT = 1;

  };

  if (simpleMajorityVotersPassed) {

    simpleMajorityVotersPassedINT = 1;

  };

  if (ratifiedByStateLegislatures) {

    ratifiedByStateLegislaturesINT = 1;

  };

  if (ratifiedByStateConventions) {

    ratifiedByStateConventionsINT = 1;

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

  // insert the amendment information in the endorsed_amendments table

  /**
     * @type {any}
     */
  let amendmentID;

  const insertEndorsedAmendmentInformationStatement = `INSERT INTO endorsed_amendments (
    image_ID,
    amendment_name,
    year_released,
    year_introduced_House,
    year_introduced_Senate,
    election_date,
    government_level,
    state,
    county,
    city,
    website_URL,
    details,
    introduced_in_House,
    introduced_in_Senate,
    session_House,
    session_Senate,
    twothirds_House_and_Senate_passed,
    simple_majority_House_and_Senate_passed,
    simple_majority_voters_passed,
    ratified_by_state_convenctions,
    ratified_by_state_legislatures,
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
    "${htmlEntities(amendmentName)}",
    "${yearReleased}",
    "${yearIntroducedInHouse}",
    "${yearIntroducedInSenate}",
    "${electionDate}",
    "${htmlEntities(governmentLevel)}",
    "${htmlEntities(state)}",
    "${htmlEntities(county)}",
    "${htmlEntities(city)}",
    "${htmlEntities(websiteURL)}",
    "${htmlEntities(details)}",
    "${introducedInHouseINT}",
    "${introducedInSenateINT}",
    "${houseSession}",
    "${senateSession}",
    "${twoThirdsHouseAndSenatePassedINT}",
    "${simpleMajorityHouseAndSenatePassedINT}",
    "${simpleMajorityVotersPassedINT}",
    "${ratifiedByStateConventionsINT}",
    "${ratifiedByStateLegislaturesINT}",
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

  await res.query(insertEndorsedAmendmentInformationStatement)
  .then(([ rows ]) => {
    const rowsJSON = JSON.parse(JSON.stringify(rows));
    amendmentID = rowsJSON.insertId;
    console.log(`amendment endorsement information for ${amendmentName} created`);
  })
  .catch(error => {
    throw error;
  });

  // insert the House sponsor into the sponsors_House table

  if (sponsorHouse) {

    const insertHouseSponsorStatement = `INSERT INTO sponsors_House (
      sponsored_amendment_ID, 
      sponsor_name
    ) VALUES ("${amendmentID}", "${htmlEntities(sponsorHouse)}")`;

    await res.query(insertHouseSponsorStatement)
    .then(() => {
        console.log(`added amendment House sponsor`);
    })
    .catch(error => {
        throw error;
    });

  };

  // insert the Senate sponsor into the sponsors_Senate table

  if (sponsorSenate) {

    const insertSenateSponsorStatement = `INSERT INTO sponsors_Senate (
      sponsored_amendment_ID, 
      sponsor_name
    ) VALUES ("${amendmentID}", "${htmlEntities(sponsorSenate)}")`;

    await res.query(insertSenateSponsorStatement)
    .then(() => {
        console.log(`added amendment Senate sponsor`);
    })
    .catch(error => {
        throw error;
    });

  };

    // insert the House co-sponsors into the co_sponsors_House table

    if (coSponsorsHouse[0].co_sponsor) {

      let coSponsorsHouseValues = "";

      coSponsorsHouse.forEach((/** @type {any} */ coSponsorObj) => {

        coSponsorsHouseValues = (coSponsorsHouseValues.concat(`("${amendmentID}", "${htmlEntities(coSponsorObj.co_sponsor)}"),`))

      });

      const insertHouseCoSponsorsStatement = `INSERT INTO co_sponsors_House (
          co_sponsored_amendment_ID, 
          co_sponsor_name
      ) VALUES ${coSponsorsHouseValues.slice(0, -1)}`;

      await res.query(insertHouseCoSponsorsStatement)
      .then(() => {
          console.log(`added amendment House co-sponsors`);
      })
      .catch(error => {
          throw error;
      });

    };

    // insert the Senate sponsors into the sponsors_Senate table

    if (coSponsorsSenate[0].co_sponsor) {

      let coSponsorsSenateValues = "";

      coSponsorsSenate.forEach((/** @type {any} */ coSponsorObj) => {

          coSponsorsSenateValues = (coSponsorsSenateValues.concat(`("${amendmentID}", "${htmlEntities(coSponsorObj.co_sponsor)}"),`))

      });

      const insertSenateCoSponsorsStatement = `INSERT INTO co_sponsors_Senate (
          co_sponsored_amendment_ID, 
          co_sponsor_name
      ) VALUES ${coSponsorsSenateValues.slice(0, -1)}`;

      await res.query(insertSenateCoSponsorsStatement)
      .then(() => {
          console.log(`added amendment Senate co-sponsors`);
      })
      .catch(error => {
          throw error;
      });

    };

    res.end();

    return new Response(JSON.stringify({success: `amendment endorsement created!`}), {status: 200});

};