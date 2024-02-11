<script lang="ts">
    import { v4 as uuidv4 } from 'uuid';
    import Tabs from "$lib/components/tabPanels/secondaryTabPanel/TabsSecondary.svelte";
    import TabPanel from "$lib/components/tabPanels/secondaryTabPanel/PanelSecondary.svelte";
    import ActionsEndorsedPanel from '$lib/components/adminDashboard/ActionsPanels/ActionsEndorsedPanel.svelte';
    import ActionsNominatedPanel from '$lib/components/adminDashboard/ActionsPanels/ActionsNominatedPanel.svelte';

    export let panel_data: any[] = [];

    let activeTab: number = 1;

    $: activeTab;

    let tabPanels: any[];
	
	let endorsedActions: ActionWithImage[];

	$: endorsedActions = [...panel_data[0].table];

	let nominatedActions: ActionWithImageNominated[];

	$: nominatedActions = [...panel_data[1].table];

	$: tabPanels = [
		{
			id: uuidv4(),
            index: 1,
            label: "endorsements",
            hasCapitol: false,
            panel: ActionsEndorsedPanel,
            data: {
					pending: panel_data[0].pending,
					success: panel_data[0].success,
					table: endorsedActions
			}
		},
		{
			id: uuidv4(),
            index: 2,
            label: "nominations",
            hasCapitol: false,
            panel: ActionsNominatedPanel,
            data: {
					pending: panel_data[1].pending,
					success: panel_data[1].success,
					table: nominatedActions
			}
		}
	];
</script>
<div class="tabpanel_container">
    <div class="tabs_container">
		<Tabs
			tabPanels={tabPanels} 
			bind:activeTab={activeTab}
		/>
	</div>
	
	<TabPanel
		tabPanels={tabPanels} 
		bind:activeTab={activeTab}
	/>
    
</div>
<style>
    .tabpanel_container {
		width: 100%;
	}
</style>