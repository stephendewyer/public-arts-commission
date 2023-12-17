<script lang="ts">
    import MeatBalls from '$lib/images/icons/meaballs.svg?raw';
    export let endorsedActionData: ActionWithImage;

    const actionIsAllDay = endorsedActionData.all_day_event;
    const rawAllDayActionDate = new Date(endorsedActionData.all_day_event_date);
    const allDayActionDate = rawAllDayActionDate.toUTCString().substring(0, 16);
    const actionRawStartDate = new Date(endorsedActionData.date_start);
    const actionStartDate = actionRawStartDate.toUTCString();
    const actionRawEndDate = new Date(endorsedActionData.date_end);
    const actionEndDate = actionRawEndDate.toUTCString();

    let cardHovered: boolean = false;

    const cardHoverHandler = () => {

        cardHovered = true;

    };

    const cardExitHandler = () => {

        cardHovered = false;

    };

    let memberCardSelectedId: number | null = null;

    const cardSelectedHandler = (campign_ID: number) => {

        memberCardSelectedId = campign_ID;

        // TeamMemberSelectedStore.update((value) => value = memberCardSelectedId);

    };

</script>

<div 
    tabindex={endorsedActionData.action_ID}
    role="treeitem"
    aria-selected={cardHovered}
    on:focus={() => cardHoverHandler()}
    on:blur={() => cardExitHandler()}
    on:mouseenter={() => cardHoverHandler()}
    on:mouseover={() => cardHoverHandler()}
    on:mouseleave={() => cardExitHandler()}
    on:mouseout={() => cardExitHandler()}
    on:click={() => cardSelectedHandler(endorsedActionData.action_ID)}
    on:keyup={() => cardSelectedHandler(endorsedActionData.action_ID)}
    class={(cardHovered) ? "endorsement_card_hovered" : "endorsement_card"}
>
    
    <div class="image_container">
        <img src={endorsedActionData.image_URL} alt={endorsedActionData.alt_text} />
    </div>
    <div class="endorsement_card_overlay" />
    <div 
        class="meatballs_container"
        style={(cardHovered) ? "fill: #D8EAC5" : "fill: #314659;" }
    >
        {@html MeatBalls}
    </div>
    <div class="card_info_container">
        <h4 class="card_heading_02">
            {#if (actionIsAllDay)}
                {allDayActionDate}
            {:else if (!actionIsAllDay)}
                {actionStartDate} - {actionEndDate}
            {/if}
        </h4>
        <h4 class="card_heading_01">{endorsedActionData.action_name}</h4>
    </div>
</div>

<style>
    .endorsement_card {
        position: relative;
        height: 28rem;
        max-width: 20rem;
        width: 100%;
        will-change: box-shadow;
        transition: box-shadow 0.2s linear;
    }

    .endorsement_card_hovered {
        position: relative;
        height: 28rem;
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
        height: 28rem;
        position: relative;
    }

    .card_info_container {
        position: relative;
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