<script lang="ts">
    import MeatBalls from '$lib/images/icons/meaballs.svg?raw';
    import { reverseHtmlEntities } from "$lib/utils/reverseHtmlEntities";
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { page } from '$app/state';

    let { endorsedReferendumData }: { endorsedReferendumData: ReferendumWithImage } = $props();

    let ready = $state(false);

    // runs automatically on the client after the component mounts
    $effect(() => {
        ready = true;
    });

    let referendumStatus: string[] = $state([]);

    onMount(() => {
        
        if (endorsedReferendumData.elected === 1) {

            referendumStatus = [...referendumStatus, " elected by voters"];

        };
        
        if (endorsedReferendumData.rejected === 1) {

            referendumStatus = [...referendumStatus, " rejected by voters"];

        };
        
        if (endorsedReferendumData.pending_election === 1) {

            referendumStatus = [...referendumStatus, " pending election by voters"];

        };
    });
    
    let rawElectionDate: Date = $state(new Date());

    onMount(() => {
        rawElectionDate = new Date (endorsedReferendumData.election_date);
    });

    let electionDate: string = $state("");

    onMount(() => {
        electionDate = rawElectionDate.toUTCString().substring(0, 16);
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
    <a
        href={`${page.url.pathname}?referendum_ID=${endorsedReferendumData.referendum_ID}&referendum_name=${endorsedReferendumData.referendum_name.replace(/ /g,"_")}`}
        data-sveltekit-noscroll
    >
        <div 
            tabindex={endorsedReferendumData.referendum_ID}
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
                <img 
                    src={endorsedReferendumData.image_URL} 
                    alt={reverseHtmlEntities(endorsedReferendumData.alt_text)} 
                />
            </div>
            <div 
                class="meatballs_container"
                style={(cardHovered) ? "fill: #D8EAC5" : "fill: #314659;" }
            >
                {@html MeatBalls}
            </div>
            <div class="card_info_container">
                <h4 class="card_heading_01">{reverseHtmlEntities(endorsedReferendumData.referendum_name)}</h4>
                <h5 class="card_heading_02">
                    <span class="data_category">
                        electorate: 
                    </span>
                    {#if (endorsedReferendumData.city)}
                        {reverseHtmlEntities(endorsedReferendumData.city)}
                    {/if}
                    {#if (endorsedReferendumData.county)}
                        {reverseHtmlEntities(endorsedReferendumData.county)}
                    {/if}
                    {#if (endorsedReferendumData.state)}
                        {reverseHtmlEntities(endorsedReferendumData.state)}
                    {/if}
                    United States of America
                </h5>
                {#if (endorsedReferendumData.election_date)}
                    <h5 class="card_heading_02">
                        <span class="data_category">
                            election date: 
                        </span>{electionDate}
                    </h5>
                {/if}
                <h5 class="card_heading_02"><span class="data_category">status:</span>
                    {reverseHtmlEntities(referendumStatus.toString())}
                </h5>
            </div>
        </div>
    </a>
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
            max-width: 100%;
        }


        .endorsement_card_hovered {
            min-width: 14rem;
            max-width: 100%;
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