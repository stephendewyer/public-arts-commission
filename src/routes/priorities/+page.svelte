<script lang="ts">
    import PriorityAccordion from '$lib/components/accordions/PriorityAccordion.svelte';
    import { onMount } from 'svelte';

    let PrioritiesNavTabs: HTMLElement;

    let governmentTabLink: HTMLElement;
    let climateTabLink: HTMLElement;
    let economyTabLink: HTMLElement;
    let educationTabLink: HTMLElement;
    let healthTabLink: HTMLElement;

    let intersecting: string = "governmentPriorities";

    $: intersecting;

    let governmentPrioritiesElement: HTMLElement;
    let climatePrioritiesElement: HTMLElement;
    let economyPrioritiesElement: HTMLElement;
    let educationPrioritiesElement: HTMLElement;
    let healthPrioritiesElement: HTMLElement;

    const scrollToElement = ( tabLink: HTMLElement ) => {
        let linkedElementId: string | null;
        linkedElementId = tabLink.getAttribute('href');
        let linkedElement: HTMLElement | null;
        if (linkedElementId !== null) {
            linkedElement = document.getElementById(linkedElementId);
            // set the intersecting element to the linkedElementId
            intersecting = linkedElementId;
            linkedElement?.scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            return
        }
    }

    let y: number;

    let NavTabsSticky: boolean = false;

    let currentStickyPosition: number;

    onMount(() => {
        currentStickyPosition = PrioritiesNavTabs?.getBoundingClientRect().top + window.scrollY;
    })

    $: if (y > currentStickyPosition) {
        NavTabsSticky = true;
    } else {
        NavTabsSticky = false;
    }

</script>
<svelte:window bind:scrollY={y} />
<section>
    <h1 class="priorities_heading">our priorities guide all our operations</h1>
    <div class="priorities_container">
        <ul
            class={ NavTabsSticky ? "priorities_tabs_sticky" : "priorities_tabs" }
            bind:this={PrioritiesNavTabs}
        >
            <a
                tabindex={1}
                role="tab"
                href="governmentPriorities"
                on:click|preventDefault={() => scrollToElement(governmentTabLink)}
                on:keyup|preventDefault={() => scrollToElement(governmentTabLink)}
                bind:this={governmentTabLink}
            >
                <li
                    id="government_priorities"
                    class={ intersecting === "governmentPriorities" ? "priorities_category_tab_active" : "priorities_category_tab"}
                >
                    <h2>
                        government
                    </h2>
                </li>
            </a>
            <a
                tabindex={2}
                role="tab"
                href="climatePriorities"
                on:click|preventDefault={() => scrollToElement(climateTabLink)}
                on:keyup|preventDefault={() => scrollToElement(climateTabLink)}
                bind:this={climateTabLink}
            >
                <li
                    id="climate_priorities"
                    class={ intersecting === "climatePriorities" ? "priorities_category_tab_active" : "priorities_category_tab" }
                >
                    <h2>
                        climate
                    </h2>
                </li>
            </a>
            <a
                tabindex={3}
                role="tab"
                href="economicPriorities"
                on:click|preventDefault={() => scrollToElement(economyTabLink)}
                on:keyup|preventDefault={() => scrollToElement(economyTabLink)}
                bind:this={economyTabLink}
            >
                <li
                    id="economic_priorities"
                    class={ intersecting === "economicPriorities" ? "priorities_category_tab_active" : "priorities_category_tab" }
                >
                    <h2>
                        economy
                    </h2>
                </li>
            </a>
            <a
                tabindex={4}
                role="tab"
                href="educationPriorities"
                on:click|preventDefault={() => scrollToElement(educationTabLink)}
                on:keyup|preventDefault={() => scrollToElement(educationTabLink)}
                bind:this={educationTabLink}
            >
                <li
                    id="education_priorities"
                    class={ intersecting === "educationPriorities" ? "priorities_category_tab_active" : "priorities_category_tab" }
                >
                    <h2>
                        education
                    </h2>
                </li>
            </a>
            <a
                tabindex={5}
                role="tab"
                href="healthPriorities"
                on:click|preventDefault={() => scrollToElement(healthTabLink)}
                on:keyup|preventDefault={() => scrollToElement(healthTabLink)}
                bind:this={healthTabLink}
            >
                <li
                    id="health_priorities"
                    class={ intersecting === "healthPriorities" ? "priorities_category_tab_active" : "priorities_category_tab" }
                >
                    <h2>
                        health
                    </h2>
                </li> 
            </a>
        </ul>
        <div 
            id="governmentPriorities"
            class="priorities_for_government_container"
            bind:this={governmentPrioritiesElement}
        >
            <ol class="category_priorities">
                <li 
                    class="priority_heading"
                >
                    <PriorityAccordion>
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
        </div>
        <div 
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
            
        </div> 
        <div 
            id="economicPriorities"
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
        </div>
        <div 
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
        </div>
        <div 
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
        </div>
    </div>
