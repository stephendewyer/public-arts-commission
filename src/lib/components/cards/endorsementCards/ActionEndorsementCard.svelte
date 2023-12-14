<script lang="ts">
    export let endorsedActionData: ActionWithImage;

    console.log(endorsedActionData)
    const actionYear = endorsedActionData.date_end.substring(0, 4);
    
</script>
<div class="endorsement_card_container">
    <div class="image_container">
        <img src={endorsedActionData.image_URL} alt={endorsedActionData.alt_text} />
    </div>
    <div class="endorsement_card_overlay" />
    <div class="action_info">
        <h4>{actionYear}</h4>
        <h4>{endorsedActionData.action_name}</h4>
    </div>
</div>

<style>
    .endorsement_card_container {
        position: relative;
        width: 20rem;
        height:28rem;
    }

    .endorsement_card_overlay {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background-color: rgba(239,249,242,0.6);
    }

    .image_container {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    .image_container > img {
        object-fit: cover;
        height: 100%;
    }

    .action_info {
        position: relative;
        padding: 1rem;
    }
</style>