import { mysqlConnection } from "$lib/server/db/mysql";
import sgMail from "@sendgrid/mail";
import { SENDGRIDAPIKey } from '$env/static/private';
import { hashPassword } from "$lib/authentication/PasswordAuth.js";
import { htmlEntities } from "$lib/utils/htmlEntities.js";

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

  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  if (
    !campaignName ||
    !electorate ||
    !party ||
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

  } else if (password.split("").length < 7 || password.split("").length > 14) {

    return new Response(JSON.stringify({error: "password must have a minimum of 7 characters and maximum of 14 characters"}), {status: 422});

  } else if (!/\d/.test(password)) {

    return new Response(JSON.stringify({error: "password must have at least one number"}), {status: 422});

  } else if (!specialChars.test(password)) {

    return new Response(JSON.stringify({error: "password must have at least one special character"}), {status: 422});

  } else if (!/[A-Z]/.test(password)) {

    return new Response(JSON.stringify({error: "password must have at least one capital letter"}), {status: 422});

  } else if (!/[a-z]/.test(password)) {

    return new Response(JSON.stringify({error: "password must have at least one lower-case letter"}), {status: 422});

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

    return new Response(JSON.stringify({error: "an account with the same email already exists!"}), {status: 422});

  };

  // check to see if campaign name already exist in campaign_applications

  const checkCampaignNameQuery = `SELECT campaign_name FROM campaign_applications WHERE campaign_name = '${campaignName}'`;

  const [campaignNameRows, campaignNameFields] = await res.query(checkCampaignNameQuery);

  const campaignNameExists = JSON.parse(JSON.stringify(campaignNameRows));

  if (campaignNameExists.length) {

    return new Response(JSON.stringify({error: "an account with the same campaign name already exists!"}), {status: 422});

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

  // insert the campaign information in the campaign_applications table

  const insertCampaignUserInformationStatement = `INSERT INTO campaign_users_information (
    user_ID,
    name_first,
    name_last,
    phone_number,
    street_address,
    street_address_02,
    city,
    state,
    zip_code
  ) VALUES (
    "${campaignUserID}",
    "${htmlEntities(nameFirst)}",
    "${htmlEntities(nameLast)}",
    "${phoneNumber}",
    "${htmlEntities(streetAddress)}",
    "${htmlEntities(streetAddress02)}",
    "${htmlEntities(city)}",
    "${htmlEntities(state)}",
    "${zipCode}"
  )`;

  await res.query(insertCampaignUserInformationStatement)
  .then(() => {
    console.log(`campaign user information for ${email} created`);
  })
  .catch(error => {
    throw error;
  });

  const insertCampaignApplicationStatement = `INSERT INTO campaign_applications (
    user_ID,
    campaign_name,
    electorate,
    party,
    primary_election_date,
    general_election_date,
    website_URL,
    authorized_campaign_representative
  ) VALUES (
    "${campaignUserID}",
    "${htmlEntities(campaignName)}",
    "${htmlEntities(electorate)}",
    "${htmlEntities(party)}",
    "${primaryElectionDate}",
    "${generalElectionDate}",
    "${htmlEntities(websiteURL)}",
    "${authorizedRepresentativeINT}"
  )`;

  await res.query(insertCampaignApplicationStatement)
  .then(() => {
    console.log(`campaign application information added for ${campaignName}`);
  })
  .catch(error => {
    throw error;
  });

  res.end();

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