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
            href={item.slug}
            aria-label="link to {item.label} page"
        >
            <li 
                class="{$page.url.pathname === item.slug ? 'mobile_nav_tab_active' : 'mobile_nav_tab'}"
            >
                {item.label}
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
        <ul
            class="expandable_container"
            style={ activeTab === index ? `height: ${height}px` : 'height: 0px;' }
        >
            <div
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
            </div>
        </ul>
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
    
</style>