<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import PriorityAccordion from '$lib/components/accordions/PriorityAccordion.svelte';
    import { onMount } from 'svelte';
    import IntersectionObserver from "svelte-intersection-observer";
    import Arrow from "$lib/images/icons/arrow.svg?raw";

    let stickyNavTabs: HTMLElement;

    let PrioritiesNavTabsContainer: HTMLElement;

    let y: number;

    let NavTabsSticky: boolean = false;

    let currentStickyPosition: number;

    $: currentStickyPosition;

    $: console.log("currentStickyPosition: ", currentStickyPosition);

    $: console.log("y: ", y);

    $: if (y >= currentStickyPosition) {
        NavTabsSticky = true;
    } else {
        NavTabsSticky = false;
    };

    $: console.log("nav tabs sticky: ", NavTabsSticky);

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

    let educationPrioritiesElement: HTMLElement;
    let educationPrioritiesIntersecting: boolean = false;
    let educationPrioritiesNavTabElement: HTMLElement;
    let educationPrioritiesNavTabScrollLeftPosition: number = 0;

    let healthPrioritiesElement: HTMLElement;
    let healthPrioritiesIntersecting: boolean = false;
    let healthPrioritiesNavTabElement: HTMLElement;
    let healthPrioritiesNavTabScrollLeftPosition: number = 0;

    let pageNavTabClicked: boolean = false;
    let pageNavTabClickedID: string | null = null;

    let pageNavTabsScrollableLeftPosition: number = 0;

    let pageNavTabsScrollableWidth: number = 0;

    let pageNavTabsScrollableContainerWidth: number = 0;

    let pageNavTabsScrollableElement: HTMLElement;

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

    const handleWindowResize = () => {

        pageNavTabsScrollableContainerWidth = PrioritiesNavTabsContainer.clientWidth;
        pageNavTabsScrollableWidth = pageNavTabsScrollableElement.scrollWidth;

        // currentStickyPosition = stickyNavTabs?.getBoundingClientRect().top + window.scrollY;

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
    <h1 class="priorities_heading">
        our priorities guide all our operations
    </h1>
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
                    class="priorities_for_government_container"
                    bind:this={governmentPrioritiesElement}
                >
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
                                            Abolish the filibuster to allow a simple majority in the Senate to pass legislation;
                                        </li>
                                        <li>
                                            Institute term limits and add justices to the U.S. Supreme Court.
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
                                    Campaign finance reform is necessary to give artists and ordinary citizens the ability to participate in elections without undue influence of large corporations and the very wealthy. One of the largest threats to democracy is the undue influence of large corporations and the very wealthy in our elections. To make strengthen democratic integrity, we need to:<br />
                                    <ol>
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
                                            Improve public financing of campaigns to allow low-income individuals to run for Congress.
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
                            <h2>
                                Expand the Supreme Court of the United States
                            </h2>
                        </li>
                        <li class="priority_heading">
                            <h2>
                                Create term limits for justices on the Supreme Court of the United States
                            </h2>
                        </li>
                        <li class="priority_heading">
                            <h2>
                                Establish a code of ethics for justices on the Supreme Court of the United States
                            </h2>
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
                    class="priorities_for_climate_container"
                    bind:this={climatePrioritiesElement}
                >
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
                    class="priorities_for_economy_container"
                    bind:this={economyPrioritiesElement}
                >
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
                            <PriorityAccordion>
                                <span slot="head">
                                    Jobs, culture and tax credits that support starting and raising families              
                                </span>
                                <div slot="details">
                                    <p>
                                        Art workers have started or plan to start families.  Having a culture and economy that supports and encourages current and future parents is essential for humanity.                
                                    </p>
                                </div>
                            </PriorityAccordion>
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
                                            Diversify federal subsidies to agriculture to support local, sustainable farm practices.
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
                element={educationPrioritiesElement} 
                bind:intersecting={educationPrioritiesIntersecting}
                rootMargin={"-25% 0% -75% 0%"}
            >
                <section 
                    id="educationPriorities" 
                    class="priorities_for_education_container"
                    bind:this={educationPrioritiesElement}
                >
                    <ol class="category_priorities">
                        <li class="priority_heading">
                            <PriorityAccordion>
                                <span slot="head">
                                    Quality arts education for everyone        
                                </span>
                                <div slot="details">
                                    <p>
                                        Quality arts education for everyone is fundamental to developing the understanding of how we see ourselves and the things we do through different perspectives. Everyone should have the right to a quality arts education from kindergarten to higher education.<br /><br />

                                        Quality art education programs allow greater social mobility within the field of art, which is necessary for greater equality and diversity. The benefits of an arts education not only help prepare future artists, but also improve performance of students across disciplines.<br /><br />

                                        Art research and teaching at public institutions of education is necessary to advance art for future generations in a just and equitable way. Public art benefits by the advancement of the knowledge of art. To advance our knowledge of art, we need to invest in quality arts education programs for all.
                                    </p>
                                </div>
                            </PriorityAccordion>
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
                    class="priorities_for_health_container"
                    bind:this={healthPrioritiesElement}
                >
                    <ol class="category_priorities">
                        <li class="priority_heading">
                            <h2>
                                Medicare for all
                            </h2>
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

    #education_priorities_tab {
        background-color: #E2DED0;
    }

    #health_priorities_tab {
        background-color: #FCEDD4;
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
        padding: 0 1rem;
    }

    .priorities_container {
        width: 100%;
    }

    .priorities_for_government_container {
        background-color: #F4F5FB;
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
    }

    .priorities_for_climate_container {
        background-color: #EAEAE5;
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
    }

    .priorities_for_economy_container {
        background-color: #FEF0EE;
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
    }

    .priorities_for_education_container {
        background-color: #E2DED0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
    }

    .priorities_for_health_container {
        background-color: #FCEDD4;
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
    }

    .category_priorities {
        width: 100%;
        max-width: 50rem;
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

    @media (max-width: 1440px) {

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

        .priority_heading > h2 {
            font-size: 1.25rem;
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

        .priority_heading > h2 {
            margin: 0;
            font-size: 1rem;
        }

    }

</style>