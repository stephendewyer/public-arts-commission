<script lang="ts">
    import CampaignApplicationProgressBar from '$lib/components/campaignApplicationProgressBar/CampaignProgressBar.svelte';

    export let data;

    let campaignApplication: CampaignApplicationWithImageRow | any = null;
    
    if (data.campaignApplication) {

        campaignApplication = data.campaignApplication;

    };
    
    let navPaths: NavPath[];

    $: navPaths = [
        {
            id: "registration",
            name: "registration",
            path: `/authenticated-campaign/campaign/campaign-registration/campaign=${campaignApplication.campaign_application_ID}`
        },
        {
            id: "questionnaire",
            name: "questionnaire",
            path: `/authenticated-campaign/campaign/campaign-questionnaire/campaign=${campaignApplication.campaign_application_ID}`
        },
        {
            id: "submit",
            name: "submit",
            path: `/authenticated-campaign/campaign/campaign-submit/campaign=${campaignApplication.campaign_application_ID}`
        }
    ];

</script>

<div class="campaign_questionnaire_container">
    <h2>
        campaign endorsement application
    </h2>
    <CampaignApplicationProgressBar nav_paths={navPaths}/>
</div>

<style>
    .campaign_questionnaire_container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>