<script lang="ts">
    import Tabs from '$lib/components/tabPanels/Tabs.svelte';
    import TabPanel from '$lib/components/tabPanels/Panel.svelte';
    import { v4 as uuidv4 } from 'uuid';
    import LobbyingPanel from '$lib/components/howWeWork/Lobbying.svelte';
    import ExhibitingPanel from '$lib/components/howWeWork/Exhibiting.svelte';
    import PlatformingPanel from '$lib/components/howWeWork/Platforming.svelte';
    import ConnectingPanel from '$lib/components/howWeWork/Connecting.svelte';
    import DownloadButton from '$lib/components/buttons/DownloadButton.svelte';
    import { Splide, SplideSlide } from '@splidejs/svelte-splide';
    import '@splidejs/svelte-splide/css';
    import SliderImage01 from '$lib/images/slides/slideshow_01/Erin_Maye_Quade_and_stephen_dewyer_13_August_2018.jpg';
    import SliderImage03 from '$lib/images/slides/slideshow_01/Katie_for_Ward_10_endorsed.jpg';
    import { afterUpdate } from 'svelte';

    // set up carousel config
    const mainOptions = {
        pagination: true,
        type: "loop",
        gap     : '1rem',
        autoplay: true,
        arrows  : true,
    };
    const thumbsOptions = {
        arrows: false,
        gap: 5,
        isNavigation: true,
        pagination: false,
        perMove: 1,
        perPage: 4,
        type: "loop",
        updateOnMove: true,
    };

    // sync carousels
    let main: any = Splide;
    let thumbs: any = SplideSlide;

    $: if (main && thumbs) {
        afterUpdate(() => {
        // console.log({ main, thumbs });
        main.sync(thumbs.splide);
        });
    };

    let activeProcessTab: number = 0;
    $: activeProcessTab;

    const loginTabPanels: tabPanels[] = [
		{
			id: uuidv4(),
			index: 0,
			label: "platforming",
			hasCapitol: false,
			panel: PlatformingPanel
		},
		{
			id: uuidv4(),
			index: 1,
			label: "connecting",
			hasCapitol: false,
			panel: ConnectingPanel
		},
		{
			id: uuidv4(),
			index: 2,
			label: "lobbying",
			hasCapitol: false,
			panel: LobbyingPanel
		},
		{
			id: uuidv4(),
			index: 3,
			label: "exhibiting",
			hasCapitol: false,
			panel: ExhibitingPanel
		}
	]

</script>

<section>
    <h2 class="story_section_heading">
        mission
    </h2>
    <p class="story_paragraphs">
        Focusing directly on art and politics, public arts commission is dedicated to redefining art's relation to the public for greater democracy within and outside art.
    </p>
    <h2 class="story_section_heading">
        how we work
    </h2>
    <Tabs 
        tabPanels={loginTabPanels} 
        bind:activeTab={activeProcessTab}
    />
    <TabPanel
        tabPanels={loginTabPanels} 
        bind:activeTab={activeProcessTab}
    />			
    <h2 class="story_section_heading">
        history
    </h2>
    <ul class="history_list">
        <li>
            <h3>
                2011
            </h3>
            <p>
                public arts commission Founder stephen dewyer participates in Occupy Wall Street.  Many of the organizers of Occupy Wall Street are artists.  The protests evenually fizzle due to failure to translate popular support into government change.  A key learning lesson is to engage electoral politics with popular movements for democratic change organized by art workers.
            </p>
        </li>
        <li>
            <h3>
                2017
            </h3>
            <p>
                public arts commission launches to strengthen democracy by expanding the political imaginary.  public arts commission plans to strengthen the political imaginary by supporting democratic movements that support greater public art and by giving a platform for the art community participating in politics.
            </p>
        </li>
        <li>
            <h3>
                2018
            </h3>
            <p>
                First election featuring campaigns endorsed by public arts commission.  Elections have historic turnout with many of the campaigns endorsed by public arts commission winning in the primaries and general elections.  
            </p>
        </li>
        <li>
            <h3>
                2020
            </h3>
            <p>
                public arts commission debuts a web portal for campaigns to apply for endorsement.  Progressive turnout saves democracy by helping defeat authoritarian candidates and electing progressive, democratic office holders.
            </p>
        </li>
        <li>
            <h3>
                2023
            </h3>
            <p>
                public arts commission begins working on a web platform to better achieve goals using advanced technologies and artificial intelligence.
            </p>
        </li>
    </ul>
    <h2 class="story_section_heading">
        impact
    </h2>
    <div class="impact_slider">
        <div class="splide" >
            <div class="gallery_main">
            <Splide 
                bind:this={ main } 
                options={ mainOptions }
                aria-label="impact splide main gallery"
            >
                <SplideSlide >
                <img src={SliderImage01} alt="public arts commission Founder stephen dewyer handshakes with Erin Maye Quade in front of public art in Northfield, Minnesota on 13 August 2018" />
                </SplideSlide>
                <SplideSlide class="splide__slide">
                <img src={SliderImage03} alt="Katie Jones for Ward 10 endorsed by public arts commission" />
                </SplideSlide>
            </Splide>
            </div>
            <div class="gallery_thumbs">
            <Splide
                id="gallery--thumbs"
                bind:this={ thumbs } 
                options={ thumbsOptions }
                aria-label="impact splide thumbnails"
            >
                <SplideSlide >
                <img src={SliderImage01} alt="public arts commission Founder stephen dewyer handshakes with Erin Maye Quade in front of public art in Northfield, Minnesota on 13 August 2018" />
                </SplideSlide>
                <SplideSlide class="splide__slide">
                <img src={SliderImage03} alt="Katie Jones for Ward 10 endorsed by public arts commission" />
                </SplideSlide>
            </Splide>
            </div>
        </div>
    </div>
    <h2 class="story_section_heading">
        organization
    </h2>
    <p class="story_paragraphs">
        public arts commission is a grassroots, 501(c)(4) non-profit organization based in Minnesota.
    </p>
    <div class="organization_documents">
        <DownloadButton
            linkTarget="/assets/PDFs/public_arts_commission_bylaws.pdf"
        >
            bylaws
        </DownloadButton>
        <DownloadButton
            linkTarget="/assets/PDFs/public_arts_commission_conflict_of_interest_policy.pdf"
        >
            conflict of interest policy
        </DownloadButton>
    </div>
    <h2 class="story_section_heading">
        location
    </h2>
    <p class="story_paragraphs">
        public arts commission combines art and politics across the United States at all levels of government and is currently headquartered in Minneapolis, Minnesota.
    </p>
</section>

<style>

    .story_section_heading {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .story_paragraphs {
        padding: 0 1rem;
        max-width: 40rem;
        width: 100%;
        margin: 0 auto;
    }

    .history_list {
        list-style: none;
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
        padding: 0;
    }

    .history_list > li {
        display: flex;
        gap: 2rem;
        padding: 1rem;
        align-items: flex-start;
    }

    .history_list > li > h3 {
        padding: 0;
        margin: 0;
    }

    .impact_slider {
        width: 100%;
        max-width: 60rem;
        margin: 0 auto;
    }

    .organization_documents {
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
    }

    @media (max-width: 720px) {

        .history_list > li {
            flex-direction: column;
            gap: 0.5rem;
        }
        
    }

</style>