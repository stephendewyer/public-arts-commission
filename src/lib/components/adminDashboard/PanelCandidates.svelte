<script lang="ts">
    import { v4 as uuidv4 } from 'uuid';
    import Tabs from "$lib/components/tabPanels/secondaryTabPanel/TabsSecondary.svelte";
    import TabPanel from "$lib/components/tabPanels/secondaryTabPanel/PanelSecondary.svelte";
	import CandidatesAppliedPanel from './CandidatesPanels/CandidatesAppliedPanel.svelte';
	import CandidatesEndorsedPanel from './CandidatesPanels/CandidatesEndorsedPanel.svelte';
	import CandidatesNominatedPanel from './CandidatesPanels/CandidatesNominatedPanel.svelte';

    export let panel_data: any[];

	// $: console.log(panel_data)
        
    let activeTab: number;

	$: activeTab = 1;

	let tabPanels: any[];
	
	let endorsedCandidates: CandidateWithImage[];

	$: endorsedCandidates = [...panel_data[0].table];

	let nominatedCandidates: CandidateWithImageNominated[];

	$: nominatedCandidates = [...panel_data[1].table];

	let candidateApplications: CampaignApplication[];

	$: candidateApplications = [...panel_data[2].table];

	$: tabPanels = [
		{
			id: uuidv4(),
            index: 1,
            label: "endorsements",
            hasCapitol: false,
            panel: CandidatesEndorsedPanel,
            data: {
					pending: panel_data[0].pending,
					success: panel_data[0].success,
					table: endorsedCandidates
			}
		},
		{
			id: uuidv4(),
            index: 2,
            label: "applications",
            hasCapitol: false,
            panel: CandidatesAppliedPanel,
            data: {
					pending: panel_data[2].pending,
					success: panel_data[2].success,
					table: candidateApplications
			}
		},
		{
			id: uuidv4(),
            index: 3,
            label: "nominations",
            hasCapitol: false,
            panel: CandidatesNominatedPanel,
            data: {
					pending: panel_data[1].pending,
					success: panel_data[1].success,
					table: nominatedCandidates
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