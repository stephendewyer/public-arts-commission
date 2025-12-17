<script lang="ts">
    import MeatBalls from '$lib/images/icons/meaballs.svg?raw';
    import { reverseHtmlEntities } from "$lib/utils/reverseHtmlEntities";

    export let endorsedActionData: ActionWithImage;

    let actionIsAllDay: boolean = endorsedActionData.all_day_event;
    let rawAllDayActionDate: Date = new Date(endorsedActionData.all_day_event_date);
    let allDayActionDate: string = rawAllDayActionDate.toUTCString().substring(0, 16);
    let actionRawStartDate: Date = new Date(endorsedActionData.date_start);
    let actionStartDate: string = actionRawStartDate.toUTCString();
    let actionRawEndDate: Date = new Date(endorsedActionData.date_end);
    let actionEndDate: string = actionRawEndDate.toUTCString();

    let cardHovered: boolean = false;

    const cardHoverHandler = () => {
        cardHovered = true;
    };

    const cardExitHandler = () => {
        cardHovered = false;
    };

</script>

<div 
    tabindex={endorsedActionData?.action_ID}
    role="treeitem"
    aria-selected={cardHovered}
    on:focus={() => cardHoverHandler()}
    on:blur={() => cardExitHandler()}
    on:mouseenter={() => cardHoverHandler()}
    on:mouseover={() => cardHoverHandler()}
    on:mouseleave={() => cardExitHandler()}
    on:mouseout={() => cardExitHandler()}
    class={(cardHovered) ? "endorsement_card_hovered" : "endorsement_card"}
>
    
    <div class="image_container">
        <img src={endorsedActionData.image_URL} alt={reverseHtmlEntities(endorsedActionData.alt_text)} />
    </div>
    <div class="endorsement_card_overlay" />
    <div 
        class="meatballs_container"
        style={(cardHovered) ? "fill: #D8EAC5" : "fill: #314659;" }
    >
        {@html MeatBalls}
    </div>
    <div class="card_info_container">
        <h5 class="card_heading_02">
            {#if (actionIsAllDay)}
                {allDayActionDate}
            {:else if (!actionIsAllDay)}
                {actionStartDate} - {actionEndDate}
            {/if}
        </h5>
        {#if (endorsedActionData.action_street_address)}
            <h5 class="card_heading_02">{reverseHtmlEntities(endorsedActionData.action_street_address)}</h5>
        {/if}
        {#if (endorsedActionData.action_street_address_02)}
            <h5 class="card_heading_02">{reverseHtmlEntities(endorsedActionData.action_street_address_02)}</h5>
        {/if}
        {#if (endorsedActionData.action_city)}
            <h5 class="card_heading_02">{reverseHtmlEntities(endorsedActionData.action_city)}</h5>
        {/if}
        {#if (endorsedActionData.action_state)}
            <h5 class="card_heading_02">{reverseHtmlEntities(endorsedActionData.action_state)}</h5>
        {/if}
        {#if (endorsedActionData.action_zip_code)}
            <h5 class="card_heading_02">{endorsedActionData.action_zip_code}</h5>
        {/if}
        <h4 class="card_heading_01">{reverseHtmlEntities(endorsedActionData?.action_name)}</h4>
    </div>
</div>

<style>
    .endorsement_card {
        position: relative;
        width: 100%;
        max-width: 20rem;
        will-change: box-shadow;
        transition: box-shadow 0.2s linear;
    }

    .endorsement_card_hovered {
        position: relative;
        width: 100%;
        max-width: 20rem;
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

    .endorsement_card_overlay {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background-color: rgba(239,249,242,0.6);
    }

    .image_container {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .image_container > img {
        object-fit: cover;
        height: 28rem;
        position: relative;
    }

    .card_info_container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
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

        .image_container > img {
            height: 22rem;
        }


        .card_heading_02 {
            margin: 0;
            font-size: 0.9rem;
        }

    }

    @media (max-width: 720px) {

        .endorsement_card {
            min-width: 14rem;
        }


        .endorsement_card_hovered {
            min-width: 14rem;
        }

        .image_container > img {
            height: 18rem;
        }

        .card_heading_02 {
            margin: 0;
            font-size: 0.8rem;
        }

    }
</style>