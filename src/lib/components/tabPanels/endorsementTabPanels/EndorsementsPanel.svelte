<script lang="ts">
    import ActionEndorsementCard from "$lib/components/cards/endorsementCards/ActionEndorsementCard.svelte";
    import CandidateEndorsementCard from "$lib/components/cards/endorsementCards/CandidateEndorsementCard.svelte";
    import AmendmentEndorsementCard from "$lib/components/cards/endorsementCards/AmendmentEndorsementCard.svelte";
    import ReferendumEndorsementCard from "$lib/components/cards/endorsementCards/ReferendumEndorsementCard.svelte";
    import LegislationEndorsementCard from "$lib/components/cards/endorsementCards/LegislationEndorsementCard.svelte";
    import Pagination from "$lib/components/pagination/Pagination.svelte";

    let { 
        tabPanels =$bindable(), 
        endorsementNavHeight = $bindable(), 
        activeTab = $bindable(), 
        currentPage = $bindable(),
        endorsementsType
    }: { 
        tabPanels: EndorsementTabPanel[], 
        endorsementNavHeight: number, 
        activeTab: number, 
        currentPage: number,
        endorsementsType: string
    } = $props();

    let innerWidth: number = $state(0);
    let innerHeight: number = $state(0);

    // pagination logic for activeTabPanel

    // set the amount of items to appear in each category on the page
    let pageSize: number = 16;

    // set the index of the first item to appear on the page for each category
    let firstPageIndex: number = $derived((currentPage -1) * pageSize);

    // set the index for the page after the first page for each category
    let lastPageIndex: number = $derived(firstPageIndex + pageSize);

    let paginatedEndorsements: any[] = $derived.by(() => {

        let endorsements: any[] = [];

        tabPanels.forEach((tabPanel: EndorsementTabPanel) => {

            if (activeTab === tabPanel.index) {
                // use the first page index and last page index to slice the correct items to appear on the page for each category
                endorsements = tabPanel.data.slice(firstPageIndex, lastPageIndex);
            };
        });

        return endorsements;

    });

</script>

<svelte:window 
    bind:innerWidth 
    bind:innerHeight
/>
{#each tabPanels as tabPanel, i}
    {#if activeTab === tabPanel.index}
        <div class="endorsement_categories_container">
            <div 
                class="endorsement_section_container" 
                id={`${tabPanel.label}_tabpanel`}
                role="tabpanel"
                tabindex={-i}
                aria-labelledby={`tabpanel_header_${tabPanel.label}`}
            >
                <div class="endorsement_cards_and_pagination">
                    <div class="endorsement_cards_frame">
                        {#key (currentPage)}
                            <div 
                                class="endorsement_cards"
                            >
                                {#each paginatedEndorsements as endorsement, i}
                                    {#key endorsement}
                                        {#if endorsementsType === "referendums"}
                                            <ReferendumEndorsementCard endorsedReferendumData={endorsement} />
                                        {:else if endorsementsType === "amendments"}
                                            <AmendmentEndorsementCard endorsedAmendmentData={endorsement} />
                                        {:else if endorsementsType === "legislation"}
                                            <LegislationEndorsementCard endorsedLegislationData={endorsement} />
                                        {:else if endorsementsType === "actions"}
                                            <ActionEndorsementCard endorsedActionData={endorsement} />
                                        {:else if endorsementsType === "candidates"}
                                            <CandidateEndorsementCard endorsedCandidateData={endorsement}/>
                                        {/if}
                                    {/key}
                                {/each} 
                            </div>
                        {/key}
                    </div>
                    <div class="pagination_container">
                        <Pagination 
                            bind:currentPage={currentPage}
                            totalCount={tabPanel.data.length}
                            pageSize={pageSize}
                        />
                    </div>
                </div>
            </div>
        </div>
    {/if}
{/each}

<style>

    .endorsement_categories_container {
        position: relative;
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .endorsement_section_container {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .endorsement_cards_and_pagination {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .endorsement_cards_frame {
        position: relative;
        width: auto;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .endorsement_cards {
        position: relative;
        display: grid;
        grid-template-columns: repeat(4, 1fr);   
        gap: 1rem;
        padding: 0 0 1rem 0;
        width: 100%;
    }

    .pagination_container {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    @media screen and (max-width: 1440px) {
        .endorsement_cards {
            grid-template-columns: repeat(3, 1fr);   
        }
    }

    @media screen and (max-width: 1080px) {
        .endorsement_cards_frame {
            width: 100%;
            max-width: 100%;
        }

        .endorsement_cards {
            grid-template-columns: repeat(2, 1fr);   
        }

    }

    @media screen and (max-width: 720px) {

        .endorsement_section_container {
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
        }

        .endorsement_cards {
            grid-template-columns: repeat(1, 1fr);   
        }

	}

    
</style>