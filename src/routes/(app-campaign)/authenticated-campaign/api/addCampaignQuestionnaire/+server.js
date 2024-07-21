import { mysqlConnection } from "$lib/server/db/mysql";
import { htmlEntities } from "$lib/utils/htmlEntities.js";

export const POST = async ({request}) => {

    if (request.method !== 'POST') {

        return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});

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

    const addCampaignApplicationQuestionnaireStatement = `UPDATE campaign_applications 
        SET
            excellent_public_art_for_all = "${expandPoliticalImaginationSupportINT}",
            excellent_public_art_for_all_02 = "${htmlEntities(howExpandPoliticalImagination)}",
            art_government_seat = "${artSeatAtTableGovernmentINT}",
            art_government_seat_02 = "${htmlEntities(howArtSeatTableGovernment)}",
            campaign_questionnaire_completed = "${1}"
        WHERE campaign_application_ID = "${campaignApplicationID}"
    `;

    await res.query(addCampaignApplicationQuestionnaireStatement)
    .then(() => {
        console.log(`campaign questionnaire for ${campaignName} submitted`);
    })
    .catch(error => {
        throw error;
    });

    res.end();

    return new Response(JSON.stringify({success: {
        message: `campaign questionnaire for ${campaignName} submitted!`,
        campaign_application_ID: campaignApplicationID
    }}), {status: 200});

};