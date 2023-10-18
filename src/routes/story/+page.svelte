<script lang="ts">
    import Tabs from '$lib/components/tabPanels/Tabs.svelte';
    import TabPanel from '$lib/components/tabPanels/Panel.svelte';
    import { v4 as uuidv4 } from 'uuid';
    import LobbyingPanel from '$lib/components/howWeWork/Lobbying.svelte';
    import ExhibitingPanel from '$lib/components/howWeWork/Exhibiting.svelte';
    import PlatformingPanel from '$lib/components/howWeWork/Platforming.svelte';
    import ConnectingPanel from '$lib/components/howWeWork/Connecting.svelte';

    let activeProcessTab: number = 0;
    $: activeProcessTab;

    const loginTabPanels: tabPanels[] = [
		{
			id: uuidv4(),
			index: 0,
			label: "platforming",
			hasCapitol: false,
			panel: PlatformingPanel
		},
		{
			id: uuidv4(),
			index: 1,
			label: "connecting",
			hasCapitol: false,
			panel: ConnectingPanel
		},
		{
			id: uuidv4(),
			index: 2,
			label: "lobbying",
			hasCapitol: false,
			panel: LobbyingPanel
		},
		{
			id: uuidv4(),
			index: 3,
			label: "exhibiting",
			hasCapitol: false,
			panel: ExhibitingPanel
		}
	]

</script>

<section>
    <h2 class="story_section_heading">
        mission
    </h2>
    <p class="story_paragraphs">
        Focusing directly on art and politics, public arts commission is dedicated to redefining art's relation to the public for greater democracy within and outside art.
    </p>
    <h2 class="story_section_heading">
        how we work
    </h2>
    <Tabs 
        tabPanels={loginTabPanels} 
        bind:activeTab={activeProcessTab}
    />
    <TabPanel
        tabPanels={loginTabPanels} 
        bind:activeTab={activeProcessTab}
    />			
    <h2 class="story_section_heading">
        history
    </h2>
    <h2 class="story_section_heading">
        impact
    </h2>
    <h2 class="story_section_heading">
        organization
    </h2>
    <h2 class="story_section_heading">
        location
    </h2>
</section>

<style>
    .story_section_heading {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .story_paragraphs {
        padding: 0 1rem;
        max-width: 40rem;
        width: 100%;
        margin: 0 auto;
    }
</style>