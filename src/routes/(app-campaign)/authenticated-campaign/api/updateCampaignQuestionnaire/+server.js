import { mysqlConnection } from "$lib/server/db/mysql";
import { htmlEntities } from "$lib/utils/htmlEntities.js";

export const PATCH = async ({request}) => {

    if (request.method !== 'PATCH') {

        return new Response(JSON.stringify({error: "method is not PATCH"}), {status: 422});

    };

    const data = await request.json();

    let { 
        campaignApplicationID,
        campaignName,
        expandPoliticalImaginationSupport,
        howExpandPoliticalImagination,
        artSeatAtTableGovernment,
        howArtSeatTableGovernment
    } = data;

    let expandPoliticalImaginationSupportINT;

    if (expandPoliticalImaginationSupport) {

        expandPoliticalImaginationSupportINT = 1;

    } else if (!expandPoliticalImaginationSupport) {

        expandPoliticalImaginationSupportINT = 0;

    };

    let artSeatAtTableGovernmentINT;

    if (artSeatAtTableGovernment) {

        artSeatAtTableGovernmentINT = 1;

    } else if (!artSeatAtTableGovernment) {

        artSeatAtTableGovernmentINT = 0;

    };

    if (expandPoliticalImaginationSupport && howExpandPoliticalImagination === "" && !artSeatAtTableGovernment) {

        return new Response(JSON.stringify({error: "missing answer for how your campaign will help expand our political imagination!"}), {status: 422});

    } else if (artSeatAtTableGovernment && howArtSeatTableGovernment === "" && !expandPoliticalImaginationSupport) {

        return new Response(JSON.stringify({error: "missing answer for how your campaign will help give the arts comunity a seat at the table in government!"}), {status: 422});

    } else if ((expandPoliticalImaginationSupport && artSeatAtTableGovernment) && (howArtSeatTableGovernment === "" && howExpandPoliticalImagination === "")) {

        return new Response(JSON.stringify({error: "missing answers for how your campaign will help expand our political imagination and how your campaign will help give the arts comunity a seat at the table in government!"}), {status: 422});

    } else if ((expandPoliticalImaginationSupport && artSeatAtTableGovernment) && (howArtSeatTableGovernment === "" && howExpandPoliticalImagination !== "")) {

        return new Response(JSON.stringify({error: "missing answer for how your campaign will help give the arts comunity a seat at the table in government!"}), {status: 422});

    } else if ((expandPoliticalImaginationSupport && artSeatAtTableGovernment) && (howArtSeatTableGovernment !=="" && howExpandPoliticalImagination === "")) {

        return new Response(JSON.stringify({error: "missing answer for how your campaign will help expand our political imagination!"}), {status: 422});

    };

    let res = await mysqlConnection();

    // update the campaign questionnaire information in the campaign_applications table

    const updateCampaignApplicationRegistrationStatement = `UPDATE campaign_applications 
        SET
            excellent_public_art_for_all = "${expandPoliticalImaginationSupportINT}",
            excellent_public_art_for_all_02 = "${htmlEntities(howExpandPoliticalImagination)}",
            art_government_seat = "${artSeatAtTableGovernmentINT}",
            art_government_seat_02 = "${htmlEntities(howArtSeatTableGovernment)}"
        WHERE campaign_application_ID = "${campaignApplicationID}"
    `;

    await res.query(updateCampaignApplicationRegistrationStatement)
    .then(() => {
        console.log(`campaign questionnaire for ${campaignName} updated`);
    })
    .catch(error => {
        throw error;
    });

    res.end();

    return new Response(JSON.stringify({success: {
        message: `campaign questionnaire for ${campaignName} updated!`,
        campaign_application_ID: campaignApplicationID
    }}), {status: 200});

};