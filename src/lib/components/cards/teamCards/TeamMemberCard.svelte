<script lang="ts">
    import MeatballsIcon from "$lib/images/icons/meaballs.svg?raw";

    export let memberData: TeamMember;

    let memberCardHovered: boolean = false;

    // update the team member selected store with the value for the member Id of selected member card

    const memberCardActiveHandler = () => {
        memberCardHovered = true;
    };

    const memberCardHandler = () => {
        memberCardHovered = false;
    };

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
>
    <div 
        class="meatballs_container"
        style={(memberCardHovered) ? "fill: #D8EAC5" : "fill: #314659;" }
    >
        {@html MeatballsIcon}
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