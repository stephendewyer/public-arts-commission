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
    })

</script>

<aside 
    class={ (sideDrawerOpen) ? "side_drawer_open" : "side_drawer_closed" }
    aria-hidden={ (sideDrawerOpen) ? 'false' : 'true'}
>
    {#each data as teamMember, i}
        {#if teamMember.index === memberCardSelectId}
            <div>
                <picture>
                    <img src={teamMember.imageSource} alt={teamMember.imageAltText} />
                </picture>
                <h2>
                    {teamMember.name}
                </h2>
                <h3>
                    {teamMember.title}
                </h3>
                <p>
                    {@html teamMember.bio}
                </p>
                <a href={`mailto:${teamMember.email}`}>
                    {teamMember.email}
                </a>
                {#if (teamMember.urlAddress !== null)}
                    {#each teamMember.urlAddress as url, i}
                        <a href={url} target="_blank">
                            {url}
                        </a>
                    {/each}
                {/if}
            </div>
        {/if}
    {/each}

    test
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
    
    @media (min-width: 1140px) {


    }

</style>