<script lang="ts">
    import { page } from '$app/stores';

    import Accordion from '$lib/components/accordions/MobileNavAccordion.svelte';

    export let open = false;

    const mobileNavTabs: AccordionTab[] = [
        {
            label: "products",
            expandable: false,
            content: null
        },
        {
            label: "endorsements",
            expandable: false,
            content: null
        }, 
        {
            label: "actions",
            expandable: false,
            content: null
        },
        {
            label: "priorities",
            expandable: false,
            content: null
        },
        {
            label: "about",
            expandable: true,
            content: [
                {
                    label: "story",
                    expandable: false,
                    content: null
                },
                {
                    label: "team",
                    expandable: false,
                    content: null
                }
            ]
        },
        {
            label: "donate",
            expandable: false,
            content: null
        },
        {
            label: "contact",
            expandable: false,
            content: null
        },
        {
            label: "login",
            expandable: true,
            content: [
                {
                    label: "voter",
                    expandable: false,
                    content: null
                },
                {
                    label: "campaign",
                    expandable: false,
                    content: null
                },
                {
                    label: "administrator",
                    expandable: false,
                    content: null
                }
            ]
        }
    ]
</script>

<aside 
    class="{ (open) ? 'side_drawer_open' : 'side_drawer_closed' }"
    aria-hidden="{ (open) ? 'false' : 'true'}"
>
    <nav>
        <Accordion mobileNavTabsData={mobileNavTabs}/>
        <ul>
            <a 
                href="/products" 
                on:click={() => open = !open} 
                aria-label="link to products page"
            >
                <li
                    class="{$page.url.pathname === '/products' ? 'mobile_nav_tab_active' : 'mobile_nav_tab'}"
                >
                    products
                </li>
            </a>
            <a 
                    href="/endorsements" 
                    on:click={() => open = !open}
                    aria-label="link to endorsements page"
                >
                <li
                    class="{$page.url.pathname === '/endorsements' ? 'mobile_nav_tab_active' : 'mobile_nav_tab'}"
                >
                    
                        endorsements
                    
                </li>
            </a>
            <a 
                href="/actions" 
                on:click={() => open = !open} 
                aria-label="link to actions page"
            >
                <li
                    class="{$page.url.pathname === '/actions' ? 'mobile_nav_tab_active' : 'mobile_nav_tab'}"
                >
                    actions
                </li>
            </a>
            <a 
                href="/priorities" 
                on:click={() => open = !open} 
                aria-label="link to priorities page"
            >
                <li
                    class="{$page.url.pathname === '/priorities' ? 'mobile_nav_tab_active' : 'mobile_nav_tab'}"
                >
                    priorities
                </li>
            </a>
            <a 
                href="/#" 
                on:click={() => open = !open} 
                aria-label="about nav tab"
            >
                <li
                    class="{$page.url.pathname === ('/story' || '/team') ? 'mobile_nav_tab_active' : 'mobile_nav_tab'}"
                >
                    about
                </li>
            </a>
            <a 
                href="/donate" 
                on:click={() => open = !open} 
                aria-label="link to donate page"
            >
                <li
                    class="{$page.url.pathname === '/donate' ? 'mobile_nav_tab_active' : 'mobile_nav_tab'}"
                >
                    
                        donate
                    
                </li>
            </a>
            <a 
                href="/contact" 
                on:click={() => open = !open} 
                aria-label="link to contact page"
            >
                <li
                    class="{$page.url.pathname === '/contact' ? 'mobile_nav_tab_active' : 'mobile_nav_tab'}"
                >
                    contact
                </li>
            </a>
            <a 
                href="/#" 
                on:click={() => open = !open} 
                aria-label="login nav tab"
            >
                <li
                    class="{$page.url.pathname === ('/login-administrator' || '/login-voter' || '/login-campaign') ? 'mobile_nav_tab_active' : 'mobile_nav_tab'}"
                >
                    login
                </li>
            </a>
        </ul>
    </nav>
    
</aside>

<style>
    aside {
        z-index: 50;
    }

    .side_drawer_closed {
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: #3F5A72;
        left: 2rem;
        right: 0;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    }

    .side_drawer_open {
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: #3F5A72;
        top: 0;
        right: 0;
        left: 2rem;
        width: auto;
        transform: translateX(0);
        transition: transform 0.3s ease-in-out;
    }

    ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		position: relative;
	}

    nav {
        width: 100%;
        padding: 4rem 2rem;
	}

    .mobile_nav_tab {
        color: #D8EAC5;
        transition: all 0.2s;
        border-color: #D8EAC5;
        border-width: 2px;
        border-style: solid;
        text-decoration: none;
        padding: 0.5rem 1rem;
		font-size: 1.25rem;
    }

    .mobile_nav_tab:hover {
        color: #E3CDB2;
		transition: all 0.2s;
        border-color: #E3CDB2;
    }

    .mobile_nav_tab_active {
        transition: all 0.2s;
        border-color: #D8EAC5;
        border-width: 2px;
        border-style: solid;
        background-color: #4C4239;
        text-decoration: none;
		padding: 0.5rem 1rem;
		font-size: 1.25rem;
		color: #D8EAC5;
    }

    .mobile_nav_tab_active:hover {
        color: #E3CDB2;
        border-color: #E3CDB2;
    }

    @media (min-width: 1140px) {

      .side_drawer_closed {
          display: none;
      }

      .side_drawer_open {
          display: none;
      }

    }

</style>