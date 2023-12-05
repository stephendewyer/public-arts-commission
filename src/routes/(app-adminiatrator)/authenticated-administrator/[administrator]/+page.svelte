<script lang="ts">
    import FilterToggleButton from '$lib/components/buttons/FilterToggleButton.svelte';
    import { v4 as uuidv4 } from 'uuid';
    import Tabs from '$lib/components/tabPanels/Tabs.svelte';
    import Panel from '$lib/components/tabPanels/Panel.svelte';
    import PanelActions from '$lib/components/adminDashboard/PanelActions.svelte';
    import PanelAmendments from '$lib/components/adminDashboard/PanelAmendments.svelte';
    import PanelCandidates from '$lib/components/adminDashboard/PanelCandidates.svelte';
    import PanelLegislation from '$lib/components/adminDashboard/PanelLegislation.svelte';
    import PanelReferendums from '$lib/components/adminDashboard/PanelReferendums.svelte';
    import SearchInput from '$lib/components/inputs/SearchInput.svelte';
    import NumberInput from '$lib/components/inputs/NumberInput.svelte';
    import SelectInput from '$lib/components/inputs/SelectInput.svelte';
    import States from '$lib/data/states.titlecase.json';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import SubmitButton from '$lib/components/buttons/SubmitButton.svelte';
  import SubmitButtonSecondary from '$lib/components/buttons/SubmitButtonSecondary.svelte';

    export let data;

    $: username = data.username;  

    let openFilters: boolean;

    let activeTab: number = 0;

    let searchInputValue: string = "";
    let yearInputValue: number;
    let governmentLevelInputValue: string = "";
    let stateInputValue: string = "";
    let countyInputValue: string = "";
    let cityInputValue: string = "";
    let zipCodeInputValue: number;

    let searchInputValueChange: string = "";

    interface GovernmentLevel {
        name: string;
    };

    const governmentLevelOptions: GovernmentLevel[] = [
        {
            name: "federal"
        },
        {
            name: "state"
        },
        {
            name: "county"
        },
        {
            name: "city"
        }
    ];

    const campaignAndActionsTabPanels: tabPanels[] = [
		{
			id: uuidv4(),
			index: 0,
			label: "candidates",
			hasCapitol: false,
			panel: PanelCandidates
		},
		{
			id: uuidv4(),
			index: 1,
			label: "referendums",
			hasCapitol: false,
			panel: PanelReferendums
		},
		{
			id: uuidv4(),
			index: 2,
			label: "legislation",
			hasCapitol: false,
			panel: PanelLegislation
		},
		{
			id: uuidv4(),
			index: 3,
			label: "amendments",
			hasCapitol: false,
			panel: PanelAmendments
		}
        ,
		{
			id: uuidv4(),
			index: 4,
			label: "actions",
			hasCapitol: false,
			panel: PanelActions
		}
	];


    const filterHandler = async () => {

    }

</script>

<h1>welcome, {username}!</h1>
<div class="menu">
    <FilterToggleButton bind:openFilters={openFilters}>
        filters
    </FilterToggleButton>

</div>
<div class="filters_and_panels">
    <div class="filters">
        <form on:submit|preventDefault={filterHandler}>
            <SearchInput 
                placeholder="campaign name or action"
                inputName="campaign_name_or_action"
                inputID="campaign_name_or_action"
                inputLabel={true}
                bind:searchInputValue={searchInputValue}
                bind:searchInputValueChange={searchInputValueChange}
            >
            search name
            </SearchInput>
            <NumberInput
                placeholder="year"
                inputName="year"
                inputID="year"
                inputLabel={true}
                bind:numberInputValue={yearInputValue}
                numberInputErrorMessage=""
                isValid={true}
                required={false}
            >
                year
            </NumberInput>
            <SelectInput 
                options={governmentLevelOptions}
                bind:selectInputValue={governmentLevelInputValue}
                isValid={true}
                required={false}
                inputID="government_level"
                inputName="government_level"
                selectInputErrorMessage=""
                inputLabel={true}
            >
                government level
            </SelectInput>
            <SelectInput 
                options={States}
                bind:selectInputValue={stateInputValue}
                isValid={true}
                required={false}
                inputID="state"
                inputName="state"
                selectInputErrorMessage=""
                inputLabel={true}
            >
                state
            </SelectInput>
            <TextInput
                inputID="county"
                inputName="county"
                placeholder="Oakland"
                isValid={true}
                required={false}
                textInputErrorMessage=""
                bind:textInputValue={countyInputValue}
                inputLabel={true}
            >
                county
            </TextInput>
            <TextInput
                inputID="city"
                inputName="city"
                isValid={true}
                required={false}
                placeholder="Bloomfield Hills"
                textInputErrorMessage=""
                bind:textInputValue={cityInputValue}
                inputLabel={true}
            >
                city
            </TextInput>
            <NumberInput
                inputID="zip_code"
                inputName="zip_code"
                isValid={true}
                required={false}
                placeholder="48301"
                numberInputErrorMessage=""
                bind:numberInputValue={zipCodeInputValue}
                inputLabel={true}
            >
                zip code
            </NumberInput>
            <SubmitButtonSecondary disable={false}>
                filter
            </SubmitButtonSecondary>
        </form>
        
    </div>
    <div class="panel">
        <Tabs
            tabPanels={campaignAndActionsTabPanels} 
            bind:activeTab={activeTab}
        />
        <Panel
            tabPanels={campaignAndActionsTabPanels} 
            bind:activeTab={activeTab}
        />
    </div>
</div>



<style>
    h1 {
        margin: 0 auto 1rem auto;
    }

    .filters_and_panels {
        display: flex;
    }

    .menu {
        background-color: #FBEFF6;
        padding: 1rem 0;
    }

    .filters {
        width: 20%;
        max-width: 40rem;
        min-width: 20rem;
        background-color: #CBC6C2;
        padding: 1rem;
    }
</style>