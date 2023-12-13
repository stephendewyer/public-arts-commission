<script lang="ts">
    export let endorsedAmendmentData: any;
    
</script>
<div class="endorsement_card_container">
    <img src={endorsedAmendmentData.image_URL} alt={endorsedAmendmentData.alt_text} />
    <h4>{endorsedAmendmentData.amendment_name}</h4>
</div>

<style>
    .endorsement_card_container {
        width: 24rem;
        height:28rem;
    }
</style>