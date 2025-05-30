import sgMail from "@sendgrid/mail";
import { SENDGRIDAPIKey } from '$env/static/private';

export async function POST({request}) {

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});
  }

  const data = await request.json();

  const nameFirst = data.nameFirst;
  const nameLast = data.nameLast;
  const subject = data.subject;
  const email = data.email;
  const message = data.message;

  if (
    !nameFirst ||
    !nameLast ||
    !subject ||
    !email ||
    !message 
  ) {
    return new Response(JSON.stringify({error: "missing form data"}), {status: 422});
  };

  if (
    !email.includes('@')
  ) {
    return new Response(JSON.stringify({error: "missing an @ symbol in email address"}), {status: 422});
  };

  // begin sending the message

  sgMail.setApiKey(SENDGRIDAPIKey);

  const msg = [
    {
      to: 'sdewyer@publicartscommission.org',
      from: 'sdewyer@publicartscommission.org',
      subject: subject,
      text: 'message received from public arts commission contact form',
      html: `<p>Dear stephen,<br /><br />
      You received a new message via the public arts commission website.  The following is the message:<br /><br />${message} <br /><br />The sender's email is ${email}.</p>`,
    },
    {
      to: email,
      from: 'sdewyer@publicartscommission.org',
      subject: `thank you for contacting public arts commission`,
      text: 'We received your message via our website contact form.',
      html: `<p>Hi ${nameFirst} ${nameLast},<br /><br />Thank you for contacting public arts commission.  We received your message via our website contact form and should get back to you within 24 hours.<br /><br />Best,<br /><br />public arts commission<br />https://public-arts-commission.vercel.app/</p>`,
    },
  ];

  try {
    await sgMail.send(msg);
    return new Response(JSON.stringify({success: "message sent"}), {status: 200})
  } catch (error) {
    return new Response(JSON.stringify({error: "message not sent due to a problem with the API"}), {status: 422});
  };

  // end sending the message

};