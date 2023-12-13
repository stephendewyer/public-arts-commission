<script lang="ts">
    import { page } from '$app/stores';
    import PierreHuygheAfterDream from '$lib/images/theme/Pierre_Huyghe_Minneapolis_Sculpture_Garden_03_July_2023_02.jpg';
    import LogoSecondary from "$lib/images/logo/public_arts_commission_logo_secondary.svg?raw";
    import LogoutButtonSecondary from '$lib/components/buttons/LogoutButtonSecondary.svelte';

    // IMPORTANT!  update user on page change using $page store

    $: user = $page.data.streamed.user;

    let callbackURL: string = "";
    let logoURL: string = "/";

    $: if (user?.name === "voter") {
		callbackURL = "/login-voter";
		logoURL = "/authenticated-voter/voter";
	} else if (user?.name === "administrator") {
		callbackURL = "/login-administrator";
		logoURL = "/authenticated-administrator/admin";
	} else if (user?.name === "campaign") {
		callbackURL = "/login-campaign";
		logoURL = "/authenticated-campaign/campaign";
	} else {
		callbackURL = "/";
		logoURL = "/";
	};
    
    const today = new Date();
    const year = today.getFullYear();
    export let footerHeight;

</script>

<footer bind:clientHeight={footerHeight}>
    <div class="footer_top">
            <img class="footer_top_image"src={PierreHuygheAfterDream} alt="Pierre Huyghe After Dream 1997/2009 at Minneapolis Sculpture Garden" />
            <div class="footer_top_gradient"/>
    </div>
    <div class="nav_bottom_container">
        <div class="footer_content_container">
            <nav class="footer_nav">
                <div class="logo_container_footer">
                    <a 
                        aria-current={
                            (
                                $page.url.pathname === '/' || 
                                $page.url.pathname === "/authenticated-campaign/campaign" ||
                                $page.url.pathname === "/authenticated-administrator/admin" ||
                                $page.url.pathname === "/authenticated-voter/voter"
                            )
                        ? 'page' : undefined}
                        class="logo"
                        href={logoURL}
                        aria-label="link to index page"
                    >
                        {@html LogoSecondary}
                    </a>
                </div>
                {#if (user)}
                    <LogoutButtonSecondary callbackUrl={callbackURL}>logout</LogoutButtonSecondary>
                {:else if (!user)}
                    <div class="footer_nav_tabs">
                        <ul class="footer_nav_tabs_row">
                            <li class="footer_nav_column">
                                <a 
                                    href="/products" 
                                    aria-label="link to products page" 
                                    class="footer_nav_tab"
                                    aria-current={$page.url.pathname === '/products' ? 'page' : undefined}
                                >
                                    products
                                </a>
                            </li>
                            <li class="footer_nav_column">
                                <a 
                                    href="/endorsements" 
                                    aria-label="link to endorsements page" 
                                    class="footer_nav_tab"
                                    aria-current={$page.url.pathname === '/endorsements' ? 'page' : undefined}
                                >
                                    endorsements
                                </a>
                            </li>
                            <li class="footer_nav_column">
                                <a 
                                    href="/actions" 
                                    aria-label="link to actions page" 
                                    class="footer_nav_tab"
                                    aria-current={$page.url.pathname === '/actions' ? 'page' : undefined}
                                >
                                    actions
                                </a>
                            </li>
                            <li class="footer_nav_column">
                                <a 
                                    href="/priorities" 
                                    aria-label="link to priorities page" 
                                    class="footer_nav_tab"
                                    aria-current={$page.url.pathname === '/priorities' ? 'page' : undefined}
                                >
                                    priorities
                                </a>
                            </li>
                        </ul>
                        <ul class="footer_nav_tabs_row">
                            <li class="footer_nav_column">
                                <div 
                                    class="footer_nav_tab"
                                    aria-current={$page.url.pathname === '/story' || $page.url.pathname === '/team' ? 'page' : undefined}
                                >
                                    <div style="text-decoration: underline;">
                                        about
                                    </div>
                                    <ul class="footer_nav_tabs_panel">
                                        <li>
                                            <a 
                                                href="/story" 
                                                aria-label="link to story page" 
                                                class="footer_nav_tab_secondary"
                                                aria-current={$page.url.pathname === '/story' ? 'page' : undefined}

                                            >
                                                story
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="/team" 
                                                aria-label="link to team page" 
                                                class="footer_nav_tab_secondary"
                                                aria-current={$page.url.pathname === '/team' ? 'page' : undefined}
                                            >
                                                team
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li class="footer_nav_column">
                                <a 
                                    href="/donate" 
                                    aria-label="link to donate page" 
                                    class="footer_nav_tab"
                                    aria-current={$page.url.pathname === '/donate' ? 'page' : undefined}
                                >
                                    donate
                                </a>
                            </li>
                            <li class="footer_nav_column">
                                <a 
                                    href="/contact" 
                                    aria-label="link to contact page" 
                                    class="footer_nav_tab"
                                    aria-current={$page.url.pathname === '/contact' ? 'page' : undefined}
                                >
                                    contact
                                </a>
                            </li>
                            <li class="footer_nav_column">
                                <div 
                                    class="footer_nav_tab"
                                    aria-current={ 
                                        $page.url.pathname === '/login-voter' || 
                                        $page.url.pathname === '/login-campaign' || 
                                        $page.url.pathname === '/login-administrator' 
                                    ? 'page' : undefined }
                                >
                                    <div style="text-decoration: underline;">
                                        login
                                    </div>
                                    <ul class="footer_nav_tabs_panel">
                                        <li>
                                            <a 
                                                href="/login-voter" 
                                                aria-label="link to voter login page" 
                                                class="footer_nav_tab_secondary"
                                                aria-current={$page.url.pathname === '/login-voter' ? 'page' : undefined}
                                            >
                                                voter
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="/login-campaign" 
                                                aria-label="link to campaign login page" 
                                                class="footer_nav_tab_secondary"
                                                aria-current={$page.url.pathname === '/login-campaign' ? 'page' : undefined}
                                            >
                                                campaign
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="/login-administrator" 
                                                aria-label="link to administrator login page" 
                                                class="footer_nav_tab_secondary"
                                                aria-current={$page.url.pathname === '/login-administrator' ? 'page' : undefined}
                                            >
                                                administrator
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                {/if}
            </nav>
            <div class="footer_info">
                <p>
                    public arts commission is a 501(c)(4) non-profit organization based in the United States.
                    <br />
                    public arts commission © {year}.  All rights reserved.
                </p>
                
            </div>
        </div>
        
    </div>
</footer>

<style>

    footer {
        position: absolute;
        bottom: 0;
        width: 100%;
    }

    .footer_top_image {
        max-height: 20rem;
        object-fit: cover;
    }

    .footer_top {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .footer_top_gradient {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgb(219,228,215);
        background: linear-gradient(180deg, rgba(219,228,215,1) 0%, rgba(219,228,215,1) 35%, rgba(219,228,215,0) 100%);
    }

    .nav_bottom_container {
        background-color: #3A2B35;
    }

    .footer_content_container {
        width: 100%;
		max-width: 120rem;
		margin: 0 auto;
		display: flex;
        justify-content: space-between;
        padding: 1rem;
    }

    .footer_nav {
        display: flex;
        flex-direction: row;
        width: 70%;
    }

    .logo_container_footer {
        width: 8rem;
    }

    .logo {
        fill: #E3CDB2;
        transition: fill 0.2s linear;
    }

    .logo[aria-current='page'] {
        fill: #C4BDC0;
    }

    .logo:hover {
        fill: #DEF2F4;
    }

    .footer_nav_tabs {
        padding: 0 2rem;
        width: 50%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
    }

    .footer_nav_tabs_row {
        display: flex;
        flex-direction: row;
        list-style: none;
        padding: 0;
        margin: 0 auto 1rem auto;
        justify-content: space-around;
    }

    .footer_nav_column {
        width: 100%;
        min-width: 8rem;
        margin: 0;
    }    

    .footer_nav_tab {
        color: #E3CDB2;
        transition: color 0.2s linear;
        cursor: pointer;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        font-size: 1rem;
    }

    .footer_nav_tab[aria-current='page'] {
        color: #C4BDC0;
    }

    .footer_nav_tab:hover {
        color: #DEF2F4;
    }

    .footer_nav_tab_secondary {
        color: #E3CDB2;
        transition: color 0.2s linear;
        cursor: pointer;
        font-size: 1rem;
    }

    .footer_nav_tab_secondary:hover {
        color: #DEF2F4;
    }

    .footer_nav_tab_secondary[aria-current='page'] {
        color: #C4BDC0;
    }

    .footer_nav_tabs_panel {
        display: flex;
        flex-direction: column;
        list-style: none;
        width: 100%;
        padding: 0.5rem 0 0 0;
        gap: 0.5rem;
    }

    .footer_info {
        color: #E3CDB2;
        width: 30%;
        margin: 0 0 auto 0;
    }

    @media (max-width: 1140px) {

        .logo_container_footer {
            width: 6rem;
        }

        .footer_content_container {
            width: 100%;
            max-width: 120rem;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 1rem;
        }

        .footer_nav {
            display: flex;
            flex-direction: column;
            width: 100%;
            align-items: center;
        }

        .footer_nav_tabs {
            flex-direction: row;
            padding:0;
            justify-content: center;
            width: 100%;
            margin: 0;
            font-size: 0.8rem;
        }

        .footer_nav_tabs_row {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: 0.5rem;
            list-style: none;
            padding: 1rem 0;
            margin: 0;
            width: 50%;
        }

        .footer_nav_column {
            width: auto;
            margin: 0 auto;
        }

        .footer_nav_tab_secondary {
            font-size: 0.8rem;
        }

        .footer_nav_tab {
            font-size: 0.8rem;
        }

        .footer_info {
            width: 100%;
            padding: 0 0 1rem 0;
            font-size: 0.8rem;
        }

    }

</style>