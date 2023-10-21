<script lang="ts">
    import { TeamMemberSelectedStore } from '$lib/stores/TeamMemberSelectedStore';
    import { SidedrawerOpenStore } from '$lib/stores/SidedrawerOpenStore';
    import { onDestroy } from 'svelte';
    import TeamMemberData from '$lib/data/teamMembers.json'

    const data: TeamMember[] = TeamMemberData;

    let memberCardSelectId: number | null = null;

    const unsubscribeTeamMemberSelectedStore = TeamMemberSelectedStore.subscribe(n => {
		memberCardSelectId = n;
    });

    // set the value for the sidedrawer open value from store

    let sideDrawerOpen: boolean = false;

    // get the value for the sidedrawer open value from store

	const unsubscribeSidedrawerOpenStore = SidedrawerOpenStore.subscribe((value) => {
		sideDrawerOpen = value;
	});

    onDestroy(() => {
        unsubscribeTeamMemberSelectedStore();
        unsubscribeSidedrawerOpenStore();
    });

    const closeClickHandler = () => {
        sideDrawerOpen = false;
        SidedrawerOpenStore.update((value) => value = sideDrawerOpen);
        TeamMemberSelectedStore.update((value) => value = null);
    }

</script>

<aside 
    class={ (sideDrawerOpen) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ (sideDrawerOpen) ? 'false' : 'true'}
>
    <div class="close_button_container">
        <button 
            class="close_button"
            on:click={() => closeClickHandler()}
            on:keyup={() => closeClickHandler()}
        >
            <svg 
                id="Layer_1" 
                data-name="Layer 1" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 442.55 442.56"
            >
                <defs>
                <style>
                    .cls-10 {
                    fill: inherit;
                    stroke-width: 0px;
                    }
                </style>
                </defs>
                <polygon class="cls-10" points="278.2 221.28 442.55 385.63 385.63 442.56 221.28 278.21 56.93 442.56 0 385.63 164.35 221.28 0 56.93 56.93 0 221.28 164.35 385.63 0 442.55 56.93 278.2 221.28"/>
            </svg>
        </button>
    </div>
    {#each data as teamMember, i}
        {#if teamMember.index === memberCardSelectId}
            <div>
                <picture>
                    <img src={teamMember.imageSource} alt={teamMember.imageAltText} />
                </picture>
                <div class="info_container">
                    <h2>
                        {teamMember.name}
                    </h2>
                    <h3>
                        {teamMember.title}
                    </h3>
                    <p>
                        {@html teamMember.bio}
                    </p>
                    {#if (teamMember.email !== null)}
                        <h4 class="info_heading">
                            email
                        </h4>
                        <a href={`mailto:${teamMember.email}`}>
                            {teamMember.email}
                        </a>
                    {/if}
                    {#if (teamMember.urlAddress !== null)}
                        <h4 class="info_heading">
                            website(s)
                        </h4>
                        <ul>
                            {#each teamMember.urlAddress as url, i}
                                <a href={url} target="_blank">
                                    <li>
                                        {url}
                                    </li>
                                </a>
                            {/each}
                        </ul>
                    {/if}
                </div>
                
            </div>
        {/if}
    {/each}
</aside>

<style>

    aside {
        z-index: 52;
    }

    .side_drawer_closed {
        position: absolute;
        height: 100%;
        width: 100%;
        max-width: 40rem;
        background-color: #F4F5FB;
        left: auto;
        right: 0;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    }

    .side_drawer_open {
        position: absolute;
        height: 100%;
        width: 100%;
        max-width: 40rem;
        background-color: #F4F5FB;
        top: 0;
        right: 0;
        left: auto;
        width: auto;
        transform: translateX(0);
        transition: transform 0.3s ease-in-out;
    }

    .close_button_container {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

    .close_button {
        outline: none;
        border: none;
        background-color: none;
        fill: #4C4239;
        transition: fill 0.2s linear;
        width: 3rem;
        margin: 1rem;
        cursor: pointer;
    }

    .close_button:hover {
        fill: #CB6D44;
    }

    .info_container {
        padding: 1rem 2rem;
    }

    .info_heading {
        text-decoration: underline;
    }
    
    @media (min-width: 1140px) {


    }

</style>