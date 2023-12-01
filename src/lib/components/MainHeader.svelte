<script lang="ts">
	import { page } from '$app/stores';
	import Hamburger from '$lib/components/navigation/Hamburger.svelte';
	import Logo from "$lib/images/logo/public_arts_commission_logo.svg?raw";

	export let sideDrawer: boolean = false;

	let aboutTabPanelIsActive: boolean;
	let loginTabPanelIsActive: boolean;

	let login_panel_height: number;

	let about_panel_height: number;

	$: login_panel_height = 0;

	$: about_panel_height = 0;

	const collapseAboutTabHandler = () => {
		aboutTabPanelIsActive = false;
	}

	const expandAboutTabHandler = () => {
		aboutTabPanelIsActive = true;
	}

	const collapseLoginTabHandler = () => {
		loginTabPanelIsActive = false;
	}

	const expandLoginTabHandler = () => {
		loginTabPanelIsActive = true;
	}

</script>

<header>
	<nav>
		<ul id="nav_left">
			<li 
				class="nav_tab"
				aria-current={$page.url.pathname === '/products' ? 'page' : undefined}
			>
				<a href="/products">products</a>
			</li>
			<li 
				class="nav_tab"
				aria-current={$page.url.pathname === '/endorsements' ? 'page' : undefined}
			>
				<a href="/endorsements">endorsements</a>
			</li>
			<li 
				class="nav_tab"
				aria-current={$page.url.pathname === '/actions' ? 'page' : undefined}
			>
				<a href="/actions">actions</a>
			</li>
			<li 
				class="nav_tab"
				aria-current={$page.url.pathname === '/priorities' ? 'page' : undefined}
			>
				<a href="/priorities">priorities</a>
			</li>
		</ul>
		<ul id="nav_left_mobile">
		</ul>
		<ul id="nav_center">
			<li 
				class="logo"
				aria-current={$page.url.pathname === '/' ? 'page' : undefined} 
			>
				<a 
					id="logo_svg"
					href="/"
				>
					{@html Logo}
				</a>
			</li>
		</ul>
		<ul id="nav_right">
			<li 
				class="nav_tab"
				aria-current={$page.url.pathname === '/story' || $page.url.pathname === '/team' ? 'page' : undefined}
				on:mouseleave={() => collapseAboutTabHandler()}
				on:mouseout={() => collapseAboutTabHandler()}
				on:blur={() => collapseAboutTabHandler()}
				on:mouseenter={() => expandAboutTabHandler()}
				on:mouseover={() => expandAboutTabHandler()}
				on:focus={() => expandAboutTabHandler()}
			>
				<div 
					id="tab_header_about"
					class="menu_tab_header"
					role="tab"
					aria-selected={aboutTabPanelIsActive}
					aria-controls="tab_panel_about"
					tabindex="0"
				>
					<div class="tabPanel_header_text">about</div>
					<div class={ aboutTabPanelIsActive ? "arrow_active" : "arrow" }>
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
				</div>
				<div>
					<div
						id="tab_panel_about"
						role="tabpanel"
						tabindex="0"
						aria-labelledby="tab_header_about"
						class="panel_container"
						style={ aboutTabPanelIsActive ? `height: ${about_panel_height}px;` : 'height: 0px;' }
					>
						<div 
							class="panel"
							bind:clientHeight={about_panel_height}
						>
							<ul
								class="panel_items"
								style={ aboutTabPanelIsActive ? "opacity: 100%;" : "opacity: 0%;"}
							>
								<li>
									<a href="/story">story</a>
								</li>
								<li>
									<a href="/team">team</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				
			</li>
			<li 
				class="nav_tab"
				aria-current={$page.url.pathname === '/donate' ? 'page' : undefined}
			>
				<a href="/donate">donate</a>
			</li>
			<li 
				class="nav_tab"
				aria-current={$page.url.pathname === '/contact' ? 'page' : undefined}
			>
				<a href="/contact">contact</a>
			</li>
			<li 
				class="nav_tab"
				aria-current={$page.url.pathname === '/login-administrator' || $page.url.pathname === '/login-voter' || $page.url.pathname === '/login-campaign' ? 'page' : undefined}
				on:mouseleave={() => collapseLoginTabHandler()}
				on:mouseout={() => collapseLoginTabHandler()}
				on:blur={() => collapseLoginTabHandler()}
				on:mouseenter={() => expandLoginTabHandler()}
				on:mouseover={() => expandLoginTabHandler()}
				on:focus={() => expandLoginTabHandler()}
			>
				<div
					id="tab_header_login"
					class="menu_tab_header"
					role="tab"
					aria-selected={loginTabPanelIsActive}
					aria-controls="tab_panel_login"
					tabindex="-1"
				>
					<div 
						class="tabPanel_header_text"
					>
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
						login
					</div>
					<div class={ loginTabPanelIsActive ? "arrow_active" : "arrow" }>
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
				</div>
				<div>
					<div
						id="tab_panel_login"
						role="tabpanel"
						tabindex="-1"
						aria-labelledby="tab_header_login"
						class="panel_container"
						style={ loginTabPanelIsActive ? `height: ${login_panel_height}px;` : 'height: 0px;' }
					>
						<div 
							class="panel"
							bind:clientHeight={login_panel_height}
						>
							<ul
								class="panel_items"
								style={ loginTabPanelIsActive ? "opacity: 100%;" : "opacity: 0%;"}
							>
								<li>
									<a href="/login-voter">voter</a>
								</li>
								<li>
									<a href="/login-campaign">campaign</a>
								</li>
								<li>
									<a href="/login-administrator">administrator</a>
								</li>
							</ul>
						</div>
					<div>
				</div>
			</li>
		</ul>
		<ul id="nav_right_mobile">
			<li class="mobile_nav_menu_toggle_button_container">
				<Hamburger bind:open={sideDrawer}/>			
			</li>
		</ul>
	</nav>
