<script lang="ts">

    export let memberData: TeamMember;

    export let memberCardHovered: boolean = false;

    export let memberCardSelectedId: number | null = null;

    const memberCardActiveHandler = () => {
        memberCardHovered = true;
    }

    const memberCardHandler = () => {
        memberCardHovered = false;
    }

    const memberCardSelectedHandler = (index: number) => {
        memberCardSelectedId = index;
        // do something to register index on each click for every index, not just different
    }

</script>

<div 
    tabindex={memberData.index}
    class={(memberCardHovered) ? "card_container_active" : "card_container"}
    role="treeitem"
    aria-selected={memberCardHovered}
    on:focus={() => memberCardActiveHandler()}
    on:blur={() => memberCardHandler()}
    on:mouseenter={() => memberCardActiveHandler()}
    on:mouseover={() => memberCardActiveHandler()}
    on:mouseleave={() => memberCardHandler()}
    on:mouseout={() => memberCardHandler()}
    on:click={() => memberCardSelectedHandler(memberData.index)}
    on:keyup={() => memberCardSelectedHandler(memberData.index)}
>
    <div 
        class="meatballs_container"
        style={(memberCardHovered) ? "fill: #D8EAC5" : "fill: #314659;" }
    >
        <svg 
            id="Layer_1" 
            data-name="Layer 1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 473.18 122.14"
        >
            <defs>
            <style>
                .cls-8 {
                    stroke: none;
                    fill: inherit;
                }
            </style>
            </defs>
            <circle class="cls-8" cx="61.07" cy="61.07" r="61.07"/>
            <circle class="cls-8" cx="412.12" cy="61.07" r="61.07"/>
            <circle class="cls-8" cx="236.59" cy="61.07" r="61.07"/>
        </svg>
    </div>
    <picture class="profile_image_container">
        <img src={memberData.imageSource} alt={memberData.imageAltText}/>
    </picture>
    <div class="profile_information_container">
        
        <h3>
            {memberData.name}
        </h3>
        <h4>
            {memberData.title}
        </h4>
    </div>

</div>

<style>

    .card_container {
        position: relative;
        width: 100%;
        max-width: 16rem;
        background-color: #F4F5FB;
        will-change: box-shadow;
        transition: box-shadow 0.2s ease-out;
        cursor: pointer;
    }

    .card_container_active {
        position: relative;
        width: 100%;
        max-width: 16rem;
        background-color: #F4F5FB;
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

    .profile_image_container {
        height: 16rem;
        object-fit: cover;
    }

    .profile_information_container {
        padding: 1rem;
    }

    .profile_information_container > h4 {
        line-height: 1.5rem;
    }

</style>