<script lang="ts">
    import { EndorsedCandidateSelectedStore } from "$lib/stores/EndorsedCandidateSelectedStore";
    import { EndorsedCandidateOpenStore } from "$lib/stores/EndorsedCandidateOpenStore";
    import MeatballsIcon from "$lib/images/icons/meaballs.svg?raw";
    import EditIcon from "$lib/images/icons/edit_icon.svg?raw";
    import DeleteIcon from "$lib/images/icons/delete_icon.svg?raw";

    export let panel_data: CandidateWithImage[];

    let activeTab: number = 0;

    $: activeTab;

    const editClickHandler = (campaignID: number) => {

    };

    const deleteClickHandler = (campaignID: number) => {
        
    };

    const moreInfoClickHandler = (campaignID: number, index: number) => {
        EndorsedCandidateSelectedStore.update((value) => value = panel_data[index]);
        EndorsedCandidateOpenStore.update((value) => value = true);
    };

</script>
<div class="tabpanel_container">
    <div class="tabs_container">
        <a
            on:click={() => activeTab = 0} 
            on:keydown={() => activeTab = 0}
            id="tabpanel_header_{0}"
            role="tab"
            aria-selected={activeTab === 0 ? true : false}
            aria-controls="{0}_tabpanel"
            tabindex={0}
        >
            <h3 class={(activeTab === 0) ? "active_tab" : "tab"} >
                endorsed
            </h3>
        </a>
        <a
            on:click={() => activeTab = 1} 
            on:keydown={() => activeTab = 1}
            id="tabpanel_header_{1}"
            role="tab"
            aria-selected={activeTab === 1 ? true : false}
            aria-controls="{1}_tabpanel"
            tabindex={1}
        >
            <h3 class={(activeTab === 1) ? "active_tab" : "tab"}>
                nominated
            </h3>
        </a>
    </div>
    {#if (activeTab === 0)}
        <table>
            <tbody>
                <tr>
                    <th>
                        <h5>
                            campaign name
                        </h5>
                    </th>
                    <th>
                        <h5>
                            election year
                        </h5>
                    </th>
                    <th>
                        <h5>
                            electorate
                        </h5>
                    </th>
                    <th>
                        <h5>
                            edit
                        </h5>
                    </th>
                    <th>
                        <h5>
                            delete
                        </h5>
                    </th>
                    <th>
                        <h5>
                            more info
                        </h5>
                    </th>
                </tr>
                {#each panel_data as campaign, i}
                    <tr>
                        <td>
                            {campaign.campaign_name}
                        </td>
                        <td>
                            {campaign.election_date_general.slice(0, 4)}
                        </td>
                        <td>
                            {campaign.electorate}
                        </td>
                        <td>
                            <button 
                                on:click={() => editClickHandler(campaign.campaign_ID)}
                                on:keyup={() => editClickHandler(campaign.campaign_ID)}
                                class="icon_container"
                            >
                                {@html EditIcon}
                            </button>
                        </td>
                        <td>
                            <button 
                                on:click={() => deleteClickHandler(campaign.campaign_ID)}
                                on:keyup={() => deleteClickHandler(campaign.campaign_ID)}
                                class="icon_container"
                            >
                                {@html DeleteIcon}
                            </button>
                        </td>
                        <td>
                            <button 
                                on:click={() => moreInfoClickHandler(campaign.campaign_ID, i)}
                                on:keyup={() => moreInfoClickHandler(campaign.campaign_ID, i)}
                                class="icon_container"
                            >
                                {@html MeatballsIcon}
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else if (activeTab === 1)}
        nominated candidates
    {/if}
</div>
<style>
    table {
        border-spacing: 0;
        width: 100%;
    }

    tbody tr:nth-child(even) {
        background-color: #FBF4F9;
    }

    tbody > tr > td {
        padding: 1rem;
        font-size: 1.25rem;
        overflow-wrap: break-word;
        hyphens: auto;
    }

    .tabpanel_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .tabs_container {
        display: flex;
        justify-content: center;
        list-style: none;
        margin: 0;
        padding: 0 1rem;
    }

    .tab {
        color: #212121;
        opacity: 50%;
        cursor: pointer;
        background-color: transparent;
        border: none;
        font-size: 1.25rem;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 1rem;
        transition: color 0.2s linear, opacity 0.2s linear;
        position: relative;
    }

    .tab:hover {
        color: #28387C;
        opacity: 100%;
    }

    .active_tab {
        color: #4C4239;
        opacity: 100%;
        cursor: pointer;
        background-color: transparent;
        border: none;
        font-size: 1.25rem;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 1rem;
        position: relative;
    }

    .tab::after {
        --size: 6px;
		content: '';
		height: 6px;
		position: relative;
		top: 0;
		left: 0;
		right: 0;
        bottom: 0;
        width: 100%;
		border: var(--size) solid transparent;
		border-top: none;
		overflow: visible;
    }

    .active_tab::after {
		--size: 6px;
		content: '';
		height: 0;
		position: relative;
		top: 0;
		left: 0;
		right: 0;
        bottom: 0;
        width: 100%;
		border: var(--size) solid transparent;
		border-top: 6px solid #4C4239;
		overflow: visible;
	}

    .icon_container {
        max-width: 1.5rem;
        width: 100%;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        fill: #4C4239;
        margin: 0 auto;
        transition: fill 0.2s linear;
        cursor: pointer;
        border: none;
        padding: 0;
        background-color: transparent;
    }

    .icon_container:hover {
        fill: #28387C;
    }

    @media (max-width: 1440px) {

        .active_tab {
            font-size: 1.1rem;
        }

        .tab {
            font-size: 1.1rem;
        }
    }

    @media (max-width: 720px) {

        .tabs_container {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-wrap: wrap;
            list-style: none;
        }

        .tab {
            font-size: 0.8rem;
            padding: 0 0.5rem;
        }

        .active_tab {
            font-size: 0.8rem;
            padding: 0 0.5rem;
        }

    }
</style>