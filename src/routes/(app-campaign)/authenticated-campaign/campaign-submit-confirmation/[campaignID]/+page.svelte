<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import ActionButton from '$lib/components/buttons/ActionButton.svelte';
    export let data;

    const campaignApplication: CampaignApplicationWithImageRow = data.streamed.campaignApplication;

    const campaignApplicationSubmissionDate: string = new Date(campaignApplication.date_submitted).toUTCString();

</script>
<svelte:head>
	<title>campaign application receipt - public arts commission - </title>
	<meta name="description" content="confirming receipt of campaign application for endorsement by public arts commission" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<div class="campaign_questionnaire_container">
    <h2>
        campaign endorsement application
    </h2>
    <h4 style="margin: 0;">
        {campaignApplication.campaign_name}
    </h4>
    <p style="margin: 1rem 0 0 0">
        Thank you for submitting an application to have your campaign endorsed by public arts commission.<br /><br />
        We will carefully review your application and contact you should your campaign meet our endorsement criteria.<br /><br />
        If you have any questions, please contact public arts commission Founder stephen dewyer at sdewyer@publicartscommission.org.
    </p>
    <h3>Your application submitted on {campaignApplicationSubmissionDate} has been received.</h3>
    <a href={`/authenticated-campaign`}>
        <ActionButton>my campaigns</ActionButton>
    </a>
</div>

<style>
    .campaign_questionnaire_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        max-width: 40rem;
        width: 100%;
        padding: 0 1rem;
        margin: 0 auto;
    }
</style>