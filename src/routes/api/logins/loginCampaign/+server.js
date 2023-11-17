import { mysqlConnection } from "$lib/server/db/mysql";
import bcrypt from 'bcrypt';

export async function POST({request}) {

  if (request.method !== 'POST') {

    return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});
    
  };

  const data = await request.json();

  const { email, password } = data;

  if (
    !email ||
    !password 
  ) {
    return new Response(JSON.stringify({error: "missing form data!"}), {status: 422});
  } else if (!email.includes('@')) {
    return new Response(JSON.stringify({error: "missing an @ symbol in email address!"}), {status: 422});
  };

  // search voters for voter account with email that matches the user
  
  let res = await mysqlConnection();

  // load query to check if row with same voter first name and voter last name exists

  const checkVoterEmailQuery = `SELECT * FROM voters WHERE email = '${email}'`;

  const [voterRows, voterFields] = await res.query(checkVoterEmailQuery);

  const voterExists = JSON.parse(JSON.stringify(voterRows));

  if (!voterExists.length) {

    return new Response(JSON.stringify({error: `no voter account exists with ${email}`}));

  };

  // const userPassword = await bcrypt.compare(password, hashedPassword)

}