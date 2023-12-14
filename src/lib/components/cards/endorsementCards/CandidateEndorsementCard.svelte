<script lang="ts">
    export let endorsedCandidateData: CandidateWithImage;

    let status: string = "";

    $: if (endorsedCandidateData.running_in_primary === 1) {

        status = "running in primary election";

    } else if (endorsedCandidateData.elected_in_primary_and_general === 1) {

        status = "elected in the primary and general elections";

    } else if (endorsedCandidateData.elected_in_primary_proceeding_general === 1) {

        status = "elected in the primary election and running in the general election";

    } else if (endorsedCandidateData.rejected_in_primary_campaign_ended === 1) {

        status = "rejected in the primary election and no longer running";

    } else if (endorsedCandidateData.rejected_in_primary_proceeding_general === 1) {

        status = "rejected in the primary election and running in the general election"

    } else if (endorsedCandidateData.rejected_in_primary_rejected_in_general === 1){
        
        status = "rejected in the primary and general elections"
    };

    let primaryElectionDate: string = "";

    let rawPrimaryElectionDate: Date;

    $: rawPrimaryElectionDate = new Date(endorsedCandidateData.election_date_primary);

    $: primaryElectionDate = rawPrimaryElectionDate.toUTCString()

    let generalElectionDate: string = "";

    let rawGeneralElectionDate: Date;

    $: rawGeneralElectionDate = new Date(endorsedCandidateData.election_date_general);

    $: generalElectionDate = rawGeneralElectionDate.toUTCString();

    
</script>
<div class="endorsement_card_container">
    <div class="image_container">
        <img src={endorsedCandidateData.image_URL} alt={endorsedCandidateData.alt_text} />
    </div>
    <h4>{endorsedCandidateData.campaign_name}</h4>
    <h5>primary election date: {primaryElectionDate}</h5>
    <h5>general election date: {generalElectionDate}</h5>
    <h5>status: {status}</h5>
</div>

<style>

    .endorsement_card_container {
        max-width: 20rem;
        width: 100%;
    }

    .image_container {
        width: 100%;
        height: 20rem;
    }

    .image_container > img {
        object-fit: cover;
        height: 100%;
    }

    @media (max-width: 1440px) {

        .endorsement_card_container {
            max-width: 15rem;
        }

        .image_container {
            height: 15rem;
        }

    }

    @media (max-width: 720px) {
        .endorsement_card_container {
            max-width: 10rem;
        }

        .image_container {
            height: 10rem;
        }
    }

</style>