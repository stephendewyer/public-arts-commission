<script lang="ts">
    import CampaignApplicationProgressBar from '$lib/components/campaignApplicationProgressBar/CampaignProgressBar.svelte';

</script>

<div class="campaign_submit_container">
    <h2>
        campaign endorsement application
    </h2>
    <CampaignApplicationProgressBar />
</div>

<style>
    .campaign_submit_container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>