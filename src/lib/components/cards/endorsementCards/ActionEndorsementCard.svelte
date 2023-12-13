<script lang="ts">
    export let endorsedActionData: ActionWithImage;
    
</script>
<div class="endorsement_card_container">
    <div class="image_container">
        <img src={endorsedActionData.image_URL} alt={endorsedActionData.alt_text} />
    </div>
    <h4>{endorsedActionData.action_name}</h4>
</div>

<style>
    .endorsement_card_container {
        width: 20rem;
        height:28rem;
    }

    .image_container {
        width: 100%;
        height: 20rem;
    }

    .image_container > img {
        object-fit: cover;
        height: 100%;
    }
</style>