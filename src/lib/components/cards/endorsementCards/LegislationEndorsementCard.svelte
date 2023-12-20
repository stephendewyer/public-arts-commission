<script lang="ts">
    import MeatBalls from '$lib/images/icons/meaballs.svg?raw';
    import { EndorsedLegislationSelectedStore } from '$lib/stores/EndorsedLegislationSelectedStore';
    import { EndorsedLegislationOpenStore } from '$lib/stores/EndorsedLegislationOpenStore';

    export let endorsedLegislationData: LegislationWithImage;

    let legislationStatus: string[] = [];

    $: if (endorsedLegislationData?.passed_in_House === 1) {

        legislationStatus = [...legislationStatus, " passed in the House"];

    };
    
    $: if (endorsedLegislationData?.passed_in_Senate === 1) {

        legislationStatus = [...legislationStatus, " passed in the Senate"];

    };
    
    $: if (endorsedLegislationData?.rejected_in_House === 1) {

        legislationStatus = [...legislationStatus, " rejected in the House"];

    };
    
    $: if (endorsedLegislationData?.rejected_in_Senate === 1) {

        legislationStatus = [...legislationStatus, " rejected in the Senate"];

    };
    
    $: if (endorsedLegislationData?.vetoed_by_Executive === 1) {

        legislationStatus = [...legislationStatus, " vetoed by the Executive"];

    };
    
    $: if (endorsedLegislationData?.signed_by_Executive === 1) {

        legislationStatus = [...legislationStatus, " signed into law by the Executive"];

    };

    let cardHovered: boolean = false;

    const cardHoverHandler = () => {

        cardHovered = true;

    };

    const cardExitHandler = () => {

        cardHovered = false;

    };

    const cardSelectedHandler = () => {

        EndorsedLegislationSelectedStore.update((value) => value = endorsedLegislationData);
        EndorsedLegislationOpenStore.update((value)  => value = true);
        
    };
    
</script>

<div 
    tabindex={endorsedLegislationData.legislation_ID}
    role="treeitem"
    aria-selected={cardHovered}
    on:focus={() => cardHoverHandler()}
    on:blur={() => cardExitHandler()}
    on:mouseenter={() => cardHoverHandler()}
    on:mouseover={() => cardHoverHandler()}
    on:mouseleave={() => cardExitHandler()}
    on:mouseout={() => cardExitHandler()}
    on:click={() => cardSelectedHandler()}
    on:keyup={() => cardSelectedHandler()}
    class={(cardHovered) ? "endorsement_card_hovered" : "endorsement_card"}
>
    <div class="image_container">
        <img 
            src={endorsedLegislationData.image_URL} 
            alt={endorsedLegislationData.alt_text} 
        />
    </div>
    <div 
        class="meatballs_container"
        style={(cardHovered) ? "fill: #D8EAC5" : "fill: #314659;" }
    >
        {@html MeatBalls}
    </div>
    <div class="card_info_container">
        <h4 class="card_heading_01">{endorsedLegislationData.legislation_name}</h4>
        <h5 class="card_heading_02">
            <span class="data_category">
                jurisdiction: 
            </span>
            {#if (endorsedLegislationData.city)}
                {endorsedLegislationData.city}
            {/if}
            {#if (endorsedLegislationData.county)}
                {endorsedLegislationData.county}
            {/if}
            {#if (endorsedLegislationData.state)}
                {endorsedLegislationData.state}
            {/if}
            United States of America
        </h5>
        {#if (endorsedLegislationData.year_released)}
            <h5 class="card_heading_02">
                <span class="data_category">
                    year released:
                </span>
                {endorsedLegislationData.year_released}
            </h5>
        {/if}
        {#if (endorsedLegislationData.year_introduced_House)}
            <h5 class="card_heading_02">
                <span class="data_category">
                    year introduced in House:
                </span>
                {endorsedLegislationData.year_introduced_House}
            </h5>
        {/if}
        {#if (endorsedLegislationData.year_introduced_Senate)}
            <h5 class="card_heading_02">
                <span class="data_category">
                    year introduced in Senate:
                </span>
                {endorsedLegislationData.year_introduced_Senate}
            </h5>
        {/if}
        <h5 class="card_heading_02"><span class="data_category">status:</span>
            {legislationStatus.toString()}
        </h5>
    </div>
</div>

<style>
    .endorsement_card {
        position: relative;
        max-width: 20rem;
        width: 100%;
        will-change: box-shadow;
        transition: box-shadow 0.2s linear;
    }

    .endorsement_card_hovered {
        position: relative;
        max-width: 20rem;
        width: 100%;
        box-shadow:
            0 1px 1px hsl(0deg 0% 0% / 0.075),
            0 2px 2px hsl(0deg 0% 0% / 0.075),
            0 4px 4px hsl(0deg 0% 0% / 0.075),
            0 8px 8px hsl(0deg 0% 0% / 0.075),
            0 16px 16px hsl(0deg 0% 0% / 0.075)
        ;
        will-change: box-shadow;
        transition: box-shadow 0.2s ease-out;
        cursor: pointer;
    }

    .meatballs_container {
        position: absolute;
        width: 3rem;
        right: 0;
        top: 0;
        margin: 0.5rem;
        transition: fill 0.2s linear;
    }

    .image_container {
        position: relative;
        width: 100%;
        height: 20rem;
    }

    .image_container > img {
        object-fit: cover;
        height: 100%;
        position: relative;
    }

    .card_info_container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
    }

    .card_heading_01 {
        margin: 0;
    }

    .card_heading_02 {
        margin: 0;
        font-size: 1rem;
    }

    .data_category {
        color: #28387C;
    }

    @media (max-width: 1440px) {

        .endorsement_card {
            max-width: 15rem;
        }

        .endorsement_card_hovered {
            max-width: 15rem;
        }

        .image_container {
            height: 15rem;
        }

        .card_heading_02 {
            margin: 0;
            font-size: 0.9rem;
        }

    }

    @media (max-width: 720px) {
        .endorsement_card {
            max-width: 12rem;
        }

        .endorsement_card_hovered {
            max-width: 12rem;
        }

        .image_container {
            height: 12rem;
        }

        .card_heading_02 {
            margin: 0;
            font-size: 0.8rem;
        }
    }
</style>