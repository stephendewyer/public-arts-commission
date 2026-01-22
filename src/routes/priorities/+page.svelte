<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import PriorityAccordion from '$lib/components/accordions/PriorityAccordion.svelte';
    import { onMount } from 'svelte';
    import IntersectionObserver from "svelte-intersection-observer";
    import Arrow from "$lib/images/icons/arrow.svg?raw";
    import ArtistsUnionWorkersPicketers from "$lib/images/priorities/artists-union-workers-picketing.jpg";

    let stickyNavTabs: HTMLElement;

    let PrioritiesNavTabsContainer: HTMLElement;

    let y: number;

    let NavTabsSticky: boolean = false;

    let currentStickyPosition: number;

    $: currentStickyPosition;

    $: if (y >= currentStickyPosition) {
        NavTabsSticky = true;
    } else {
        NavTabsSticky = false;
    };

    let pageNavTabsHeight: number = 0;
    $: pageNavTabsHeight;

    // innerWidth is the width of the inner window
	let innerWidth: number = 0;

    let governmentPrioritiesElement: HTMLElement;
    let governmentPrioritiesIntersecting: boolean = false;
    let governmentPrioritiesNavTabElement: HTMLElement;
    let governmentPrioritiesNavTabScrollLeftPosition: number = 0;

    let climatePrioritiesElement: HTMLElement;
    let climatePrioritiesIntersecting: boolean = false;
    let climatePrioritiesNavTabElement: HTMLElement;
    let climatePrioritiesNavTabScrollLeftPosition: number = 0;

    let economyPrioritiesElement: HTMLElement;
    let economyPrioritiesIntersecting: boolean = false;
    let economyPrioritiesNavTabElement: HTMLElement;
    let economyPrioritiesNavTabScrollLeftPosition: number = 0;

    let familyPrioritiesElement: HTMLElement;
    let familyPrioritiesIntersecting: boolean = false;
    let familyPrioritiesNavTabElement: HTMLElement;
    let familyPrioritiesNavTabScrollLeftPosition: number = 0;

    let educationPrioritiesElement: HTMLElement;
    let educationPrioritiesIntersecting: boolean = false;
    let educationPrioritiesNavTabElement: HTMLElement;
    let educationPrioritiesNavTabScrollLeftPosition: number = 0;

    let healthPrioritiesElement: HTMLElement;
    let healthPrioritiesIntersecting: boolean = false;
    let healthPrioritiesNavTabElement: HTMLElement;
    let healthPrioritiesNavTabScrollLeftPosition: number = 0;

    let immigrationPrioritiesElement: HTMLElement;
    let immigrationPrioritiesIntersecting: boolean = false;
    let immigrationPrioritiesNavTabElement: HTMLElement;
    let immigrationPrioritiesNavTabScrollLeftPosition: number = 0;

    let housingPrioritiesElement: HTMLElement;
    let housingPrioritiesIntersecting: boolean = false;
    let housingPrioritiesNavTabElement: HTMLElement;
    let housingPrioritiesNavTabScrollLeftPosition: number = 0;

    let pageNavTabClicked: boolean = false;
    let pageNavTabClickedID: string | null = null;

    let pageNavTabsScrollableLeftPosition: number = 0;

    let pageNavTabsScrollableWidth: number = 0;

    let pageNavTabsScrollableContainerWidth: number = 0;

    let pageNavTabsScrollableElement: HTMLElement;

    // $: console.log(currentStickyPosition);

    onMount(() => {

        currentStickyPosition = stickyNavTabs?.getBoundingClientRect().top + window.scrollY;

        pageNavTabsScrollableContainerWidth = PrioritiesNavTabsContainer.clientWidth;

        pageNavTabsScrollableWidth = pageNavTabsScrollableElement.scrollWidth;

        if (governmentPrioritiesNavTabElement) {
            let governmentPrioritiesNavTabWidth = governmentPrioritiesNavTabElement.getBoundingClientRect().width;
            if (governmentPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                governmentPrioritiesNavTabScrollLeftPosition = (governmentPrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - governmentPrioritiesNavTabWidth/2));
            } else if (governmentPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                governmentPrioritiesNavTabScrollLeftPosition = governmentPrioritiesNavTabElement.offsetLeft;
            } else {
                governmentPrioritiesNavTabScrollLeftPosition = 0;
            };
        };

        if (climatePrioritiesNavTabElement) {
            let climatePrioritiesNavTabWidth = climatePrioritiesNavTabElement.getBoundingClientRect().width;
            if (climatePrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                climatePrioritiesNavTabScrollLeftPosition = (climatePrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - climatePrioritiesNavTabWidth/2));
            } else if (climatePrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                climatePrioritiesNavTabScrollLeftPosition = climatePrioritiesNavTabElement.offsetLeft;
            } else {
                climatePrioritiesNavTabScrollLeftPosition = 0;
            };
        };

        if (economyPrioritiesNavTabElement) {
            let economyPrioritiesNavTabWidth = economyPrioritiesNavTabElement.getBoundingClientRect().width;
            if (economyPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                economyPrioritiesNavTabScrollLeftPosition = (economyPrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - economyPrioritiesNavTabWidth/2));
            } else if (economyPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                economyPrioritiesNavTabScrollLeftPosition = economyPrioritiesNavTabElement.offsetLeft;
            } else {
                economyPrioritiesNavTabScrollLeftPosition = 0;
            };
        };

        if (familyPrioritiesNavTabElement) {
            let familyPrioritiesNavTabWidth = familyPrioritiesNavTabElement.getBoundingClientRect().width;
            if (familyPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                familyPrioritiesNavTabScrollLeftPosition = (familyPrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - familyPrioritiesNavTabWidth/2));
            } else if (familyPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                familyPrioritiesNavTabScrollLeftPosition = familyPrioritiesNavTabElement.offsetLeft;
            } else {
                familyPrioritiesNavTabScrollLeftPosition = 0;
            };
        };

        if (educationPrioritiesNavTabElement) {
            let educationPrioritiesNavTabWidth = educationPrioritiesNavTabElement.getBoundingClientRect().width;
            if (educationPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                educationPrioritiesNavTabScrollLeftPosition = (educationPrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - educationPrioritiesNavTabWidth/2));
            } else if (educationPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                educationPrioritiesNavTabScrollLeftPosition = educationPrioritiesNavTabElement.offsetLeft;
            } else {
                educationPrioritiesNavTabScrollLeftPosition = 0;
            };
        };

        if (healthPrioritiesNavTabElement) {
            let healthPrioritiesNavTabWidth = healthPrioritiesNavTabElement.getBoundingClientRect().width;
            if (healthPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                healthPrioritiesNavTabScrollLeftPosition = (healthPrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - healthPrioritiesNavTabWidth/2));
            } else if (healthPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                healthPrioritiesNavTabScrollLeftPosition = healthPrioritiesNavTabElement.offsetLeft;
            } else {
                healthPrioritiesNavTabScrollLeftPosition = 0;
            };
        };

        if (immigrationPrioritiesNavTabElement) {
            let immigrationPrioritiesNavTabWidth = immigrationPrioritiesNavTabElement.getBoundingClientRect().width;
            if (immigrationPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                immigrationPrioritiesNavTabScrollLeftPosition = (immigrationPrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - immigrationPrioritiesNavTabWidth/2));
            } else if (immigrationPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                immigrationPrioritiesNavTabScrollLeftPosition = immigrationPrioritiesNavTabElement.offsetLeft;
            } else {
                immigrationPrioritiesNavTabScrollLeftPosition = 0;
            };
        };

        if (housingPrioritiesNavTabElement) {
            let housingPrioritiesNavTabWidth = housingPrioritiesNavTabElement.getBoundingClientRect().width;
            if (housingPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                housingPrioritiesNavTabScrollLeftPosition = (housingPrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - housingPrioritiesNavTabWidth/2));
            } else if (housingPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                housingPrioritiesNavTabScrollLeftPosition = immigrationPrioritiesNavTabElement.offsetLeft;
            } else {
                housingPrioritiesNavTabScrollLeftPosition = 0;
            };
        };

    });

    const pageNavTabClickHandler = (id: string) => {
        pageNavTabClicked = true;
        pageNavTabClickedID = id;
        const targetElement = document.getElementById(id);
        targetElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    $: if (governmentPrioritiesIntersecting) {
        if (PrioritiesNavTabsContainer) {
            if (!pageNavTabsScrollClicked) {
                if (pageNavTabClicked && (pageNavTabClickedID === "governmentPriorities")) {
                    PrioritiesNavTabsContainer.scrollLeft = governmentPrioritiesNavTabScrollLeftPosition;
                    pageNavTabClicked = false;
                } else if (!pageNavTabClicked) {
                    PrioritiesNavTabsContainer.scrollLeft = governmentPrioritiesNavTabScrollLeftPosition;
                };
            };
        };
    };

    $: if (climatePrioritiesIntersecting) {
        if (PrioritiesNavTabsContainer) {
            if (!pageNavTabsScrollClicked) {
                if (pageNavTabClicked && (pageNavTabClickedID === "climatePriorities")) {
                    PrioritiesNavTabsContainer.scrollLeft = climatePrioritiesNavTabScrollLeftPosition;
                    pageNavTabClicked = false;
                } else if (!pageNavTabClicked) {
                    PrioritiesNavTabsContainer.scrollLeft = climatePrioritiesNavTabScrollLeftPosition;
                };
            };
        };
    };

    $: if (economyPrioritiesIntersecting) {
        if (PrioritiesNavTabsContainer) {
            if (!pageNavTabsScrollClicked) {
                if (pageNavTabClicked && (pageNavTabClickedID === "economyPriorities")) {
                    PrioritiesNavTabsContainer.scrollLeft = economyPrioritiesNavTabScrollLeftPosition;
                    pageNavTabClicked = false;
                } else if (!pageNavTabClicked) {
                    PrioritiesNavTabsContainer.scrollLeft = economyPrioritiesNavTabScrollLeftPosition;
                };
            };
        };
    };

    $: if (familyPrioritiesIntersecting) {
        if (PrioritiesNavTabsContainer) {
            if (!pageNavTabsScrollClicked) {
                if (pageNavTabClicked && (pageNavTabClickedID === "familyPriorities")) {
                    PrioritiesNavTabsContainer.scrollLeft = familyPrioritiesNavTabScrollLeftPosition;
                    pageNavTabClicked = false;
                } else if (!pageNavTabClicked) {
                    PrioritiesNavTabsContainer.scrollLeft = familyPrioritiesNavTabScrollLeftPosition;
                };
            };
        };
    };

    $: if (educationPrioritiesIntersecting) {
        if (PrioritiesNavTabsContainer) {
            if (!pageNavTabsScrollClicked) {
                if (pageNavTabClicked && (pageNavTabClickedID === "educationPriorities")) {
                    PrioritiesNavTabsContainer.scrollLeft = educationPrioritiesNavTabScrollLeftPosition;
                    pageNavTabClicked = false;
                } else if (!pageNavTabClicked) {
                    PrioritiesNavTabsContainer.scrollLeft = educationPrioritiesNavTabScrollLeftPosition;
                };
            };
        }; 
    };

    $: if (healthPrioritiesIntersecting) {
        if (PrioritiesNavTabsContainer) {
            if (!pageNavTabsScrollClicked) {
                if (pageNavTabClicked && (pageNavTabClickedID === "healthPriorities")) {
                    PrioritiesNavTabsContainer.scrollLeft = healthPrioritiesNavTabScrollLeftPosition;
                    pageNavTabClicked = false;
                } else if (!pageNavTabClicked) {
                    PrioritiesNavTabsContainer.scrollLeft = healthPrioritiesNavTabScrollLeftPosition;
                };
            };            
        }; 
    };

    $: if (immigrationPrioritiesIntersecting) {
        if (PrioritiesNavTabsContainer){
            if (!pageNavTabsScrollClicked) {
                if (pageNavTabClicked && (pageNavTabClickedID === "immigrationPriorities")) {
                    PrioritiesNavTabsContainer.scrollLeft = immigrationPrioritiesNavTabScrollLeftPosition;
                    pageNavTabClicked = false;
                } else if (!pageNavTabClicked) {
                    PrioritiesNavTabsContainer.scrollLeft = immigrationPrioritiesNavTabScrollLeftPosition;
                };
            };   
        };
    };

    $: if (housingPrioritiesIntersecting) {
        if (PrioritiesNavTabsContainer){
            if (!pageNavTabsScrollClicked) {
                if (pageNavTabClicked && (pageNavTabClickedID === "housingPriorities")) {
                    PrioritiesNavTabsContainer.scrollLeft = housingPrioritiesNavTabScrollLeftPosition;
                    pageNavTabClicked = false;
                } else if (!pageNavTabClicked) {
                    PrioritiesNavTabsContainer.scrollLeft = housingPrioritiesNavTabScrollLeftPosition;
                };
            };   
        };
    };

    let pageNavTabsScrollClicked: boolean = false;

    const clickPageNavTabsScrollLeftHandler = () => {
        pageNavTabsScrollClicked = true;
        PrioritiesNavTabsContainer.scrollLeft = PrioritiesNavTabsContainer.scrollLeft - (pageNavTabsScrollableContainerWidth/2);
    };

    const clickPageNavTabsScrollRightHandler = () => {
        pageNavTabsScrollClicked = true;
        PrioritiesNavTabsContainer.scrollLeft = PrioritiesNavTabsContainer.scrollLeft + (pageNavTabsScrollableContainerWidth/2);    
    };

    const handlePageNavTabsScroll = () => {
        pageNavTabsScrollableLeftPosition = PrioritiesNavTabsContainer.scrollLeft;
    };

    // use heading element to get current sticky scroll position when sticky and window resize
    let prioritiesHeadingElement: HTMLElement;

    const handleWindowResize = () => {

        pageNavTabsScrollableContainerWidth = PrioritiesNavTabsContainer.clientWidth;
        pageNavTabsScrollableWidth = pageNavTabsScrollableElement.scrollWidth;

        currentStickyPosition = prioritiesHeadingElement?.getBoundingClientRect().bottom  + window.scrollY;

        if (governmentPrioritiesNavTabElement) {
            let governmentPrioritiesNavTabWidth = governmentPrioritiesNavTabElement.getBoundingClientRect().width;
            if (governmentPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                governmentPrioritiesNavTabScrollLeftPosition = (governmentPrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - governmentPrioritiesNavTabWidth/2));
            } else if (governmentPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                governmentPrioritiesNavTabScrollLeftPosition = governmentPrioritiesNavTabElement.offsetLeft;
            } else {
                governmentPrioritiesNavTabScrollLeftPosition = 0;
            };
        };

        if (climatePrioritiesNavTabElement) {
            let climatePrioritiesNavTabWidth = climatePrioritiesNavTabElement.getBoundingClientRect().width;
            if (climatePrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                climatePrioritiesNavTabScrollLeftPosition = (climatePrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - climatePrioritiesNavTabWidth/2));
            } else if (climatePrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                climatePrioritiesNavTabScrollLeftPosition = climatePrioritiesNavTabElement.offsetLeft;
            } else {
                climatePrioritiesNavTabScrollLeftPosition = 0;
            };
        };

        if (economyPrioritiesNavTabElement) {
            let economyPrioritiesNavTabWidth = economyPrioritiesNavTabElement.getBoundingClientRect().width;
            if (economyPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                economyPrioritiesNavTabScrollLeftPosition = (economyPrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - economyPrioritiesNavTabWidth/2));
            } else if (economyPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                economyPrioritiesNavTabScrollLeftPosition = economyPrioritiesNavTabElement.offsetLeft;
            } else {
                economyPrioritiesNavTabScrollLeftPosition = 0;
            };
        };

        if (familyPrioritiesNavTabElement) {
            let familyPrioritiesNavTabWidth = familyPrioritiesNavTabElement.getBoundingClientRect().width;
            if (familyPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                familyPrioritiesNavTabScrollLeftPosition = (familyPrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - familyPrioritiesNavTabWidth/2));
            } else if (familyPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                familyPrioritiesNavTabScrollLeftPosition = familyPrioritiesNavTabElement.offsetLeft;
            } else {
                familyPrioritiesNavTabScrollLeftPosition = 0;
            };
        };

        if (educationPrioritiesNavTabElement) {
            let educationPrioritiesNavTabWidth = educationPrioritiesNavTabElement.getBoundingClientRect().width;
            if (educationPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                educationPrioritiesNavTabScrollLeftPosition = (educationPrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - educationPrioritiesNavTabWidth/2));
            } else if (educationPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                educationPrioritiesNavTabScrollLeftPosition = educationPrioritiesNavTabElement.offsetLeft;
            } else {
                educationPrioritiesNavTabScrollLeftPosition = 0;
            };
        };

        if (healthPrioritiesNavTabElement) {
            let healthPrioritiesNavTabWidth = healthPrioritiesNavTabElement.getBoundingClientRect().width;
            if (healthPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                healthPrioritiesNavTabScrollLeftPosition = (healthPrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - healthPrioritiesNavTabWidth/2));
            } else if (healthPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                healthPrioritiesNavTabScrollLeftPosition = healthPrioritiesNavTabElement.offsetLeft;
            } else {
                healthPrioritiesNavTabScrollLeftPosition = 0;
            };
        };

        if (immigrationPrioritiesNavTabElement) {
            let immigrationPrioritiesNavTabWidth = immigrationPrioritiesNavTabElement.getBoundingClientRect().width;
            if (immigrationPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                immigrationPrioritiesNavTabScrollLeftPosition = (immigrationPrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - immigrationPrioritiesNavTabWidth/2));
            } else if (immigrationPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                immigrationPrioritiesNavTabScrollLeftPosition = immigrationPrioritiesNavTabElement.offsetLeft;
            } else {
                immigrationPrioritiesNavTabScrollLeftPosition = 0;
            };
        };

        if (housingPrioritiesNavTabElement) {
            let housingPrioritiesNavTabWidth = housingPrioritiesNavTabElement.getBoundingClientRect().width;
            if (housingPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableContainerWidth/2)) {
                housingPrioritiesNavTabScrollLeftPosition = (housingPrioritiesNavTabElement.offsetLeft - (pageNavTabsScrollableContainerWidth/2 - housingPrioritiesNavTabWidth/2));
            } else if (housingPrioritiesNavTabElement.offsetLeft > (pageNavTabsScrollableWidth - (pageNavTabsScrollableContainerWidth/2))) {
                housingPrioritiesNavTabScrollLeftPosition = immigrationPrioritiesNavTabElement.offsetLeft;
            } else {
                housingPrioritiesNavTabScrollLeftPosition = 0;
            };
        };

    };

    const handleWindowScroll = () => {
        pageNavTabsScrollClicked = false;
    };

