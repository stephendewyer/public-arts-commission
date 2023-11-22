import { mysqlConnection } from "$lib/server/db/mysql";
import sgMail from "@sendgrid/mail";
import { SENDGRIDAPIKey } from '$env/static/private';
import { hashPassword } from "$lib/authentication/PasswordAuth.js";

export async function POST({request}) {

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});
  }

  const data = await request.json();

  const { campaignName, email, password, reenteredPassword } = data;

  if (
    !campaignName ||
    !email ||
    !password ||
    !reenteredPassword  
  ) {
    return new Response(JSON.stringify({error: "missing form data!"}), {status: 422});
  } else if (!email.includes('@')) {
    return new Response(JSON.stringify({error: "missing an @ symbol in email address!"}), {status: 422});
  } else if (password !== reenteredPassword) {
    return new Response(JSON.stringify({error: "passwords do not match!"}), {status: 422});
  };

  // hash the password

  const hashedPassword = await hashPassword(password);

  // check to see if email and campaign name already exist
  let res = await mysqlConnection();

  const checkCampaignNameQuery = `SELECT campaign_name FROM campaigns WHERE campaign_name = '${campaignName}'`;

  const [campaignNameRows, campaignNameFields] = await res.query(checkCampaignNameQuery);

  const campaignNameExists = JSON.parse(JSON.stringify(campaignNameRows));

  if (campaignNameExists.length) {

    return new Response(JSON.stringify({error: "an account with the same campaign name already exists!"}));

  };

  const checkEmailQuery = `SELECT email FROM campaigns WHERE email = '${email}'`;

  const [emailRows, emailFields] = await res.query(checkEmailQuery);

  // convert the rows into valid json to avoid OKPacket type

  const emailExists = JSON.parse(JSON.stringify(emailRows));

  if (emailExists.length) {

    return new Response(JSON.stringify({error: "an account with the same email already exists!"}));

  };

  // if email and campaign name are new, create the account

  const insertQuery = `INSERT INTO campaigns (campaign_name, email, password) VALUES ("${campaignName}", "${email}", "${hashedPassword}")`;

  let success = false;

  try {

      // add the user data to users_in_checkout database table

      await res.query(insertQuery);

      // redirect to collect payment

      success = true;

      // return {success: "data entered into user checkout registration database"};

  } catch (error) {

      success = false;

  }

  // begin sending the message

  sgMail.setApiKey(SENDGRIDAPIKey);

  const msg = [
    {
      to: 'sdewyer@publicartscommission.org',
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

  if (success) {

    return new Response(JSON.stringify({success: `campaign account successfully created for ${campaignName}`}), {status: 200});

  };

}