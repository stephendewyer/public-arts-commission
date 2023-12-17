<script lang="ts">
    import MeatBalls from "$lib/images/icons/meaballs.svg?raw";
    export let endorsedCandidateData: CandidateWithImage;

    let status: string[] = [];

    $: status;

    $: if (endorsedCandidateData.running_in_primary === 1) {

        status.push(" running in the primary");

    };
    
    $: if (endorsedCandidateData.elected_in_primary === 1) {

        status.push(" elected in the primary");

    };
    
    $: if (endorsedCandidateData.rejected_in_primary === 1) {

        status.push(" rejected in the primary");

    };
    
    $: if (endorsedCandidateData.running_in_general === 1) {

        status.push(" running in the general");

    };
    
    $: if (endorsedCandidateData.rejected_in_general === 1) {

        status.push(" rejected in the general");

    };
    
    $: if (endorsedCandidateData.elected_in_general === 1) {
        
        status.push(" elected in the general");

    };

    $: if (endorsedCandidateData.campaign_ended === 1) {
        
        status.push(" campaign ended");

    };

    let primaryElectionDate: string | null = endorsedCandidateData.election_date_primary;

    $: primaryElectionDate;

    let primaryIsValid: boolean = true;

    $: if (primaryElectionDate === "1899-11-30T06:00:00.000Z") {

        primaryElectionDate = "";

        primaryIsValid = false;

    } else {

        primaryElectionDate = rawPrimaryElectionDate.toUTCString().substring(0, 16);;

    };

    let rawPrimaryElectionDate: Date;

    $: rawPrimaryElectionDate = new Date(endorsedCandidateData.election_date_primary);

    let generalElectionDate: string = "";

    let rawGeneralElectionDate: Date;

    $: rawGeneralElectionDate = new Date(endorsedCandidateData.election_date_general);

    $: generalElectionDate = rawGeneralElectionDate.toUTCString().substring(0, 16);;

    let cardHovered: boolean = false;

    // update the team member selected store with the value for the member Id of selected member card

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

    }
</script>
<div 
    tabindex={endorsedCandidateData.campaign_ID}
    role="treeitem"
    aria-selected={cardHovered}
    on:focus={() => cardHoverHandler()}
    on:blur={() => cardExitHandler()}
    on:mouseenter={() => cardHoverHandler()}
    on:mouseover={() => cardHoverHandler()}
    on:mouseleave={() => cardExitHandler()}
    on:mouseout={() => cardExitHandler()}
    on:click={() => cardSelectedHandler(endorsedCandidateData.campaign_ID)}
    on:keyup={() => cardSelectedHandler(endorsedCandidateData.campaign_ID)}
    class={(cardHovered) ? "endorsement_card_hovered" : "endorsement_card"}
>
    <div class="image_container">
        <img
            src={endorsedCandidateData.image_URL} 
            alt={endorsedCandidateData.alt_text} 
        />
    </div>
    <div 
        class="meatballs_container"
        style={(cardHovered) ? "fill: #D8EAC5" : "fill: #314659;" }
    >
        {@html MeatBalls}
    </div>
    <div class="card_info_container">
        <h4 class="card_heading_01">{endorsedCandidateData.campaign_name}</h4>
        <h5 class="card_heading_02">electorate: {endorsedCandidateData.electorate}</h5>
        {#if (primaryIsValid)}
            <h5 class="card_heading_02">primary election date: {primaryElectionDate}</h5>
        {/if}
        <h5 class="card_heading_02">general election date: {generalElectionDate}</h5>
        <h5 class="card_heading_02">status:
            {#each status as item, i}
                {#if (i === status.length -1)}
                    {item}
                {:else}
                    {item},
                {/if}
            {/each}
        </h5>
    </div>
    <div class="invisible_layer" />
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

    }

    @media (max-width: 720px) {
        .endorsement_card {
            max-width: 10rem;
        }

        .endorsement_card_hovered {
            max-width: 10rem;
        }

        .image_container {
            height: 10rem;
        }
    }

</style>