</script>
<svelte:head>
	<title>priorities - public arts commission</title>
	<meta name="description" content="priorities that guide public arts commission operations" />
	<meta property="og:image" content={PublicArtsCommissionBanner} />
</svelte:head>
<svelte:window 
    bind:innerWidth 
    bind:scrollY={y} 
    on:scroll={handleWindowScroll}
    on:resize={handleWindowResize}
/>
<div class="page_container">
    <div 
        class="priorities_heading"
        bind:this={prioritiesHeadingElement}
    >
        <figure class="priorities_heading_image_container">
            <img 
                src={ArtistsUnionWorkersPicketers} 
                alt="Artists' Union workers picketing in 1930s" 
            />
            <figcaption class="banner_figcaption">
                Artists' Union workers picketing in the 1930s for jobs for unemployed artists.
            </figcaption>
        </figure>
        <h1 class="priorities_heading_text">
            Our priorities guide our work to realize a reimagined American Dream fueled by artists who have a political platform and seat in government.
        </h1>
    </div>
    <div class="priorities">
        <div
            id="priorities_tabs_container"
            class={ NavTabsSticky ? "priorities_tabs_container_sticky" : "priorities_tabs_container_relative" }
            bind:this={stickyNavTabs}
        >
            <div 
                bind:this={PrioritiesNavTabsContainer}
                bind:clientHeight={pageNavTabsHeight}
                on:scroll={handlePageNavTabsScroll}
                id="priorities_tabs_scrollable_container"
                class={ NavTabsSticky ? "priorities_tabs_scrollable_container_sticky" : "priorities_tabs_scrollable_container_relative" }
            >
                <ul 
                    class="priorities_tabs"
                    bind:this={pageNavTabsScrollableElement}
                >
                    <a 
                        href="#governmentPriorities" 
                        class="priorities_category_tab_container"
                        on:click|preventDefault={() => pageNavTabClickHandler("governmentPriorities")}
                        bind:this={governmentPrioritiesNavTabElement}
                    >
                        <li 
                            class="priorities_category_tab"
                            aria-current={governmentPrioritiesIntersecting ? "page" : undefined}
                            id="government_priorities_tab"
                        >
                            government
                        </li>
                    </a>
                    <a 
                        href="#climatePriorities" 
                        class="priorities_category_tab_container"
                        on:click|preventDefault={() => pageNavTabClickHandler("climatePriorities")}
                        bind:this={climatePrioritiesNavTabElement}
                    >
                        <li 
                            class={"priorities_category_tab"} 
                            aria-current={climatePrioritiesIntersecting ? "page" : undefined}
                            id="climate_priorities_tab"
                        >
                            climate
                        </li>
                    </a>
                    <a 
                        href="#economyPriorities" 
                        class="priorities_category_tab_container"
                        on:click|preventDefault={() => pageNavTabClickHandler("economyPriorities")}
                        bind:this={economyPrioritiesNavTabElement}
                    >
                        <li 
                            class={"priorities_category_tab"} 
                            aria-current={economyPrioritiesIntersecting ? "page" : undefined}
                            id="economy_priorities_tab"
                        >
                            economy
                        </li>
                    </a>
                    <a 
                        href="#familyPriorities" 
                        class="priorities_category_tab_container"
                        on:click|preventDefault={() => pageNavTabClickHandler("familyPriorities")}
                        bind:this={familyPrioritiesNavTabElement}
                    >
                        <li 
                            class={"priorities_category_tab"} 
                            aria-current={familyPrioritiesIntersecting ? "page" : undefined}
                            id="family_priorities_tab"
                        >
                            family
                        </li>
                    </a>
                    <a 
                        href="#educationPriorities" 
                        class="priorities_category_tab_container"
                        on:click|preventDefault={() => pageNavTabClickHandler("educationPriorities")}
                        bind:this={educationPrioritiesNavTabElement}
                    >
                        <li 
                            class={"priorities_category_tab"} 
                            aria-current={educationPrioritiesIntersecting ? "page" : undefined}
                            id="education_priorities_tab"
                        >
                            education
                        </li>
                    </a>
                    <a 
                        href="#healthPriorities" 
                        class="priorities_category_tab_container"
                        on:click|preventDefault={() => pageNavTabClickHandler("healthPriorities")}
                        bind:this={healthPrioritiesNavTabElement}
                    >
                        <li 
                            class={"priorities_category_tab"} 
                            aria-current={healthPrioritiesIntersecting ? "page" : undefined}
                            id="health_priorities_tab"
                        >
                            health
                        </li>
                    </a>
                    <a 
                        href="#immigrationPriorities" 
                        class="priorities_category_tab_container"
                        on:click|preventDefault={() => pageNavTabClickHandler("immigrationPriorities")}
                        bind:this={immigrationPrioritiesNavTabElement}
                    >
                        <li 
                            class={"priorities_category_tab"} 
                            aria-current={immigrationPrioritiesIntersecting ? "page" : undefined}
                            id="immigration_priorities_tab"
                        >
                            immigration
                        </li>
                    </a>
                    <a 
                        href="#housingPriorities" 
                        class="priorities_category_tab_container"
                        on:click|preventDefault={() => pageNavTabClickHandler("housingPriorities")}
                        bind:this={housingPrioritiesNavTabElement}
                    >
                        <li 
                            class={"priorities_category_tab"} 
                            aria-current={housingPrioritiesIntersecting ? "page" : undefined}
                            id="housing_priorities_tab"
                        >
                            housing
                        </li>
                    </a>
                </ul>
            </div>
            <button
                class="arrow_left_scroll"
                style={
                    (pageNavTabsScrollableLeftPosition === 0) &&
                    (pageNavTabsScrollableWidth >= pageNavTabsScrollableContainerWidth) 
                    ? 
                        "display: none;" 
                    : ""
                }
                on:click={clickPageNavTabsScrollLeftHandler}
            >
                <div class="arrow_container">
                    {@html Arrow}
                </div>
            </button>
            <button 
                class="arrow_right_scroll"
                style={
                    (pageNavTabsScrollableLeftPosition >= (pageNavTabsScrollableWidth - pageNavTabsScrollableContainerWidth - 1)) &&
                    (pageNavTabsScrollableWidth >= pageNavTabsScrollableContainerWidth)
                    ? 
                        "display: none;" 
                    : ""
                }
                on:click={clickPageNavTabsScrollRightHandler}
            >
                <div class="arrow_container">
                    {@html Arrow}
                </div>
            </button>
        </div>
        <div 
            class="priorities_container"
            style={NavTabsSticky && innerWidth <= 1440 ? `padding-top: ${pageNavTabsHeight}px;` : "padding-top: 0px;"}
        >
            <IntersectionObserver 
                element={governmentPrioritiesElement} 
                bind:intersecting={governmentPrioritiesIntersecting}
                rootMargin={"-25% 0% -75% 0%"}
            >
                <section 
                    id="governmentPriorities" 
                    class="priorities_section_container"
                    style="background-color: #F4F5FB;"
                    bind:this={governmentPrioritiesElement}
                >
                    <h2 class="priorities_section_heading">government</h2>
                    <ol class="category_priorities">
                        <li class="priority_heading" >
                            <PriorityAccordion >
                                <span slot="head">
                                    Excellent public art for everyone, by everyone and available to everyone
                                </span>
                                <div slot="details">
                                    <p>
                                        Excellent public art for everyone, by everyone and available to everyone will strengthen the political imaginary necessary to overcome the political cynicism that prevents us from coming together to solve our most demanding problems. Public art for everyone, by everyone and available to everyone will achieve greater equity, fairness and diversity in art. Investing in public art improves the quality of life for the public and makes where the public lives more desirable, which can increase the availability of good jobs.
                                    </p>
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Empower artists
                                </span>
                                <div slot="details">
                                    <div>
                                        First and foremost, public arts commission wants to see artists thrive as human beings. Artists are people who have lives that often include financial obligations, lovers, families and responsibilities like everyone else.<br /><br />

                                        Artists have been at the forefront of social justice movements, yet too often do not have a seat in government. public arts commission works to give artists a seat at all levels of government.<br /><br />
                                        
                                        Artists provide huge economic benefits to our economy, yet too often do not receive recognition for their contributions as professionals. public arts commission will work to advocate for providing good jobs to artists. Good jobs for artists respect their contribution to society by allowing opportunities for prosperity, including owning a home, starting a family and retiring with dignity. public arts commission will develop a Good Jobs for Artists Plan (forthcoming) that would employ artists in public programs for social benefit.<br /><br />
                                        
                                        Actions we can take to empower artists:<br />
                                        <ol>
                                            <li>
                                                Give artists a seat at the table in government;
                                            </li>
                                            <li>
                                                Give artists a seat at the table in corporate governance, including governance at non-profit organizations;
                                            </li>
                                            <li>
                                                Create a federal jobs program to employ artists in a green economy;
                                            </li>
                                            <li>
                                                Recognize art work as work;
                                            </li>
                                            <li>
                                                Respect artists as professionals;
                                            </li>
                                            <li>
                                                Create a fair, transparent and accountable way of commissioning artists for work;
                                            </li>
                                            <li>
                                                Enact laws in the United States to give artists rights to the use of their work in the form of royalties;
                                            </li>
                                            <li>
                                                Support the use of artist’s reserved rights transfer and sale agreement;
                                            </li>
                                            <li>
                                                Increase opportunities for grant funding on an operational basis and not a project by project basis for artists.
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Create an Office of Art in the federal government                    
                                </span>
                                <div slot="details">
                                    <p>
                                        The arts need inclusion in discussions that affect all of us in the federal government. Creating an Office of the Arts will give the arts a role in discussions affecting all of us in the federal government.
                                    </p>
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Allow the National Endowment for the Arts to give direct grants to non-literary artists
                                </span>
                                <div slot="details">
                                    <p>
                                        The ban on direct funding of non-literary artists both puts artists at an economic disadvantage and gives the appearance the U.S. government does not value its artists. If we really want a greater art for the public, we need to invest in our artists. Allowing direct funding of non-literary artists by the federal government will give artists greater discretion in how the public sees their work.                        
                                    </p>
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Democratic reform                    
                                </span>
                                <div slot="details">
                                    Actions we can take to reform our government to become more democratic:<br />
                                    <ol>
                                        <li>
                                            Abolish the Electoral College and move to a direct, popular vote for President of the United States;
                                        </li>
                                        <li>
                                            Abolish the filibuster to allow a simple majority in the Senate to pass legislation.
                                        </li>
                                    </ol>
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Democratic integrity                  
                                </span>
                                <div slot="details">
                                    Campaign finance reform is necessary to give artists and ordinary citizens the ability to participate in elections without undue influence of large corporations, foreign dark money lobbyists and organizations and the very wealthy. One of the largest threats to democracy is the undue influence of large corporations, foreign dark money lobbyists and organizations and the very wealthy in our elections. To strengthen democratic integrity, we need to:<br />
                                    <ol>
                                        <li>
                                            Enact a ban on super PACs in Democratic Party primary and general elections;
                                        </li>
                                        <li>
                                            Remove the influence of the wealthy and large corporations in deciding leadership on Congress;                            </li>
                                        <li>
                                            Ban members of Congress and their families from owning and trading stocks;                            </li>
                                        <li>
                                            Elect members of Congress who refuse to take corporate and billionaire campaign contributions;
                                        </li>
                                        <li>
                                            Ban members of Congress from taking lobbying positions after they serve their terms;                            </li>
                                        <li>
                                            Improve public financing of campaigns to allow low-income individuals to run for Congress;
                                        </li>
                                        <li>
                                            Ban foreign dark money in elections.
                                        </li>
                                    </ol>
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Non-partisan redistricting and an end to gerrymandering                 
                                </span>
                                <div slot="details">
                                    <p>
                                        public arts commission believes gerrymandering reduces the ability of voters, including artists, to select their politicians. By supporting legislation that ends gerrymandering by setting non-partisan redistricting standards, public arts commission hopes to empower artists and voters in selecting their politicians.
                                    </p>
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Protecting civil rights, including freedom of speech, freedom to organize and freedom from discrimination based on class, race, ethnicity sex, gender or any other historically protected classification
                                </span>
                                <div slot="details">
                                    <p>
                                        Censorship laws frequently target artists for making work in support of democratic movements. Some artists unfortunately become subject to imprisonment or death as a result of attempts to censor their work. Freedom of speech is necessary for democracy, which artists have an important history in protecting. public arts commission strongly supports freedom of speech.<br /><br />

                                        Discrimination based on class, race, ethnicity sex, gender or any other historically protected classification is bad for art. public arts commission supports ending class, race, ethnicity sex, gender or any other historically protected classification-based discrimination.<br /><br />
                                        
                                        public arts commission supports the rights of assembly, particularly the right to collectively bargain.                        
                                    </p>
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Democratic reforms to the Supreme Court of the United States                
                                </span>
                                <div slot="details">
                                    <ol>
                                        <li>
                                            Create term limits for justices on the Supreme Court of the United States;
                                        </li>
                                        <li>
                                            Expand the Supreme Court of the United States;
                                        </li>
                                        <li>
                                            Establish a code of ethics for justices on the Supreme Court of the United States.
                                        </li>
                                    </ol>
                                </div>
                            </PriorityAccordion>
                        </li>
                    </ol>
                </section>
            </IntersectionObserver>
            <IntersectionObserver 
                element={climatePrioritiesElement} 
                bind:intersecting={climatePrioritiesIntersecting}
                rootMargin={"-25% 0% -75% 0%"}
            >
                <section 
                    id="climatePriorities" 
                    class="priorities_section_container"
                    style="background-color: #EAEAE5;"
                    bind:this={climatePrioritiesElement}
                >
                    <h2 class="priorities_section_heading">climate</h2>
                    <ol class="category_priorities">
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Climate justice for a habitable planet                
                                </span>
                                <div slot="details">
                                    Climate change threatens to make the planet uninhabitable. Climate justice and an environmentally sustainable economy are necessary to keep the planet habitable for current and future generations and the continuation of art.
                                    <br /><br />
                                    Actions we can take:                        
                                    <ol>
                                        <li>
                                            Enact a Green New Deal that includes artists in an important way;                          
                                        </li>
                                        <li>
                                            Enact carbon sequestration programs including but not limited to public reforestation programs.                            
                                        </li>
                                    </ol>
                                </div>
                            </PriorityAccordion>
                        </li>
                    </ol>
                </section>
            </IntersectionObserver>
            <IntersectionObserver 
                element={economyPrioritiesElement} 
                bind:intersecting={economyPrioritiesIntersecting}
                rootMargin={"-25% 0% -75% 0%"}
            >
                <section 
                    id="economyPriorities" 
                    class="priorities_section_container"
                    style="background-color: #FEF0EE;"
                    bind:this={economyPrioritiesElement}
                >
                    <h2 class="priorities_section_heading">economy</h2>
                    <ol class="category_priorities">
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Good jobs for art workers               
                                </span>
                                <div slot="details">
                                    <p>
                                        Art workers power the arts. Creating good jobs for art workers is essential for advancing the arts. Good jobs for art workers are union jobs that pay enough to support a family, live in dignity, invest in education and own a home.
                                    </p>
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Democracy in the workplace               
                                </span>
                                <div slot="details">
                                    Actions we can take to support democracy in the workplace:                        
                                    <ol>
                                        <li>
                                            Pass and enforce laws that make unionizing easier;
                                        </li>
                                        <li>
                                            Support unions and unions at art institutions in particular;                            
                                        </li>
                                        <li>
                                            Give artists greater representation on the governing boards and leadership at arts organizations;
                                        </li>
                                        <li>
                                            Support artist-owned and operated organizations;
                                        </li>
                                        <li>
                                            Repeal the Taft-Hartley Act of 1947.                            
                                        </li>
                                    </ol>
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <h3>
                                Jobs, culture and tax credits that support starting and raising families
                            </h3>
                        </li>
                        <li class="priority_heading">
                            <h3>
                                A tax code that eliminates billionaires, who use their vast wealth to overthrow our democracy by oligarchy
                            </h3>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    A fairer economy that includes opportunities for everyone, including artists, to live a prosperous life            
                                </span>
                                <div slot="details">
                                    An economy that works better for everyone is good for art. Inequality within and outside the arts impact the lives of artists and the public. Structural inequities including class, race, ethnicity, sex and gender directly and indirectly impact the arts. public arts commission believes that a fairer and more equitable economy is necessary to achieve a greater public art.
                                    <br /><br />
                                    Actions we can take to create a fairer economy:
                                    <ol>
                                        <li>
                                            Make the wealthy pay their fair share in taxes;
                                        </li>
                                        <li>
                                            Re-enact the Glass-Steagall Act of 1933;
                                        </li>
                                        <li>
                                            Increase funding opportunities for small and mid-sized art spaces that serve the public;
                                        </li>
                                        <li>
                                            Cancel all federal student loan debt;
                                        </li>
                                        <li>
                                            Make public higher education tuition-free;
                                        </li>
                                        <li>
                                            Create a system of equal pay for equal work by ending the caste system that separates full-time faculty and part-time faculty for the same work;
                                        </li>
                                        <li>
                                            Require paid maternity and paternity leave;
                                        </li>
                                        <li>
                                            Enact quality childcare for all;
                                        </li>
                                        <li>
                                            Enact Medicare for all;
                                        </li>
                                        <li>
                                            Raise the minimum wage to $22/hour tied to inflation;
                                        </li>
                                        <li>
                                            Enact permanent, livable and federally-enhanced unemployment insurance;
                                        </li>
                                        <li>
                                            End the prison-industrial complex;
                                        </li>
                                        <li>
                                            End wars of imperialism and the war on terror;
                                        </li>
                                        <li>
                                            Increase access to public transportation;
                                        </li>
                                        <li>
                                            Enact net neutrality;
                                        </li>
                                        <li>
                                            Diversify federal subsidies to agriculture to support local, sustainable farm practices;
                                        </li>
                                        <li>
                                            Expand remote work opportunities.
                                        </li>
                                    </ol>
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Use accurate economic data when deciding economic programs, especially when setting the Federal Reserve interest rate      
                                </span>
                                <p slot="details">
                                    We must get real with the actual economic data if we are to have a government that actually represents the wills and aspirations of the people, especially concerning the Federal Reserve interest rate, which has a huge impact on everything from one’s ability to own a home, start a family and afford groceries. 
                                    The data used by the Federal Reserve and lawmakers to decide economic programs is wildly inaccurate and should be updated to include data such as whether workers are getting fulfillment from their work, if workers are working in their chosen field and if workers are getting support to find the work they want.  
                                    The unemployment rate does not reflect workers not in the labor market, workers who have to take part-time work for childcare reasons, discouraged workers and various types of work.  
                                    For instance, as of 9 June 2025, the government unemployment rate is 4.2%, but of the working-age population aged 15 to 64 in the U.S. (211,554,500 people), only 52.6% (135,440,000 people) work full-time jobs.  
                                    The measurement the Federal Reserve uses to assess job openings does not account for the fact that four in ten jobs companies post are fake.  Around 3 in 10 job postings are not for an actual position.  Around 1 in 10 job postings are for a position for which the company has no intention on hiring.  The official economic data by our government needs to reflect what people actually see and feel.
                                    
                                </p>
                            </PriorityAccordion>                            
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Support fair trade that honors workers and the environment             
                                </span>
                                <div slot="details">
                                    Free trade without fair trade is not sustainable.  For decades, trade actions like NAFTA have sold-out the U.S. worker and led to millions of jobs lost.  We need trade deals that honor workers and the environment.  Actions we can take to support fair trade:                                    
                                    <ol>
                                        <li>
                                            Enact smart, targeted tariffs to counteract dumping of foreign surplus products that wipe out domestic industries;
                                        </li>
                                        <li>
                                            Strengthen partnerships with countries that have fair trade programs with the United States;                      
                                        </li>
                                        <li>
                                            End universal tariffs enacted by Trump;
                                        </li>
                                        <li>
                                            Support trade agreements that honor workers and the environment and not trade agreements that sell-out workers and the environment.
                                        </li>
                                    </ol>
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    End discrimination based on class, race, ethnicity, sex and gender           
                                </span>
                                <div slot="details">
                                    Actions we can take to support equality:
                                    <ol>
                                        <li>
                                            Make economic opportunities fair and transparent;
                                        </li>
                                        <li>
                                            Fight identitarianism;
                                        </li>
                                        <li>
                                            Add the Equal Rights Amendment to the U.S. Constitution.
                                        </li>
                                    </ol>
                                </div>
                            </PriorityAccordion>
                        </li>
                    </ol>
                </section>
            </IntersectionObserver>
            <IntersectionObserver 
                element={familyPrioritiesElement} 
                bind:intersecting={familyPrioritiesIntersecting}
                rootMargin={"-25% 0% -75% 0%"}
            >
                <section 
                    id="familyPriorities" 
                    class="priorities_section_container"
                    style="background-color: #F1DACC;"
                    bind:this={familyPrioritiesElement}
                >
                    <h2 class="priorities_section_heading">family</h2>
                    <ol class="category_priorities">
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Support family formation and families for humanity
                                </span>
                                <div slot="details">
                                    Art workers largely want, plan and/or have already started to have families.  Supporting families and the formation of families is essential for not only art workers, but humanity as a whole.  Falling rates of family formation/birth rates cannot be adequately addressed and should not be addressed by immigration.  Immigration is only a band-aid for the crisis of declining family formations/birth rates.  Economic reasons are the primary cause for abortions.  We can adequately increase family formation/increased birth rates by:
                                    <ol>
                                        <li>
                                            Increase jobs that support family formation.  Jobs that support family formation are ones that pay enough to raise a family, have stability and opportunities for growth.
                                        </li>
                                        <li>
                                            Expand remote work opportunities, which offer increased flexibility, reduced stress, better work-life balance, increased time with family, reduced childcare costs and improved mental health.  Evidence shows no loss of productivity by shifting to remote work.  In fact, remote work can help companies increase productivity by reducing micromanagement, which is harmful to the bottom line.
                                        </li>
                                        <li>
                                            Improve work-life balance.  No one should have to choose between having a career and a family.
                                        </li>
                                        <li>
                                            Enact universal paid parental leave programs for workers who have recently started families.
                                        </li>
                                        <li>
                                            Offer tax credits for starting and raising families like the expansion of the Child Tax Credit (CTC) in 2021 that lowered the child poverty rate by 46%, raising 2.1 million children out of poverty.
                                        </li>
                                        <li>
                                            Provide affordable, high-quality early childhood education programs
                                        </li>
                                        <li>
                                            Publicly fund reproductive health services.
                                        </li>
                                        <li>
                                            Relearn how to proactively discuss and educate on family formation.
                                        </li>
                                        <li>
                                            Improve housing opportunities for starting and raising families.
                                        </li>
                                        <li>
                                            Provide affordable, high-quality mental health resources.
                                        </li>
                                    </ol>
                                </div>
                            </PriorityAccordion>
                        </li>
                    </ol>
                </section>
            </IntersectionObserver>
            <IntersectionObserver 
                element={educationPrioritiesElement} 
                bind:intersecting={educationPrioritiesIntersecting}
                rootMargin={"-25% 0% -75% 0%"}
            >
                <section 
                    id="educationPriorities" 
                    class="priorities_section_container"
                    style="background-color: #E2DED0;"
                    bind:this={educationPrioritiesElement}
                >
                    <h2 class="priorities_section_heading">education</h2>
                    <ol class="category_priorities">
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Quality arts education for everyone        
                                </span>
                                <div slot="details">
                                    <p>
                                        Arts education programs in schools are essential to building an innovative workforce and vibrant democracy.  There's a reason why countries that focus only on STEM (science, technology, English and math) instead of STEAM (science, technology, English, art and math) in schools don't innovate.  Quality arts education for everyone is fundamental to developing the understanding of how we see ourselves and the things we do through different perspectives. Everyone should have the right to a quality arts education from kindergarten to higher education.<br /><br />

                                        Quality art education programs allow greater social mobility within the field of art, which is necessary for greater equality and diversity. The benefits of an arts education not only help prepare future artists, but also improve performance of students across disciplines.<br /><br />

                                        Art education at public educational institutions is necessary to advance art for future generations in a just and equitable way. Public art benefits by the advancement of the knowledge of art. To advance our knowledge of art, we need to invest in quality arts education programs for all.
                                    </p>
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <h3>
                                Increase pay for teachers to levels commensurate with their responsibilities and abilities
                            </h3>
                        </li>
                    </ol>
                </section>
            </IntersectionObserver>
            <IntersectionObserver 
                element={healthPrioritiesElement} 
                bind:intersecting={healthPrioritiesIntersecting}
                rootMargin={"-25% 0% -75% 0%"}
            >
                <section 
                    id="healthPriorities" 
                    class="priorities_section_container"
                    style="background-color: #FCEDD4;"
                    bind:this={healthPrioritiesElement}
                >
                    <h2 class="priorities_section_heading">health</h2>
                    <ol class="category_priorities">
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Enact Medicare for all                            
                                </span>
                                <div slot="details">
                                    Healthcare is a human right.  No one should have to choose between receiving life-saving healthcare and paying bills.  The for-profit medical system in the United States has created an incredibly costly and broken system of healthcare.  About one-fifth of total spending in the U.S. economy is spent on healthcare, while the U.S. has some of the worst health outcomes.  Enacting Medicare for all would help the U.S. focus on improving healthcare outcomes while cutting inefficiences like private healthcare insurance companies.
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Lift the cap on residencies for medical doctors to allow supply of doctors to meet increasing demand                          
                                </span>
                                <div slot="details">
                                    In the U.S., hospitals use Medicare funds to pay for medical residencies.  In 1997, Congress passed and the President signed into law the Balanced Budget Act that capped the number of Medicare-funded graduate medical education (GME) residency slots at each hospital to 1996 levels.  In the face of increasing demand for healthcare in the United States, the cap has created a medical doctor shortage.  We need to lift the cap to keep pace with demand for healthcare in the United States, which would lower healthcare costs.
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    End the opioid epidemic that is killing nearly 100,000 U.S. citizens each year and destroying communities                               
                                </span>
                                <div slot="details">
                                    Deaths from opioids in the U.S. grew exponentially since 2013.  Men and, in particular, young (military age) men are more than twice as likely to die from opioids than women.  As a result, average life expectancy for men in the U.S. has been declining for the first time in decades, resulting in overall average life expectancy declines in the U.S.  The economic losses are over a trillion dollars as a result of the opioid epidemic.  
                                    <br/><br/>
                                    Adversaries of democracy, most notably China, have been using fentanyl as a chemical weapon to weaken the United States.  In 2023, approximately 72,776 people died from a drug overdose involving fentanyl in the United States.  China and increasingly India produce the vast majority of precursor chemicals used to make fentanyl.  The precursor chemicals are sent to Mexico, where the Mexican cartels make fentanyl to distribute into the United States.  
                                    <br/><br/>
                                    According to a 2024 U.S. House investigation into The People’s Republic of China’s role in the fentanyl crisis, the PRC has been supporting the flow of fentanyl into the United States in a number of ways including:
                                    <ol>
                                        <li>
                                            Directly subsidizing the manufacturing and export of illicit fentanyl materials and other synthetic narcotics through tax rebates
                                        </li>
                                        <li>
                                            Giving monetary grants and awards to companies openly trafficking illicit fentanyl materials and other synthetic narcotics
                                        </li>
                                        <li>
                                            Holding ownership interest in several PRC companies tied to drug trafficking
                                        </li>
                                        <li>
                                            Failing to prosecute fentanyl and precursor manufacturers
                                        </li>
                                        <li>
                                            Allowing the open sale of fentanyl precursors and other illicit materials on the extensively monitored and controlled PRC internet
                                        </li>
                                        <li>
                                            Censoring content about domestic drug sales, but leaving export-focused narcotics content untouched
                                        </li>
                                        <li>
                                            Strategically and economically benefiting from the fentanyl crisis
                                        </li>
                                    </ol>
                                    Clearly, the PRC is using fentanyl as a weapon of war.  The U.S. must use an all-of-government approach to fighting the opioid epidemic.  This is not something just the Health Department can handle.
                                    <br /><br />
                                    To fight the supply side, the U.S. must hold both state and non-state actors accountable.  Tariffs are an effective tool in holding states accountable for flow of opioids into the U.S.  We must face the facts that NAFTA (North American Free Trade Agreement) played a large role in propelling the Mexican cartels to power.  In addition to holding the Mexican government accountable for complicity in the Mexican drug cartels power gains, we must also end free trade agreements that led to the open borders that the cartels exploit.  We must also hold China and India accountable for sending precursor fentanyl chemicals into the United States.
                                    <br /><br />
                                    On the demand side, the U.S. can fight the opioid epidemic by first and most importantly working to eliminate the reasons behind the “deaths of despair” that include trauma most frequently born from economic hardship.  Second, the U.S. must invest in prevention and treatment of opioid addiction.  We need to stop medical doctors from overly prescribing opioids.  We need to invest in public education and awareness about the dangers of opioids.  We need to make life-saving Naloxone and fentanyl test strips more readily available to fight opioid overdoses.  We need to treat opioid addiction as a disease instead of a moral failing.  Medical insurance needs to cover treatment for opioids. 
                                    <br /><br />
                                    By fighting both the supply and demand side of the opioid epidemic, we can build a stronger and more resilient democracy.  
                                </div>
                            </PriorityAccordion>
                        </li>
                    </ol>
                </section>
            </IntersectionObserver>
            <IntersectionObserver 
                element={immigrationPrioritiesElement} 
                bind:intersecting={immigrationPrioritiesIntersecting}
                rootMargin={"-25% 0% -75% 0%"}
            >
                <section 
                    id="immigrationPriorities" 
                    class="priorities_section_container"
                    style="background-color: #C3CBC4;"
                    bind:this={immigrationPrioritiesElement}
                >
                    <h2 class="priorities_section_heading">immigration</h2>
                    <ol class="category_priorities">
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Enact a democratic immigration system that equitably distributes costs and does not come at the expense of the working class
                                </span>
                                <div slot="details">
                                    <p>
                                        A democratic immigration system is one where citizens decide who and how many enter their country.  The ideology behind open borders is the same neoliberal ideology behind free trade.  Unfettered immigration contributes to a race to the bottom on salaries and wages and places a burden on already strained housing and education resources.   A democratic immigration system allows for a citizen-approved immigration system that more equitably distributes the costs of immigration.  
                                    </p>
                                </div>
                            </PriorityAccordion>
                        </li>
                    </ol>
                </section>
            </IntersectionObserver>
            <IntersectionObserver 
                element={housingPrioritiesElement} 
                bind:intersecting={housingPrioritiesIntersecting}
                rootMargin={"-25% 0% -75% 0%"}
            >
                <section 
                    id="housingPriorities" 
                    class="priorities_section_container"
                    style="background-color: #DBD7EB;"
                    bind:this={housingPrioritiesElement}
                >
                    <h2 class="priorities_section_heading">housing</h2>
                    <ol class="category_priorities">
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Invest in increasing the supply of affordable homes
                                </span>
                                <div slot="details">
                                    <p>
                                        Homeownership played a key role in defining the American Dream, which played a crucial role in defending democracy.  Every family should be able to own a home.  As of August 2024, the deficit of U.S. homes per U.S. demography is around 4 - 7 million.  The scarcity of homes today has contributed to a massive housing crisis.  We need to invest in increasing the supply of affordable homes.  
                                    </p>
                                </div>
                            </PriorityAccordion>
                        </li>
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Change zoning laws to allow multi-family housing
                                </span>
                                <div slot="details">
                                    <p>
                                        Cities with single family zoning laws like Los Angeles, California are fueling the housing crisis by preventing more affordable homes, increasing the unhoused population.  Changing of zoning laws in cities like Los Angeles, which has one of the highest unhoused populations in the U.S., is necessary to address the housing crisis.
                                    </p>
                                </div>
                            </PriorityAccordion>
                        </li>
                    </ol>
                </section>
            </IntersectionObserver>
        </div>
    </div>
    
