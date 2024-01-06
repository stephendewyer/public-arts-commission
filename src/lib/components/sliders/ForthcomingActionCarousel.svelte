<script lang="ts">
    import { Splide, SplideSlide } from '@splidejs/svelte-splide';
    import '@splidejs/svelte-splide/css';
    import ActionEndorsementCard from "../cards/endorsementCards/ActionEndorsementCard.svelte";
    
    export let forthcoming_actions: ActionWithImage[];
    
    // set up carousel config
    const options = {
        pagination: true,
        type: "loop",
        gap: '1rem',
        autoplay: true,
        arrows: true
    };

</script>
<div class="forthcoming_actions_container">
    <h2>forthcoming actions</h2>
    <div class="splide">
        <Splide
            options={ options }
            aria-label="impact splide main gallery"
        >
            {#each forthcoming_actions as action, i}
                <SplideSlide>
                    <div class="slide_container">
                        <ActionEndorsementCard endorsedActionData={action} />
                    </div>
                </SplideSlide>
            {/each}
        </Splide>
    </div>
</div>
<style>

    .forthcoming_actions_container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .splide {
        width: 100%;
        max-width: 30rem;
    }

    .slide_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0;
    }

</style>