</header>

<style>

	header {
		width: 100%;
	}

	nav {
		width: 100%;
		max-width: 120rem;
		margin: 0 auto;
		display: flex;
	}

	ul {
		display: flex;
		justify-content: space-evenly;
		flex-direction: row;
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	li {
		position: relative;
		height: 100%;
		max-width: 15rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem 0;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		height: 0;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		border: var(--size) solid transparent;
		border-top: 6px solid #4C4239;
		overflow: visible;
	}

	nav a {
		height: 100%;
		padding: 0 0.5rem;
		font-weight: 800;
		font-size: 1.25rem;
		letter-spacing: 0.1em;
		text-decoration: none;
	}

	.tabPanel_header_text {
		height: 100%;
		padding: 0 0.5rem;
		font-weight: 800;
		font-size: 1.25rem;
		letter-spacing: 0.1em;
		text-decoration: none;
		color: #4C4239;
		fill: #4C4239;
		transition: color 0.2s linear, fill 0.2s linear;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.tabPanel_header_text:hover {
		color: #CB6D44;
		fill: #CB6D44;
	}

	#nav_left {
		width: 44%;
	}

	#nav_center {
		width: 12%;
	}

	#nav_right {
		width: 44%;
	}

	.menu_tab_header {
		display: flex;
		align-items: center;
		position: relative;
	}

	.arrow {
        width: 0.5rem;
        transform: rotate(270deg);
        will-change: transform;
        transition: transform 0.2s ease-out;
    }

    .arrow_active {
        width: 0.5rem;
        transform: rotate(90deg);
        will-change: transform;
        transition: transform 0.2s ease-out;
    }

	.nav_tab {
		width: 100%;
	}

	.nav_icon {
		width: 1.25rem;
	}

	.panel_container {
		background-color: #DBE4D7;
		overflow: hidden;
        will-change: height;
        transition: height 0.4s cubic-bezier(0.65, 0.05, 0.36, 1);
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		position: absolute;
		left: 0;
		right: 0;
	}

	.panel {
		padding: 1rem;
	}

	.panel_items {
		display: flex;
		flex-direction: column;
		will-change: opacity;
        transition: opacity 0.6s ease-out;
	}

	#logo_svg {
		fill: #d8eac5;
		transition: fill 0.2s linear;
	}

	#logo_svg:hover {
		fill: #E3CDB2;
	}

	#nav_right_mobile {
		display: none;
	}

	#nav_left_mobile {
		display: none;
	}

	.mobile_nav_menu_toggle_button_container {
		margin: 0 1rem 0 0;
	}

	@media (max-width: 1920px) {

		.nav_icon {
			width: 1rem;
		}
	}

	@media (max-width: 1550px) {

		.tabPanel_header_text {
			font-size: 1rem;
		}

		nav a {
			font-size: 1rem;
		}
	}

	@media (max-width: 1300px) {

		.tabPanel_header_text {
			font-size: 0.8rem;
		}

		nav a {
			font-size: 0.8rem;
		}
	}

	@media (max-width: 1140px) {

		nav {
			justify-content: space-between;
		}

		#nav_center {
			width: 20%;
			min-width: 8rem;
		}

		#nav_left_mobile {
			display: flex;
			width: 40%;
		}

		#nav_left {
			display: none;
		}

		#nav_right {
			display: none;
		}

		#nav_right_mobile {
			display: flex;
			justify-content: flex-end;
			width: 40%;

		}
	}
</style>
