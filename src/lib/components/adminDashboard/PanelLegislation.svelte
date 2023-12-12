<script lang="ts">
    import MeatballsIcon from "$lib/images/icons/meaballs.svg?raw";
    export let panel_data: Legislation[];

    let activeTab: number = 0;

    $: activeTab;

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
        endorsed candidates
    {:else if (activeTab === 1)}
        nominated candidates
    {/if}
</div>
<style>

    .tabpanel_container {
        display: flex;
        flex-direction: column;
        align-items: center;
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