import { mysqlConnection } from "$lib/server/db/mysql";
import sgMail from "@sendgrid/mail";
import { SENDGRIDAPIKey } from '$env/static/private';

export const POST = async ({request}) => {

    if (request.method !== 'POST') {

        return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});

    };

    const data = await request.json();

    let { 
        campaignApplicationID,
        campaignUserID,
        campaignName,
        currentDate,
        userEmail
    } = data;

    if (
        !campaignApplicationID ||
        !campaignUserID ||
        !campaignName ||
        !currentDate ||
        !userEmail
    ) {

        return new Response(JSON.stringify({error: "missing user email, current date, campaign application ID, campaign name and/or campaign user ID"}));

    };

    let parsedDate = currentDate;

    let res = await mysqlConnection();

    // update the campaign questionnaire information in the campaign_applications table

    const submitCampaignEndorsementApplicationStatement = `UPDATE campaign_applications 
        SET
            campaign_application_submitted = "${1}",
            date_submitted = "${currentDate}",
            application_status = "${"submitted"}"
        WHERE campaign_application_ID = "${campaignApplicationID}"
    `;

    await res.query(submitCampaignEndorsementApplicationStatement)
    .then(() => {
        console.log(`campaign application for ${campaignName} submitted`);
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
            subject: `${campaignName} submitted an application for endorsement`,
            text: `application for endorsement submitted by ${campaignName}.`,
            html: `<p>Hi stephen,<br /><br />A campaign application for endorsement by public arts commission has been submitted as of ${parsedDate} by ${campaignName}.<br /><br />
            The email address for ${campaignName} is ${userEmail}.<br /><br />
            Kind regards,<br /><br />public arts commission<br />https://public-arts-commission.vercel.app/</p></p>`,
        },
        {
            to: userEmail,
            from: 'sdewyer@publicartscommission.org',
            subject: `submitted campaign application for ${campaignName}`,
            text: `we received your application for endorsement by public arts commission submitted on ${parsedDate}.`,
            html: `<p>Hi ${userEmail},<br /><br />
            Thank you for submitting an application on behalf of ${campaignName} to receive an endorsement by public arts commission.<br /><br />
            We will carefully review your application and contact you in the near future.<br /><br />
            If you have any questions, please contact stephen dewyer at sdewyer@publicartscommission.org.<br /><br />
            Kind regards,<br /><br />public arts commission<br />https://public-arts-commission.vercel.app/</p>`,
        },
    ];

    try {

        await sgMail.send(msg);

    } catch (error) {

        return new Response(JSON.stringify({error: "new campaign account messages not sent due to a problem with the API"}), {status: 422});

    };

    return new Response(JSON.stringify({success: {
        message: `campaign application for ${campaignName} submitted!`,
        campaign_application_ID: campaignApplicationID
    }}), {status: 200});

};