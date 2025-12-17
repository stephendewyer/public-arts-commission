import { mysqlConnection } from "$lib/server/db/mysql";
import { htmlEntities } from "$lib/utils/htmlEntities.js";

export const POST = async ({request}) => {

    if (request.method !== 'POST') {

        return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});

    };

    const data = await request.json();

    const endorsementAction = data.endorse;

    const campaignApplication = data.candidateApplication;
    /**
   * @type {any}
   */
    let campaignContactInfo;

    let res = await mysqlConnection();

    // if endorsement action is yes, add campaign to endorsed campaigns and update campaign application for endorsement status to endorsed

    if (endorsementAction === "yes") {

        // update the status of the campaign application to endorsed

        const updateCampaignApplicationStatus = `UPDATE campaign_applications
            SET
                application_status = "endorsed"
            WHERE 
                campaign_application_ID = "${campaignApplication.campaign_application_ID}"
        `;

        // insert the image_URL and adminID into the image_collection table and get the image_ID
        await res.query(updateCampaignApplicationStatus)
        .then(() => {
            console.log(`status updated for ${campaignApplication.campaign_name} application`);
        })
        .catch(error => {
            throw error;
        });

        // get the campaign representative contact information

        const selectCampaignRepresentativeContactInfo = `SELECT 
                users_campaigns.email,
                campaign_users_information.*
            FROM 
                users_campaigns
            INNER JOIN
                campaign_users_information
            ON
                users_campaigns.user_ID=campaign_users_information.user_ID
            WHERE
                users_campaigns.user_ID=${campaignApplication.user_ID}
        `;

        await res.query(selectCampaignRepresentativeContactInfo)
        .then(([ rows ]) => {
    
            campaignContactInfo = JSON.parse(JSON.stringify(rows))[0];
    
        })
        .catch(error => {
    
            throw error;
    
        });

        // add campaign row to endorsed candidates

        const insertEndorsedCandidateInformationStatement = `INSERT INTO endorsed_candidates (
            image_ID,
            campaign_name,
            office_sought_starting_year,
            election_date_primary,
            election_date_general,
            government_level,
            state,
            county,
            city,
            party,
            website_URL,
            contact_name_first,
            contact_name_last,
            contact_phone_number,
            contact_street_address,
            contact_street_address_02,
            contact_city,
            contact_state,
            contact_zip_code,
            contact_email,
            electorate
        ) VALUES (
            "${campaignApplication.image_ID}",
            "${htmlEntities(campaignApplication.campaign_name)}",
            "${campaignApplication.starting_year_for_office_sought}",
            "${campaignApplication.primary_election_date}",
            "${campaignApplication.general_election_date}",
            "${htmlEntities(campaignApplication.government_level)}",
            "${htmlEntities(campaignApplication.state)}",
            "${htmlEntities(campaignApplication.county)}",
            "${htmlEntities(campaignApplication.city)}",
            "${htmlEntities(campaignApplication.party)}",
            "${htmlEntities(campaignApplication.website_URL)}",
            "${htmlEntities(campaignContactInfo.name_first)}",
            "${htmlEntities(campaignContactInfo.name_last)}",
            "${campaignContactInfo.phone_number}",
            "${htmlEntities(campaignContactInfo.street_address)}",
            "${htmlEntities(campaignContactInfo.street_address_02)}",
            "${htmlEntities(campaignContactInfo.city)}",
            "${htmlEntities(campaignContactInfo.state)}",
            "${campaignContactInfo.zip_code}",
            "${campaignContactInfo.email}",
            "${htmlEntities(campaignApplication.electorate)}"    
        )`;
        
        await res.query(insertEndorsedCandidateInformationStatement)
        .then(() => {
            console.log(`candidate endorsement information for ${campaignApplication.campaign_name} created`);
        })
        .catch(error => {
            throw error;
        });

        res.end();

        return new Response(JSON.stringify({success: `successfully endorsed ${campaignApplication.campaign_name}`}), {status: 200});

    } else if (endorsementAction === "no") {

        // update the status of the campaign application to not endorsed

        const updateCampaignApplicationStatus = `UPDATE campaign_applications
            SET
                application_status = "not endorsed"
            WHERE campaign_application_ID = "${campaignApplication.campaign_application_ID}"
        `;

        // insert the image_URL and adminID into the image_collection table and get the image_ID
        await res.query(updateCampaignApplicationStatus)
        .then(() => {
            console.log(`status updated for ${campaignApplication.campaign_name} application`);
        })
        .catch(error => {
            throw error;
        });

        res.end();

        return new Response(JSON.stringify({success: `${campaignApplication.campaign_name} successfully not endorsed`}), {status: 200});

    };

}