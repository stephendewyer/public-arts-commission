<script lang="ts">
    import PublicArtsCommissionBanner from '$lib/images/endorsed_campaign_search_banner.jpg';
    import Tabs from '$lib/components/tabPanels/Tabs.svelte';
    import TabPanel from '$lib/components/tabPanels/Panel.svelte';
    import { v4 as uuidv4 } from 'uuid';
    import LobbyingPanel from '$lib/components/howWeWork/Lobbying.svelte';
    import ExhibitingPanel from '$lib/components/howWeWork/Exhibiting.svelte';
    import PlatformingPanel from '$lib/components/howWeWork/Platforming.svelte';
    import ConnectingPanel from '$lib/components/howWeWork/Connecting.svelte';
    import DownloadButton from '$lib/components/buttons/DownloadButton.svelte';
    import ImpactSlider from '$lib/components/sliders/Impact.svelte';

    let activeProcessTab: number = 0;
    $: activeProcessTab;

    const loginTabPanels: tabPanels[] = [
		{
			id: uuidv4(),
			index: 0,
			label: "platforming",
			hasCapitol: false,
			panel: PlatformingPanel,
            data: []
		},
		{
			id: uuidv4(),
			index: 1,
			label: "connecting",
			hasCapitol: false,
			panel: ConnectingPanel,
            data: []
		},
		{
			id: uuidv4(),
			index: 2,
			label: "lobbying",
			hasCapitol: false,
			panel: LobbyingPanel,
            data: []
		},
		{
			id: uuidv4(),
			index: 3,
			label: "exhibiting",
			hasCapitol: false,
			panel: ExhibitingPanel,
            data: []
		}
	];

</script>
<svelte:head>
	<title>story - public arts commission</title>
	<meta name="description" content="public arts commission story" />
	<meta property="og:image" content="{PublicArtsCommissionBanner}" />
</svelte:head>
<section>
    <h2 class="story_section_heading">
        mission
    </h2>
    <p class="story_paragraphs">
        Reimagine the American Dream and help make it happen for a stronger, more democratic society by giving the art community a platform in politics.
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
    <table class="history_list">
        <tbody>
            <tr>
                <td>
                    <h3 style="white-space: nowrap;">
                        1933 – 1938
                    </h3>
                </td>
                <td>
                    <p>
                        The New Deal creates sweeping changes to the U.S. economy that strengthened trust in democracy and led to one of the largest expansions of income equality and the middle class in the history of the world.
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <h3 style="white-space: nowrap;">
                        1979 - 1980
                    </h3>
                </td>
                <td>
                    <p>
                        Dismantling of the New Deal begins as Ronald Reagan becomes President of the United States and Margaret Thatcher becomes Prime Minister of the United Kingdom.  Decades of privatization follow, weakening democracy and giving rise to oligarchy and authoritarianism.            
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <h3>
                        2011
                    </h3>
                </td>
                <td>
                    <p>
                        public arts commission Founder stephen dewyer participates in Occupy Wall Street.  Many of the organizers of Occupy Wall Street are artists.  The protests evenually fizzle due to failure to translate popular support into government change.  A key learning lesson is to engage electoral politics with popular movements for democratic change organized by art workers.
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <h3>
                        2017
                    </h3>
                </td>
                <td>
                    <p>
                        public arts commission launches to strengthen democracy by expanding the political imaginary.  public arts commission plans to strengthen the political imaginary by supporting democratic movements that support greater public art and by giving a platform for the art community participating in politics.
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <h3>
                        2018
                    </h3>
                </td>
                <td>
                    <p>
                        First election featuring campaigns endorsed by public arts commission.  Elections have historic turnout with many of the campaigns endorsed by public arts commission winning in the primaries and general elections.  
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <h3>
                        2020
                    </h3>
                </td>
                <td>
                    <p>
                        public arts commission debuts a web portal for campaigns to apply for endorsement.  Progressive turnout saves democracy by helping defeat authoritarian candidates and electing progressive, democratic office holders.
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <h3>
                        2023
                    </h3>
                </td>
                <td>
                    <p>
                        public arts commission begins working on a web platform to better achieve goals using advanced technologies and artificial intelligence.
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
    <h2 class="story_section_heading">
        impact
    </h2>
    <div class="impact_slider">
        <ImpactSlider />
    </div>
    <h2 class="story_section_heading">
        organization
    </h2>
    <p class="story_paragraphs">
        public arts commission is a grassroots, 501(c)(4) non-profit organization.
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
        public arts commission combines art and politics across the United States at all levels of government and is currently headquartered in Tucson, Arizona.
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

    .history_list > tbody > tr {
        padding: 1rem;
    }

    table {
        border: none;
    }

    table, td {
        padding: 1rem;
    }

    .history_list > tbody > tr > td > h3 {
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

        .history_list > tbody > tr > td {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }
        
        table, td {
            padding: 0.5rem;
        }
    }

</style>