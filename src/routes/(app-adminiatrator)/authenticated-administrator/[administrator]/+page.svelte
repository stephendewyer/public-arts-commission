<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
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
    import SubmitButtonSecondary from '$lib/components/buttons/SubmitButtonSecondary.svelte';
    import AddItemButton from '$lib/components/buttons/AddItemButton.svelte';
    import { page } from '$app/stores';
    import GovernmentLevels from '$lib/data/governmentLevel.json';

    const slug: string = $page.url.pathname;

    export let data;

    $: data;

    let endorsedCandidates: CandidateWithImage[] = [];

	$: endorsedCandidates = [...data.streamed.endorsed_candidates];

    let endorsedLegislation: LegislationWithSponsorsAndImage[] = [];

	$: endorsedLegislation = [...data.streamed.endorsed_legislation];

    // $: console.log(endorsedLegislation);

    let endorsedAmendments: AmendmentWithSponsorsAndImage[] = [];

	$: endorsedAmendments = [...data.streamed.endorsed_amendments];

    let endorsedReferendums: ReferendumWithImage[] = [];

	$: endorsedReferendums = [...data.streamed.endorsed_referendums];

    let endorsedActions: ActionWithImage[] = [];

	$: endorsedActions = [...data.streamed.endorsed_actions];

    let username = data.streamed.username;

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

    const governmentLevelOptions = GovernmentLevels;

    let campaignAndActionsTabPanels: tabPanels[];

    $: campaignAndActionsTabPanels = [
        {
            id: uuidv4(),
            index: 0,
            label: "candidates",
            hasCapitol: false,
            panel: PanelCandidates,
            data: endorsedCandidates
        },
        {
            id: uuidv4(),
            index: 1,
            label: "referendums",
            hasCapitol: false,
            panel: PanelReferendums,
            data: endorsedReferendums
        },
        {
            id: uuidv4(),
            index: 2,
            label: "legislation",
            hasCapitol: false,
            panel: PanelLegislation,
            data: endorsedLegislation
        },
        {
            id: uuidv4(),
            index: 3,
            label: "amendments",
            hasCapitol: false,
            panel: PanelAmendments,
            data: endorsedAmendments
        },
        {
            id: uuidv4(),
            index: 4,
            label: "actions",
            hasCapitol: false,
            panel: PanelActions,
            data: endorsedActions
        }
    ];

    const filterHandler = async () => {

    };

</script>
<svelte:head>
	<title>administrator dashboard for {username} - public arts commission</title>
	<meta name="description" content="manage endorsements and nominations" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
{#if (username)}
    <h1>welcome, {username}!</h1>
{/if}
<div class="menu">
    <FilterToggleButton bind:openFilters={openFilters}>
        filters
    </FilterToggleButton>
    <div class="endorsement_options">
        <h2 class="endorsement_heading">
            endorsement:
        </h2>
        <div class="endorsement_buttons">
            <a href={`${slug}/add-candidate-endorsement`}>
                <AddItemButton>candidate</AddItemButton>
            </a>
            <a href={`${slug}/add-referendum-endorsement`}>
                <AddItemButton>referendum</AddItemButton>
            </a>
            <a href={`${slug}/add-legislation-endorsement`}>
                <AddItemButton>legislation</AddItemButton>
            </a>
            <a href={`${slug}/add-amendment-endorsement`}>
                <AddItemButton>amendment</AddItemButton>
            </a>
            <a href={`${slug}/add-action-endorsement`}>
                <AddItemButton>action</AddItemButton>
            </a>
        </div>
    </div>
</div>
<div class="filters_and_panels">
    <div class={(openFilters) ? "filters_form_container_open" : "filters_form_container_closed"}>
        <div class={(openFilters) ? "filters_form_open" : "filters_form_closed"}>
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

    .menu {
        background-color: #FBEFF6;
        padding: 1rem 0;
        display: flex;
        flex-direction: row;
    }

    .endorsement_options {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 0.5rem;
        align-items: center;
        width: 100%;
    }

    .endorsement_buttons {
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;
    }

    .panel {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem 0;
    }

    .filters_and_panels {
        display: flex;
        flex-direction: row;
    }

    .filters_form_container_open {
        background-color: #CBC6C2;
		position: relative;
		width: 26rem;
		min-width: 26rem;
		margin-left: 0;
		will-change: margin-left;
		transition: margin-left 0.3s ease-out;
	}

	.filters_form_container_closed {
        background-color: #CBC6C2;
		position: relative;
		width: 26rem;
		min-width: 26rem;
		margin-left: -26rem;
		will-change: margin-left;
		transition: margin-left 0.3s ease-out;
	}

	.filters_form_open {
		position: relative;
		padding: 1rem 2rem;
		width: 100%;
		will-change: transform;
		transform: translateX(0);
		transition: transform 0.3s ease-out;
		text-align: center;
	}

	.filters_form_closed {
		position: relative;
		padding: 1rem 2rem;
		transform: translateX(-100%);
		width: 100%;
		will-change: transform;
		transition: transform 0.3s ease-out;
		text-align: center;
	}

    @media (max-width: 1440px) {

    }

    @media (max-width: 720px) {

        .menu {
            padding: 1rem;
            flex-direction: column-reverse;
            align-items: center;
            gap: 1rem;

        }
        .endorsement_heading {
            margin: 0;
        }

        .endorsement_options {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 0.5rem;
            align-items: center;
            width: 100%;
        }

        .filters_and_panels {
            display: flex;
            flex-direction: column;
        }

        .filters_form_container_open {
			position: relative;
			width: 100%;
			min-width: 100%;
			margin-left: 0;
			height: 100%;
			will-change: height;
			overflow: hidden;
			transition: height 0.3s ease-out;
		}

		.filters_form_container_closed {
			position: relative;
			width: 100%;
			min-width: 100%;
			margin-left: 0;
			height: 0;
			will-change: height;
			overflow: hidden;
			transition: height 0.3s ease-out;
		}

		.filters_form_open {
			position: relative;
			padding: 1rem;
			width: 100%;
			height: 100%;
			will-change: transform;
			transform: translateY(0) translateX(0);
			transition: transform 0.3s ease-out;
		}

		.filters_form_closed {
			position: relative;
			padding: 1rem;
			width: 100%;
			height: 100%;
			will-change: transform;
			transform: translateY(-100%) translateX(0);
			transition: transform 0.3s ease-out;
		}

    }

</style>