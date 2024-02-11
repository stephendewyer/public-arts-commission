<script lang="ts">
    import { v4 as uuidv4 } from 'uuid';
    import Tabs from "$lib/components/tabPanels/secondaryTabPanel/TabsSecondary.svelte";
    import TabPanel from "$lib/components/tabPanels/secondaryTabPanel/PanelSecondary.svelte";
    import AmendmentsEndorsedPanel from '$lib/components/adminDashboard/AmendmentsPanels/AmendmentsEndorsedPanel.svelte';
    import AmendmentsNominatedPanel from '$lib/components/adminDashboard/AmendmentsPanels/AmendmentsNominatedPanel.svelte';

    export let panel_data: any[] = [];

    let activeTab: number = 1;

    $: activeTab;

    let tabPanels: any[];
	
	let endorsedAmendments: AmendmentWithSponsorsAndImage[];

	$: endorsedAmendments = [...panel_data[0].table];

	let nominatedAmendments: AmendmentWithSponsorsAndImageNominated[];

	$: nominatedAmendments = [...panel_data[1].table];

	$: tabPanels = [
		{
			id: uuidv4(),
            index: 1,
            label: "endorsements",
            hasCapitol: false,
            panel: AmendmentsEndorsedPanel,
            data: {
					pending: panel_data[0].pending,
					success: panel_data[0].success,
					table: endorsedAmendments
			}
		},
		{
			id: uuidv4(),
            index: 2,
            label: "nominations",
            hasCapitol: false,
            panel: AmendmentsNominatedPanel,
            data: {
					pending: panel_data[1].pending,
					success: panel_data[1].success,
					table: nominatedAmendments
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