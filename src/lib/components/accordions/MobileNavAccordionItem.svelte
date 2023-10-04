<script lang="ts">
    import { page } from '$app/stores';

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
            id="tabpanel_header_{item.label}"
            href={item.slug}
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
                            <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 494.31 414.36">
                                <defs>
                                    <style>
                                    .cls-3 {
                                        fill: inherit;
                                        stroke-width: 0px;
                                    }
                                    </style>
                                </defs>
                                <path class="cls-3" d="m287.12,0C193.83,0,114.74,61.98,88.88,146.93h42.48c24.22-62.41,84.91-106.76,155.77-106.76,92.09,0,167.01,74.93,167.01,167.01s-74.93,167.01-167.01,167.01c-70.85,0-131.54-44.35-155.77-106.76h-42.48c25.86,84.95,104.95,146.93,198.24,146.93,114.24,0,207.18-92.95,207.18-207.18S401.36,0,287.12,0Z"/>
                                <polygon class="cls-3" points="0 227.27 0 187.1 272.22 187.1 291.59 206.47 291.59 207.9 272.22 227.27 0 227.27"/>
                            </svg>
                        </div>
                    {/if}
                    {item.label}
                </div>
                <div class={ activeTab === index ? "arrow_active" : "arrow" }>
                    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 329.46 500">
                        <defs>
                        <style>
                            .cls-3 {
                            fill: inherit;
                            stroke-width: 0px;
                            }
                        </style>
                        </defs>
                        <polygon class="cls-3" points="329.46 250 103.48 500 0 500 225.98 250 0 0 103.48 0 329.46 250"/>
                    </svg>
                </div>
            </li>
        </a>
        <div
            class="expandable_container"
            style={ activeTab === index ? `height: ${height}px` : 'height: 0px;' }
            id="{item.label}_tabpanel"
            role="tabpanel"
            tabindex={-index}
            aria-labelledby="tab_header_login"
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