<script lang="ts">
    export let tabPanels: tabPanels[];
    export let activeTab: number;
</script>
<ul class="tabs_container">
    {#each tabPanels as tab, i}
        <li 
            class={activeTab === tab.index ? "active_tab" : "tab"}
            on:click={() => activeTab = tab.index} 
            on:keydown={() => activeTab = tab.index}
            id="tabpanel_header_{tab.label}"
            role="tab"
            aria-selected={activeTab === i ? true : false}
            aria-controls="{tab.label}_tabpanel"
            tabindex={-i}
        >
            {tab.label}
        </li>
    {/each}
</ul>

<style>
    .tabs_container {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .tab {
        color: #212121;
        opacity: 50%;
        cursor: pointer;
        background-color: transparent;
        border: none;
        font-size: 1.5rem;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        padding: 0 1rem;
        transition: color 0.2s linear, opacity 0.2s linear;
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
        font-size: 1.5rem;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        padding: 0 1rem;
    }

    .active_tab::after {
		--size: 6px;
		content: '';
		height: 0;
		position: relative;
		top: 0;
		left: 0;
		right: 0;
		border: var(--size) solid transparent;
		border-top: 6px solid #4C4239;
		overflow: visible;
	}

    @media (max-width: 1440px) {
        .active_tab {
            font-size: 1.35rem;
        }

        .tab {
            font-size: 1.35rem;
        }
      }
  
      @media (max-width: 720px) {
        .active_tab {
            font-size: 1.2rem;
        }

        .tab {
            font-size: 1.2rem;
        }
      }

</style>