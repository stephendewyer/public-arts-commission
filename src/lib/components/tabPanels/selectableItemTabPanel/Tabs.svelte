<script lang="ts">
    import CapitolIcon from "$lib/images/icons/capitol.svg?raw";
    export let tabPanels: tabPanels[];
    export let activeTab: number;

</script>
<ul class="tabs_container">
    {#each tabPanels as tab, i}
        <li 
            class={activeTab === tab.index ? "active_tab" : "tab"}
            on:click={() => activeTab = tab.index} 
            on:keydown={() => activeTab = tab.index}
            id={`tabpanel_header_${tab.label}`}
            role="tab"
            aria-selected={activeTab === i ? true : false}
            aria-controls={`${tab.label}_tabpanel`}
            tabindex={-i}
        >
            {#if tab.hasCapitol}
                <div class={activeTab === tab.index ? "capitolIcon_active" : "capitolIcon"}>
                    {@html CapitolIcon}
                </div>
            {/if}
            {tab.label}
        </li>
    {/each}
</ul>

<style>

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
        font-size: 1.5rem;
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

    .tab:hover > .capitolIcon {
        fill: #28387C;
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

    .capitolIcon {
        width: 100%;
        max-width: 4rem;
        fill: #4C4239;
        transition: fill 0.2s linear;
    }

    .capitolIcon_active {
        width: 100%;
        max-width: 4rem;
        fill: #4C4239;
        transition: fill 0.2s linear;
    }

    @media (max-width: 1440px) {

        .tabs_container {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            list-style: none;
        }

        .active_tab {
            font-size: 1.35rem;
        }

        .tab {
            font-size: 1.35rem;
        }
    }
  
    @media (max-width: 720px) {

        .tab {
            font-size: 1rem;
            padding: 0 0.5rem;
        }

        .active_tab {
            font-size: 1rem;
            padding: 0 0.5rem;
        }

        .capitolIcon {
            max-width: 2rem;
        }

        .capitolIcon_active {
            max-width: 2rem;
        }
    }

</style>