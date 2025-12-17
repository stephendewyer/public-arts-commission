import { mysqlConnection } from "$lib/server/db/mysql";
import sgMail from "@sendgrid/mail";
import { SENDGRIDAPIKey } from '$env/static/private';
import { hashPassword } from "$lib/authentication/PasswordAuth.js";
import { htmlEntities } from "$lib/utils/htmlEntities.js";

export async function POST({request}) {

  if (request.method !== 'POST') {

    return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});

  };

  const data = await request.json();

  const { 
    nameFirst, 
    nameLast, 
    email, 
    password, 
    reenteredPassword, 
    citizenEligibleVoter,
    unionMember
  } = data;

  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  if (
    !nameFirst ||
    !nameLast ||
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

  } else if (citizenEligibleVoter === false) {

    return new Response(JSON.stringify({error: "must have citizenship and voter eligibility to create account"}), {status: 422});
    
  };

  let citizenEligibleVoterINT = 0;

  if (citizenEligibleVoter === true) {
    citizenEligibleVoterINT = 1;
  } else {
    citizenEligibleVoterINT = 0;
  };

  let unionMemberINT = 0;

  if (unionMember === true)  {
    unionMemberINT = 1;
  } else {
    unionMemberINT = 0;
  };

  // hash the password

  const hashedPassword = await hashPassword(password);

  // check to see if email and campaign name already exist
  let res = await mysqlConnection();

  // load query to check if row with same voter first name and voter last name exists

  const checkEmailQuery = `SELECT email FROM users_voters WHERE email = '${email}'`;

  const [emailRows, emailFields] = await res.query(checkEmailQuery);

  // convert the rows into valid json to avoid OKPacket type

  const emailExists = JSON.parse(JSON.stringify(emailRows));

  if (emailExists.length) {

    return new Response(JSON.stringify({error: "a voter account with the same email already exists!"}), {status: 422});

  };

  const checkNameFirstAndLastQuery = `SELECT * FROM voter_information WHERE name_first = '${nameFirst}' AND name_last = '${nameLast}'`;

  const [nameFirstAndLastRows, nameFirstAndLastFields] = await res.query(checkNameFirstAndLastQuery);

  const nameFirstAndLastExists = JSON.parse(JSON.stringify(nameFirstAndLastRows));

  if (nameFirstAndLastExists.length) {

    return new Response(JSON.stringify({error: "a voter account with the same first and last name already exists!"}), {status: 422});

  };

  // if voter email and voter combined first and last names are new, create the account

  const insertUserVoterStatement = `INSERT INTO users_voters (email, password) VALUES ("${email}", "${hashedPassword}")`;

  let voterUserID;

  // insert the user into users_campaigns table and get the user_ID
  await res.query(insertUserVoterStatement)
  .then(([ rows ]) => {
    const rowsJSON = JSON.parse(JSON.stringify(rows));
    voterUserID = rowsJSON.insertId;
  })
  .catch(error => {
    throw error;
  });

  // insert the first and last names, union membership and has U.S. citizenship and voter eligibility into voter_information table

  const insertVoterInformationStatement = `INSERT INTO voter_information (
    user_ID,
    name_first,
    name_last,
    citizen_eligible_voter,
    union_member
  ) VALUES(
    "${voterUserID}",
    "${htmlEntities(nameFirst)}",
    "${htmlEntities(nameLast)}",
    "${citizenEligibleVoterINT}",
    "${unionMemberINT}"
  )`;

  await res.query(insertVoterInformationStatement)
  .then(() => {
    console.log("voter information added!")
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
      subject: `new voter account created`,
      text: `new voter account created.`,
      html: `<p>Hi stephen,<br /><br />A new voter account has been created for ${nameFirst} ${nameLast}.<br /><br />
      Kind regards,<br /><br />public arts commission<br />https://public-arts-commission.vercel.app/</p></p>`,
    },
    {
      to: email,
      from: 'sdewyer@publicartscommission.org',
      subject: `created your voter account at public arts commission`,
      text: 'Your public arts commission voter account created.',
      html: `<p>Hi ${nameFirst},<br /><br />
      Thank you for creating a voter account at public arts commission.<br /><br />
      You can now nominate campaigns and propose actions for endorsement by public arts commission.<br /><br />
      You can also now connect with other voters in addition to public arts commission-endorsed actions and campaigns.<br /><br />
      If you have any questions, please contact stephen dewyer at sdewyer@publicartscommission.org.<br /><br />
      Kind regards,<br /><br />public arts commission<br />https://public-arts-commission.vercel.app/</p>`,
    },
  ];

  try {

    await sgMail.send(msg);
    
  } catch (error) {

    return new Response(JSON.stringify({error: "new voter account message not sent due to a problem with the API"}), {status: 422});

  };

  return new Response(JSON.stringify({success: `voter account successfully created for ${nameFirst} ${nameLast}`}), {status: 200});

}