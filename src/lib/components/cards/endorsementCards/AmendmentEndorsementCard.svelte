<script lang="ts">
    import MeatBalls from '$lib/images/icons/meaballs.svg?raw';
    import { reverseHtmlEntities } from "$lib/utils/reverseHtmlEntities";
    import { onMount } from 'svelte';
    import { fade } from "svelte/transition";

    let { endorsedAmendmentData }: {endorsedAmendmentData: AmendmentWithSponsorsAndImage } = $props();

    let ready = $state(false);

    // runs automatically on the client after the component mounts
    $effect(() => {
        ready = true;
    });

    let amendmentStatus: string[] = $state([]);

    onMount(() => {

        if (endorsedAmendmentData?.introduced_in_House === 1) {

            amendmentStatus = [...amendmentStatus, " introduced in the House"];

        };
        
        if (endorsedAmendmentData?.introduced_in_Senate === 1) {

            amendmentStatus = [...amendmentStatus, " introduced in the Senate"];

        };
        
        if (endorsedAmendmentData?.twothirds_House_and_Senate_passed === 1) {

            amendmentStatus = [...amendmentStatus, " passed by two-thirds majorities in the House and Senate"];

        };
        
        if (endorsedAmendmentData?.simple_majority_House_and_Senate_passed === 1) {

            amendmentStatus = [...amendmentStatus, " passed by simple majorities in the House and Senate"];

        };
        
        if (endorsedAmendmentData?.simple_majority_voters_passed === 1) {

            amendmentStatus = [...amendmentStatus, " passed by a simple majority of voters"];

        };
        
        if (endorsedAmendmentData?.ratified_by_state_convenctions === 1) {

            amendmentStatus = [...amendmentStatus, " ratified by three-fourths of state conventions called in each state"];

        };

        if (endorsedAmendmentData?.ratified_by_state_legislatures === 1) {

            amendmentStatus = [...amendmentStatus, " ratified by three-fourths of state legislatures"];

        };

    });

    let electionDate: Date | string = $state("");

    let rawElectionDate: Date = $state(new Date());

    let blankDate = new Date("2016-01-01T06:00:00.000Z");

    onMount(() => {

        rawElectionDate = new Date(endorsedAmendmentData.election_date);

        if (rawElectionDate < blankDate) {

            electionDate = "";

        } else {

            electionDate = rawElectionDate.toUTCString().substring(0, 16);;

        };
    });

    let cardHovered: boolean = $state(false);

    const cardHoverHandler = () => {

        cardHovered = true;

    };

    const cardExitHandler = () => {

        cardHovered = false;

    };
    
</script>

{#if ready}
    <div 
        tabindex={endorsedAmendmentData?.amendment_ID}
        role="treeitem"
        aria-selected={cardHovered}
        onfocus={() => cardHoverHandler()}
        onblur={() => cardExitHandler()}
        onmouseenter={() => cardHoverHandler()}
        onmouseover={() => cardHoverHandler()}
        onmouseleave={() => cardExitHandler()}
        onmouseout={() => cardExitHandler()}
        class={(cardHovered) ? "endorsement_card_hovered" : "endorsement_card"}
        in:fade={{ duration: 300 }}
    >
        <div class="image_container">
            <img src={endorsedAmendmentData.image_URL} alt={reverseHtmlEntities(endorsedAmendmentData.alt_text)} />

        </div>
        <div 
            class="meatballs_container"
            style={(cardHovered) ? "fill: #D8EAC5" : "fill: #314659;" }
        >
            {@html MeatBalls}
        </div>
        <div class="card_info_container">
            <h4 class="card_heading_01">{reverseHtmlEntities(endorsedAmendmentData.amendment_name)}</h4>
            <h5 class="card_heading_02">
                <span class="data_category">
                    electorate/jurisdiction: 
                </span>
                {#if (endorsedAmendmentData.city)}
                    {reverseHtmlEntities(endorsedAmendmentData.city)}
                {/if}
                {#if (endorsedAmendmentData.county)}
                    {reverseHtmlEntities(endorsedAmendmentData.county)}
                {/if}
                {#if (endorsedAmendmentData.state)}
                    {reverseHtmlEntities(endorsedAmendmentData.state)}
                {/if}
                United States of America
            </h5>
            {#if (endorsedAmendmentData.election_date)}
                <h5 class="card_heading_02">
                    <span class="data_category">
                        election date: 
                    </span>{electionDate}
                </h5>
            {/if}
            {#if (endorsedAmendmentData.year_released)}
                <h5 class="card_heading_02">
                    <span class="data_category">
                        year released:
                    </span>
                    {endorsedAmendmentData.year_released}
                </h5>
            {/if}
            {#if (endorsedAmendmentData.year_introduced_House)}
                <h5 class="card_heading_02">
                    <span class="data_category">
                        year introduced in House:
                    </span>
                    {endorsedAmendmentData.year_introduced_House}
                </h5>
            {/if}
            {#if (endorsedAmendmentData.year_introduced_Senate)}
                <h5 class="card_heading_02">
                    <span class="data_category">
                        year introduced in Senate:
                    </span>
                    {endorsedAmendmentData.year_introduced_Senate}
                </h5>
            {/if}
            <h5 class="card_heading_02"><span class="data_category">status:</span>
                {reverseHtmlEntities(amendmentStatus.toString())}
            </h5>
        </div>
    </div>
{/if}

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
            min-width: 14rem;
        }

        .endorsement_card_hovered {
            min-width: 14rem;
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