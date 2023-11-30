import { mysqlConnection } from "$lib/server/db/mysql";
import sgMail from "@sendgrid/mail";
import { SENDGRIDAPIKey } from '$env/static/private';
import { hashPassword } from "$lib/authentication/PasswordAuth.js";

export async function POST({request}) {

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});
  }

  let authorizedRepresentativeINT = 0;

  const data = await request.json();

  const { 
    campaignName,
    electorate,
    party,
    primaryElectionDate,
    generalElectionDate,
    websiteURL,
    nameFirst,
    nameLast,
    phoneNumber,
    streetAddress,
    streetAddress02,
    city,
    state,
    zipCode,
    authorizedRepresentative,
    email,
    password,
    reenteredPassword 
  } = data;

  if (
    !campaignName ||
    !electorate ||
    !party ||
    !primaryElectionDate ||
    !generalElectionDate ||
    !nameFirst ||
    !nameLast ||
    !phoneNumber ||
    !streetAddress ||
    !city ||
    !state ||
    !zipCode ||
    !email ||
    !password ||
    !reenteredPassword
  ) {

    return new Response(JSON.stringify({error: "missing form data!"}), {status: 422});

  } else if (!email.includes('@')) {

    return new Response(JSON.stringify({error: "missing an @ symbol in email address!"}), {status: 422});

  } else if (password !== reenteredPassword) {

    return new Response(JSON.stringify({error: "passwords do not match!"}), {status: 422});

  } else if (!authorizedRepresentative) {

    return new Response(JSON.stringify({error: "cannot create account for unauthorized campaign representative!"}), {status: 422});

  } else if (authorizedRepresentative) {

    authorizedRepresentativeINT = 1;

  };



  // hash the password

  const hashedPassword = await hashPassword(password);
  
  let res = await mysqlConnection();

  // check to see if user email already exists in users_campaigns

  const checkEmailQuery = `SELECT email FROM users_campaigns WHERE email = '${email}'`;

  const [emailRows, emailFields] = await res.query(checkEmailQuery);

  // convert the rows into valid json to avoid OKPacket type

  const emailExists = JSON.parse(JSON.stringify(emailRows));

  if (emailExists.length) {

    return new Response(JSON.stringify({error: "an account with the same email already exists!"}));

  };

  // check to see if campaign name already exist in campaign_information

  const checkCampaignNameQuery = `SELECT campaign_name FROM campaign_information WHERE campaign_name = '${campaignName}'`;

  const [campaignNameRows, campaignNameFields] = await res.query(checkCampaignNameQuery);

  const campaignNameExists = JSON.parse(JSON.stringify(campaignNameRows));

  if (campaignNameExists.length) {

    return new Response(JSON.stringify({error: "an account with the same campaign name already exists!"}));

  };

  // if email and campaign name are new, create the campaign user account

  const insertCampaignUserStatement = `INSERT INTO users_campaigns (email, password) VALUES ("${email}", "${hashedPassword}")`;

  let campaignUserID;

  // insert the user into users_campaigns table and get the user_ID
  await res.query(insertCampaignUserStatement)
  .then(([ rows ]) => {
    const rowsJSON = JSON.parse(JSON.stringify(rows));
    campaignUserID = rowsJSON.insertId;
  })
  .catch(error => {
    throw error;
  });

  // insert the campaign information in the campaign_information table

  const insertCampaignInformationStatement = `INSERT INTO campaign_information (
    user_ID,
    campaign_name,
    electorate,
    party,
    primary_election_date,
    general_election_date,
    name_first,
    name_last,
    phone_number,
    street_address,
    street_address_02,
    city,
    state,
    zip_code,
    authorized_campaign_representative,
    website_URL
  ) VALUES (
    "${campaignUserID}",
    "${campaignName}",
    "${electorate}",
    "${party}",
    "${primaryElectionDate}",
    "${generalElectionDate}",
    "${nameFirst}",
    "${nameLast}",
    "${phoneNumber}",
    "${streetAddress}",
    "${streetAddress02}",
    "${city}",
    "${state}",
    "${zipCode}",
    "${authorizedRepresentativeINT}",
    "${websiteURL}"
  )`;

  await res.query(insertCampaignInformationStatement)
  .then(() => {
    console.log(`campaign information for ${campaignName} created`);
  })
  .catch(error => {
    throw error;
  });

  // begin sending the message

  sgMail.setApiKey(SENDGRIDAPIKey);

  const msg = [
    {
      to: 'sdewyer@artintechservices.com',
      from: 'sdewyer@publicartscommission.org',
      subject: `new campaign account created`,
      text: `new campaign account created.`,
      html: `<p>Hi stephen,<br /><br />A new campaign account has been created for ${email}.<br /><br />
      Kind regards,<br /><br />public arts commission<br />https://public-arts-commission.vercel.app/</p></p>`,
    },
    {
      to: email,
      from: 'sdewyer@publicartscommission.org',
      subject: `created your campaign account at public arts commission`,
      text: 'Your public arts commission campaign account created.',
      html: `<p>Hi ${email},<br /><br />
      Thank you for creating a campaign account at public arts commission.<br /><br />
      You can now apply for an endorsement by public arts commission.<br /><br />
      To apply for an endorsement, log into your campaign account and submit an application.<br /><br />  
      If you have any questions, please contact stephen dewyer at sdewyer@publicartscommission.org.<br /><br />
      Kind regards,<br /><br />public arts commission<br />https://public-arts-commission.vercel.app/</p>`,
    },
  ];

  try {

    await sgMail.send(msg);
    
    
  } catch (error) {

    return new Response(JSON.stringify({error: "new campaign account messages not sent due to a problem with the API"}), {status: 422});

  };

  return new Response(JSON.stringify({success: `campaign account successfully created for ${email}`}), {status: 200});

}