</div>

<style>

    .page_container {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .priorities {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .priorities_container {
        width: 100%;
    }

    .priorities_heading {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .priorities_heading_image_container {
        width: 50%;
        padding: 0;
        margin: 0;
    }

    .priorities_heading_image_container > img {
        object-fit: cover;
        height: 40rem;
        width: 100%;
    }

    .banner_figcaption {
        padding: 1rem;
    }

    .priorities_heading_text {
        padding: 1rem;
        width: 50%;
        max-width: 80rem;
        margin: 0 auto;
    }

    .priorities_section_heading {
        padding: 1rem 1rem 0 1rem;
        margin: 0;
        font-size: 3rem;
        width: 100%;
        max-width: 50rem;
    }

    #priorities_tabs_container {
        margin: 0 auto;
    }

    .priorities_tabs_container_relative {
        position: absolute;
        z-index: 1;
        left: 0;
    }

    .priorities_tabs_container_sticky {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
    }

    #priorities_tabs_scrollable_container {
        width: 100%;
        overflow-x: auto;
        scroll-behavior: smooth;
    }

    .priorities_tabs_scrollable_container_relative {
        box-shadow: none;
    }

    .priorities_tabs_scrollable_container_sticky {
        box-shadow:
            0 1px 1px hsl(0deg 0% 0% / 0.075),
            0 2px 2px hsl(0deg 0% 0% / 0.075),
            0 4px 4px hsl(0deg 0% 0% / 0.075),
            0 8px 8px hsl(0deg 0% 0% / 0.075),
            0 16px 16px hsl(0deg 0% 0% / 0.075)
        ;
    }

    .priorities_tabs {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .priorities_category_tab  {
        position: relative;
        margin: 0;
        padding: 1rem 2rem;
    }

    li[aria-current="page"]::before {
        --size: 6px;
		content: '';
		width: 0;
		position: absolute;
		top: 0;
		right: 0;
        left: 0;
        bottom: 0;
		border: var(--size) solid transparent;
		border-left: 6px solid #4C4239;
		overflow: visible;
    }

    .priorities_category_tab {
        margin: 0;
        font-size: 1.25rem;
        font-family: "Lato";
        font-size: 1.4rem;
        font-weight: 600;
    }

    #government_priorities_tab {
        background-color: #F4F5FB;
    }

    #climate_priorities_tab {
        background-color: #EAEAE5;
    }

    #economy_priorities_tab {
        background-color: #FEF0EE;
    }

    #family_priorities_tab {
        background-color: #F1DACC;
    }

    #education_priorities_tab {
        background-color: #E2DED0;
    }

    #health_priorities_tab {
        background-color: #FCEDD4;
    }

    #immigration_priorities_tab {
        background-color: #C3CBC4;
    }

    #housing_priorities_tab {
        background-color: #DBD7EB;
    }

    .arrow_left_scroll {
        display: none;
    }

    .arrow_right_scroll {
        display: none;
    }

    .arrow_container {
        width: 1rem;
    }

    .priorities_heading {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .priorities_section_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .category_priorities {
        width: 100%;
        max-width: 50rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .priority_heading {
        font-size: 1.8rem;
        line-height: 1.35;
        color: #1C2226;
        font-weight: 600;
    }

    li {
        margin: 1rem 0;
    }

    .banner_figcaption {
        position: absolute;
        background: rgba(255, 255, 255, 0.65);
        bottom: 0;
    }

    @media (max-width: 1440px) {

        .priorities_section_heading {
            font-size: 2.5rem;
        }

        #priorities_tabs_container {
            margin: 0;
            display: flex;
            flex-direction: row;
            justify-content: center;
        }

        .priorities_tabs_container_relative {
            position: relative;
            z-index: 1;
            width: 100%;
        }

        .priorities_tabs_container_sticky {
            left: 0;
            right: 0;
        }

        #priorities_tabs_scrollable_container {
            width: auto;

        }

        .priorities_tabs {
            display: flex;
            flex-direction: row;
        }

        li[aria-current="page"]::before {
            --size: 6px;
            content: '';
            width: auto;
            position: absolute;
            height: 0;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            border: var(--size) solid transparent;
            border-top: 6px solid #4C4239;
            overflow: visible;
        }

        .priorities_category_tab  {
            position: relative;
            margin: 0;
            padding: 1rem 2rem;
        }

        .priorities_category_tab {
            font-size: 1.35rem;
        }

        .category_priorities > li {
            font-size: 1.25rem;
        }

        .category_priorities {
            gap: 0rem;
        }

        .arrow_left_scroll {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            transform: rotate(180deg);
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: rgb(245,193,238);
            background: linear-gradient(270deg, rgba(245,193,238,1) 0%, rgba(245,193,238,1) 75%, rgba(245,193,238,0) 100%);
            padding: 1rem;
            cursor: pointer;
            border: none;
            color: #575B46;
        }
        
        .arrow_right_scroll {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            background: rgb(245,193,238);
            background: linear-gradient(90deg, rgba(245,193,238,0) 0%, rgba(245,193,238,1) 25%, rgba(245,193,238,1) 100%);
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 1rem;
            cursor: pointer;
            border: none;
            color: #575B46;
        }

    }

    @media (max-width: 720px) {

        .priorities_heading {
            flex-direction: column;
        }

        .priorities_heading_image_container {
            width: 100%;
        }

        .priorities_heading_image_container  > img {
            height: 20rem;
        }

        .priorities_heading_text {
            width: 100%;
            padding: 0 1rem 1rem 1rem;
        }

        .priorities_section_heading {
            font-size: 2rem;
        }

        .priorities_tabs {
            left: 0;
            right: 0;
            width: 100%;
        }

        .priorities_category_tab {
            font-size: 1rem;
        }

        .category_priorities > li {
            font-size: 1rem;
        }

        .priority_heading > h3 {
            font-size: 1rem;
        }

    }

</style>