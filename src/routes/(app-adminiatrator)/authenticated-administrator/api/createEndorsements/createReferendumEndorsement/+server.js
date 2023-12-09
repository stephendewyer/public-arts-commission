// import { mysqlConnection } from "$lib/server/db/mysql";

export async function POST({request}) {

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});
  }

  console.log(request)

//   let authorizedRepresentativeINT = 0;

  // const data = await request.json();

  // console.log(data);

  // const { 
  //   imageFile,
  //   imageAltTextInputValue,
  //   image,
  //   referendumName,
  //   startingYearIfEnacted,
  //   electionDate,
  //   governmentLevel,
  //   state,
  //   county,
  //   city,
  //   websiteURL,
  //   details,
  //   elected,
  //   rejected,
  //   pendingElection,
  //   nameFirstContact,
  //   nameLastContact,
  //   phoneContact,
  //   streetAddressContact,
  //   streetAddress02Contact,
  //   cityContact,
  //   stateContact,
  //   zipCodeContact,
  //   emailContact
  // } = data;

//   if (
//     !campaignName ||
//     !electorate ||
//     !party ||
//     !primaryElectionDate ||
//     !generalElectionDate ||
//     !nameFirst ||
//     !nameLast ||
//     !phoneNumber ||
//     !streetAddress ||
//     !city ||
//     !state ||
//     !zipCode ||
//     !email ||
//     !password ||
//     !reenteredPassword
//   ) {

//     return new Response(JSON.stringify({error: "missing form data!"}), {status: 422});

//   } else if (!email.includes('@')) {

//     return new Response(JSON.stringify({error: "missing an @ symbol in email address!"}), {status: 422});

//   } else if (password !== reenteredPassword) {

//     return new Response(JSON.stringify({error: "passwords do not match!"}), {status: 422});

//   } else if (!authorizedRepresentative) {

//     return new Response(JSON.stringify({error: "cannot create account for unauthorized campaign representative!"}), {status: 422});

//   } else if (authorizedRepresentative) {

//     authorizedRepresentativeINT = 1;

//   };

  
//   let res = await mysqlConnection();

//   // if email and campaign name are new, create the campaign user account

//   const insertCampaignUserStatement = `INSERT INTO users_campaigns (email, password) VALUES ("${email}", "${hashedPassword}")`;

//   let campaignUserID;

//   // insert the user into users_campaigns table and get the user_ID
//   await res.query(insertCampaignUserStatement)
//   .then(([ rows ]) => {
//     const rowsJSON = JSON.parse(JSON.stringify(rows));
//     campaignUserID = rowsJSON.insertId;
//   })
//   .catch(error => {
//     throw error;
//   });

//   // insert the campaign information in the campaign_information table

//   const insertCampaignInformationStatement = `INSERT INTO campaign_information (
//     user_ID,
//     campaign_name,
//     electorate,
//     party,
//     primary_election_date,
//     general_election_date,
//     name_first,
//     name_last,
//     phone_number,
//     street_address,
//     street_address_02,
//     city,
//     state,
//     zip_code,
//     authorized_campaign_representative,
//     website_URL
//   ) VALUES (
//     "${campaignUserID}",
//     "${campaignName}",
//     "${electorate}",
//     "${party}",
//     "${primaryElectionDate}",
//     "${generalElectionDate}",
//     "${nameFirst}",
//     "${nameLast}",
//     "${phoneNumber}",
//     "${streetAddress}",
//     "${streetAddress02}",
//     "${city}",
//     "${state}",
//     "${zipCode}",
//     "${authorizedRepresentativeINT}",
//     "${websiteURL}"
//   )`;

//   await res.query(insertCampaignInformationStatement)
//   .then(() => {
//     console.log(`campaign information for ${campaignName} created`);
//   })
//   .catch(error => {
//     throw error;
//   });

  return new Response(JSON.stringify({success: `connect to create referendum api!`}), {status: 200});

}