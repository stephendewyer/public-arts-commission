<script lang="ts">
    import { page } from '$app/stores';
    import Arrow from "$lib/images/icons/arrow.svg?raw";
    import LoginIcon from "$lib/images/icons/login_icon.svg?raw";

    export let open: boolean = false;
    export let item: AccordionTab;
    export let index: number;
    export let setActiveIndex: number;
    export let activeTab: number;
    export let setActive: boolean;

    $: height = 0;

    $: setActive = false;

    $: setActiveIndex;

    $: activeTab;

    // click function for top tier tabs

    const handle01Click = (item: AccordionTab) => {
        // if item is expandable, keep sidedrawer open, else close sidedrawer
        if (item.expandable) {
            open = open;
        } else {
            open = !open;
        }
        // if tab is currently active, set tab as inactive, else set tab as active
        if (index === activeTab) {
            setActive = false;
            setActiveIndex = -1;
        } else {
            setActiveIndex = index;
            setActive = true;
        }
    }

    // click function for second tier tabs

    const handle02Click = (item: AccordionTab) => {
        // if item is expandable, keep sidedrawer open, else close sidedrawer
        if (item.expandable) {
            open = open;
        } else {
            open = !open;
        }
    }

</script>

<div>
    {#if item.content !== null}
        <a 
            on:click={() => handle01Click(item)}
            href={item.slug}
            id="tabpanel_header_{item.label}"
            role="tab"
            aria-selected={activeTab === index ? true : false}
            aria-controls="{item.label}_tabpanel"
            tabindex={-index}
        >
            <li 
                class="{$page.url.pathname === item.slug ? 'mobile_nav_tab_active' : 'mobile_nav_tab'}"
            >
                <div class="mobile_nav_tab_icon_and_label">
                    {#if item.label === "login"}
                        <div class="nav_icon">
                            {@html LoginIcon}
                        </div>
                    {/if}
                    {item.label}
                </div>
                <div class={ activeTab === index ? "arrow_active" : "arrow" }>
                    {@html Arrow}
                </div>
            </li>
        </a>
        <div
            class="expandable_container"
            style={ activeTab === index ? `height: ${height}px` : 'height: 0px;' }
            id="{item.label}_tabpanel"
            role="tabpanel"
            tabindex={-index}
            aria-labelledby="tabpanel_header_{item.label}"
        >
            <ul
                bind:clientHeight={height}
                class="expandable"
                style={ activeTab === index ? "opacity: 100%;" : "opacity: 0;" }

            >
                {#each item.content as mobileNavTabSecondary}
                    <a 
                        href={mobileNavTabSecondary.slug}
                        on:click={() => handle02Click(mobileNavTabSecondary)} 
                        aria-label="link to {mobileNavTabSecondary.label} page"
                    >
                        <li 
                            class="{$page.url.pathname === mobileNavTabSecondary.slug ? 'mobile_nav_tab_secondary_active' : 'mobile_nav_tab_secondary'}"
                            
                        >    
                            {mobileNavTabSecondary.label}
                            
                        </li>
                    </a>
                {/each}
            </ul>
        </div>
    {:else if item.content === null}
        <a 
            href={item.slug}
            on:click={() => handle01Click(item)} 
            aria-label="link to products page"
        >
            <li 
                class="{$page.url.pathname === item.slug ? 'mobile_nav_tab_active' : 'mobile_nav_tab'}"
            >
                {item.label}
            </li>
        </a>
    {/if}
</div>


<style>

    ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		position: relative;
	}
    
    .mobile_nav_tab {
        color: #D8EAC5;
        fill: #D8EAC5;
        transition: all 0.2s;
        border-color: #D8EAC5;
        border-width: 2px;
        border-style: solid;
        text-decoration: none;
        padding: 0.5rem 1rem;
		font-size: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .arrow {
        width: 0.5rem;
        transform: rotate(180deg);
        will-change: transform;
        transition: transform 0.2s ease-out;
    }

    .arrow_active {
        width: 0.5rem;
        transform: rotate(90deg);
        will-change: transform;
        transition: transform 0.2s ease-out;
    }

    .expandable_container {
        overflow: hidden;
        will-change: height;
        transition: height 0.4s cubic-bezier(0.65, 0.05, 0.36, 1);
    }

    .expandable {
        will-change: opacity;
        transition: opacity 0.4s ease-out;
    }

    .mobile_nav_tab:hover {
        color: #E3CDB2;
        fill: #E3CDB2;
		transition: all 0.2s;
        border-color: #E3CDB2;
    }

    .mobile_nav_tab_active {
        transition: all 0.2s;
        border-color: #D8EAC5;
        fill: #D8EAC5;
        border-width: 2px;
        border-style: solid;
        background-color: #4C4239;
        text-decoration: none;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		color: #D8EAC5;
    }

    .mobile_nav_tab_active:hover {
        color: #E3CDB2;
        border-color: #E3CDB2;
    }

    .mobile_nav_tab_secondary {
        color: #FBF4F9;
        transition: all 0.2s;
        border-color: #FBF4F9;
        border-width: 2px;
        border-style: solid;
        text-decoration: none;
        padding: 0.5rem 1rem 0.5rem 2rem;
		font-size: 1rem;
    }

    .mobile_nav_tab_secondary:hover {
        color: #E3CDB2;
        border-color: #E3CDB2;
    }

    .mobile_nav_tab_secondary_active {
        transition: all 0.2s;
        border-color: #FBF4F9;
        border-width: 2px;
        border-style: solid;
        background-color: #4C4239;
        text-decoration: none;
		padding: 0.5rem 1rem 0.5rem 2rem;
		font-size: 1rem;
		color: #FBF4F9;
    }

    .mobile_nav_tab_secondary_active:hover {
        color: #E3CDB2;
        border-color: #E3CDB2;
    }

    .mobile_nav_tab_icon_and_label {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .nav_icon {
        width: 0.8rem;
    }
    
</style>