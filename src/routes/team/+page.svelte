<script lang="ts">
    import Tabs from '$lib/components/tabPanels/selectableItemTabPanel/Tabs.svelte';
    import Panel from '$lib/components/tabPanels/selectableItemTabPanel/Panel.svelte';
    import { v4 as uuidv4 } from 'uuid';
    import AllTeam from '$lib/components/team/All.svelte';
    import Staff from '$lib/components/team/Staff.svelte';
    import BoardOfDirectors from '$lib/components/team/BoardOfDirectors.svelte';
    import MemorialHallGalleryDoors from '$lib/images/backgrounds/Boston,_MA_30_October_2017_02.jpg';
    import { TeamMemberSelectedStore } from '$lib/stores/TeamMemberSelectedStore';
    import { TeamMemberSidedrawerOpenStore } from '$lib/stores/TeamMemberSidedrawerOpenStore';
    import { onDestroy } from 'svelte';

    // set the value for the active panel

    let activeTeamTab: number = 0;

    // set the value for member Id of selected member card

    let memberCardSelectId: number | null = null;

    // set the value for sidedrawer open

    let sidedrawerIsOpen: boolean = false;

    // update the sidedrawer open store using sidedrawerIsOpen variable

    $: TeamMemberSidedrawerOpenStore.update((value) => value = sidedrawerIsOpen);    

    // set the value for the selected team member id from store

    let selectedTeamMemberId: number | null = null;

    // get the value for the selected team member id from store

	const unsubscribeTeamMemberSelectedStore = TeamMemberSelectedStore.subscribe((value) => {
		selectedTeamMemberId = value;
	});

    // set the value for the sidedrawer open value from store

    let sideDrawerOpen: boolean = false;

    // get the value for the sidedrawer open value from store

	const unsubscribeTeamMemberSidedrawerOpenStore = TeamMemberSidedrawerOpenStore.subscribe((value) => {
		sideDrawerOpen = value;
	});

    onDestroy(() => {
        unsubscribeTeamMemberSelectedStore();
        unsubscribeTeamMemberSidedrawerOpenStore();
    })

    $: if ((selectedTeamMemberId) && (sidedrawerIsOpen == false)) {
        sidedrawerIsOpen = true;
    } else { 
        sidedrawerIsOpen = false;
    }

    const teamTabPanels: tabPanels[] = [
		{
			id: uuidv4(),
			index: 0,
			label: "all",
			hasCapitol: false,
			panel: AllTeam,
            data: []
		},
		{
			id: uuidv4(),
			index: 1,
			label: "staff",
			hasCapitol: false,
			panel: Staff,
            data: []
		},
		{
			id: uuidv4(),
			index: 2,
			label: "board of directors",
			hasCapitol: false,
			panel: BoardOfDirectors,
            data: []
		}
	]

</script>

<section>
    <div class="panels_container">
        <Tabs 
            tabPanels={teamTabPanels} 
            bind:activeTab={activeTeamTab}
        />
        <Panel 
            tabPanels={teamTabPanels} 
            bind:activeTab={activeTeamTab}
            bind:selectedItemId={memberCardSelectId}
        />		
    </div>
    <div 
		class="board_emeritus_container"
		style="background-image: url({MemorialHallGalleryDoors});"
	>
		<div class="board_emeritus_section">
            <h2>board emeritus</h2>
            <ul class="board_emeritus_list">
                <li>
                    <h3>
                        Andréa Stanislav
                    </h3>
                </li>
                <li>
                    <h3>
                        Stephen Zacks
                    </h3>
                </li>
            </ul>
		</div>
	</div>

</section>

<style>

    .panels_container {
        max-width: 80rem;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .board_emeritus_container {
		width: 100%;
		background-size: cover;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem 1rem;
		background-repeat: no-repeat;
		background-position: center;
	}

	.board_emeritus_section {
		background-color: rgba(239,249,242,0.7);
		max-width: 40rem;
		width: 100%;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

    .board_emeritus_list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
        gap: 2rem;
    }

    @media (max-width: 1440px) {
        
    }

    @media (max-width: 720px) {
        .board_emeritus_list {
            flex-direction: column;
            align-items: center;
            gap: 0rem;
        }
    }

</style>