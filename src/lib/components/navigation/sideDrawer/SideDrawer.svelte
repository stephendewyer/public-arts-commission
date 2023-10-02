<script lang="ts">
    import { page } from '$app/stores';

    import Accordion from '$lib/components/accordions/MobileNavAccordion.svelte';

    export let open = false;

    const mobileNavTabs: AccordionTab[] = [
        {
            label: "products",
            expandable: false,
            content: null,
            slug: "/products"
        },
        {
            label: "endorsements",
            expandable: false,
            content: null,
            slug: "/endorsements"
        }, 
        {
            label: "actions",
            expandable: false,
            content: null,
            slug: "/actions"
        },
        {
            label: "priorities",
            expandable: false,
            content: null,
            slug: "/priorities"
        },
        {
            label: "about",
            expandable: true,
            content: [
                {
                    label: "story",
                    expandable: false,
                    content: null,
                    slug: "/story"
                },
                {
                    label: "team",
                    expandable: false,
                    content: null,
                    slug: "/team"
                }
            ],
            slug: "#"
        },
        {
            label: "donate",
            expandable: false,
            content: null,
            slug: "/donate"
        },
        {
            label: "contact",
            expandable: false,
            content: null,
            slug: "/contact"
        },
        {
            label: "login",
            expandable: true,
            content: [
                {
                    label: "voter",
                    expandable: false,
                    content: null,
                    slug: "/login-voter"
                },
                {
                    label: "campaign",
                    expandable: false,
                    content: null,
                    slug: "/login-campaign"
                },
                {
                    label: "administrator",
                    expandable: false,
                    content: null,
                    slug: "/login-administrator"
                }
            ],
            slug: "#"
        }
    ]
</script>

<aside 
    class="{ (open) ? 'side_drawer_open' : 'side_drawer_closed' }"
    aria-hidden="{ (open) ? 'false' : 'true'}"
>
    <nav>
        <Accordion 
            mobileNavTabsData={mobileNavTabs}
            bind:openState={open}
        />
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

    nav {
        width: 100%;
        padding: 4rem 2rem;
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