</section>

<style>

    .priorities_container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
    }

    .priorities_tabs {
        position: absolute;
        top: "initial";
        display: flex;
        flex-direction: column;
        list-style: none;
        padding: 0;
        margin: 0;
        z-index: 1;
        box-shadow:
            0 1px 1px hsl(0deg 0% 0% / 0.075),
            0 2px 2px hsl(0deg 0% 0% / 0.075),
            0 4px 4px hsl(0deg 0% 0% / 0.075),
            0 8px 8px hsl(0deg 0% 0% / 0.075),
            0 16px 16px hsl(0deg 0% 0% / 0.075)
        ;
    }

    .priorities_tabs_sticky {
        position: fixed;
        top: 0;
        display: flex;
        flex-direction: column;
        list-style: none;
        padding: 0;
        margin: 0;
        z-index: 1;
        box-shadow:
            0 1px 1px hsl(0deg 0% 0% / 0.075),
            0 2px 2px hsl(0deg 0% 0% / 0.075),
            0 4px 4px hsl(0deg 0% 0% / 0.075),
            0 8px 8px hsl(0deg 0% 0% / 0.075),
            0 16px 16px hsl(0deg 0% 0% / 0.075)
        ;
    }

    .priorities_category_tab  {
        position: relative;
        margin: 0;
        padding: 1rem 2rem;
    }

    .priorities_category_tab_active {
        position: relative;
        margin: 0;
        padding: 1rem 2rem;
    }

    .priorities_category_tab_active > h2 {
        margin: 0;

    }

    .priorities_category_tab > h2 {
        margin: 0;
    }

    .priorities_category_tab_active::before {
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

    #government_priorities {
        background-color: #F4F5FB;
    }

    #climate_priorities {
        background-color: #EAEAE5;
    }

    #economic_priorities {
        background-color: #FEF0EE;
    }

    #education_priorities {
        background-color: #E2DED0;
    }

    #health_priorities {
        background-color: #FCEDD4;
    }

    .priorities_heading {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 0 1rem;
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
        .priorities_container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }

        .priorities_tabs {
            position: relative;
            display: flex;
            width: 100%;
            flex-direction: row;
            justify-content: center;
            list-style: none;
            padding: 0;
            margin: 0;
            z-index: 1;
            box-shadow: none;
        }

        .priorities_tabs_sticky {
            position: fixed;
            display: flex;
            list-style: none;
            width: auto;
            flex-direction: row;
            justify-content: center;
            padding: 0;
            margin: 0;
            z-index: 1;
            box-shadow:
                0 1px 1px hsl(0deg 0% 0% / 0.075),
                0 2px 2px hsl(0deg 0% 0% / 0.075),
                0 4px 4px hsl(0deg 0% 0% / 0.075),
                0 8px 8px hsl(0deg 0% 0% / 0.075),
                0 16px 16px hsl(0deg 0% 0% / 0.075)
            ;
        }

        .priorities_category_tab_active::before {
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

        .priorities_category_tab_active {
            position: relative;
            margin: 0;
            padding: 1rem 2rem;
        }

        .priorities_category_tab_active > h2 {
            margin: 0;
            font-size: 1.25rem;
        }

        .priorities_category_tab > h2 {
            margin: 0;
            font-size: 1.25rem;
        }

        .category_priorities {
            font-size: 1rem;
        }

        .priority_heading > h2{
            font-size: 1rem;
        }

    }

    @media (max-width: 720px) {

        .priorities_tabs {
            position: relative;
            display: flex;
            width: 100%;
            flex-direction: row;
            justify-content: center;
            list-style: none;
            padding: 0;
            margin: 0;
            z-index: 1;
            box-shadow: none;
        }

        .priorities_category_tab  {
            position: relative;
            margin: 0;
            padding: 0.75rem 0.5rem;
        }

        .priorities_category_tab_active {
            position: relative;
            margin: 0;
            padding: 0.75rem 0.5rem;
        }

        .priorities_category_tab_active > h2 {
            margin: 0;
            font-size: 0.75rem;
        }

        .priorities_category_tab > h2 {
            margin: 0;
            font-size: 0.75rem;
        }

        .priority_heading {
            font-size: 1rem;
        }

        .priority_heading {
            font-size: 1rem;
        }

    }

</style>