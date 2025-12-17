<script lang="ts">
    import EndorsedCandidateCard from '$lib/components/cards/endorsementCards/CandidateEndorsementCard.svelte';
    import EndorsedAmendmentCard from '$lib/components/cards/endorsementCards/AmendmentEndorsementCard.svelte';
    import EndorsedLegislationCard from '$lib/components/cards/endorsementCards/LegislationEndorsementCard.svelte';
    import EndorsedReferendumCard from '$lib/components/cards/endorsementCards/ReferendumEndorsementCard.svelte';
    import Pagination from '$lib/components/pagination/Pagination.svelte';
    import LoaderAnimation from '$lib/components/loaders/LoaderAnimation.svelte';
    import { page } from '$app/state';
    import { afterUpdate, onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    export let endorsementNavHeight: number = 0;
    export let categories_data: Endorsements;

    let URLPathName: string = page.url.pathname;

    let endorsedAmendments: AmendmentWithSponsorsAndImage[] = [];
    let endorsedCandidates: CandidateWithImage[] = [];
    let endorsedLegislation: LegislationWithSponsorsAndImage[] = [];
    let endorsedReferendums: ReferendumWithImage[] = [];

    $: endorsedAmendments = [...categories_data.endorsed_amendments];
    $: endorsedCandidates = [...categories_data.endorsed_candidates];
    $: endorsedLegislation = [...categories_data.endorsed_legislation];
    $: endorsedReferendums = [...categories_data.endorsed_referendums];

    // set the amount of items to appear in each category on the page
    let pageSize: number = 8;

    // set the index of the first item to appear on the page for each category
    let firstPageIndexAmendments: number;
    $: firstPageIndexAmendments = (categories_data.currentPageAmendments -1) * pageSize;
    
    let firstPageIndexCandidates: number;
    $: firstPageIndexCandidates = (categories_data.currentPageCandidates -1) * pageSize;

    let firstPageIndexLegislation: number;
    $: firstPageIndexLegislation = (categories_data.currentPageLegislation -1) * pageSize;

    let firstPageIndexReferendums: number;
    $: firstPageIndexReferendums = (categories_data.currentPageReferendums -1) * pageSize;

    // set the index for the page after the first page for each category
    let lastPageIndexAmendments: number;
    $: lastPageIndexAmendments = firstPageIndexAmendments + pageSize;

    let lastPageIndexCandidates: number;
    $: lastPageIndexCandidates = firstPageIndexCandidates + pageSize;

    let lastPageIndexLegislation: number;
    $: lastPageIndexLegislation = firstPageIndexLegislation + pageSize;

    let lastPageIndexReferendums: number;
    $: lastPageIndexReferendums = firstPageIndexReferendums + pageSize;

    let paginatedEndorsedAmendments: AmendmentWithSponsorsAndImage[];
    let paginatedEndorsedCandidates: CandidateWithImage[];
    let paginatedEndorsedLegislation: LegislationWithSponsorsAndImage[];
    let paginatedEndorsedReferendums: ReferendumWithImage[];

    // use the first page index and last page index to slice the correct items to appear on the page for each category
    $: paginatedEndorsedAmendments = endorsedAmendments.slice(firstPageIndexAmendments, lastPageIndexAmendments);
    $: paginatedEndorsedCandidates = endorsedCandidates.slice(firstPageIndexCandidates, lastPageIndexCandidates);
    $: paginatedEndorsedLegislation = endorsedLegislation.slice(firstPageIndexLegislation, lastPageIndexLegislation);
    $: paginatedEndorsedReferendums = endorsedReferendums.slice(firstPageIndexReferendums, lastPageIndexReferendums);

    let candidatesSectionElement: HTMLElement;
    let candidatesSectionElementTop: number = 0;
    let candidatesSectionElementBottom: number = 0;
    let candidatesHeadingSticky: boolean = false;
    let candidatesHeadingAbsolute: boolean = false;
    let candidatesHeadingHeight: number = 0;

    let referendumsSectionElement: HTMLElement;
    let referendumsSectionElementTop: number = 0;
    let referendumsSectionElementBottom: number = 0;
    let referendumsHeadingSticky: boolean = false;
    let referendumsHeadingAbsolute: boolean = false;
    let referendumsHeadingHeight: number = 0;

    let amendmentsSectionElement: HTMLElement;
    let amendmentsSectionElementTop: number = 0;
    let amendmentsSectionElementBottom: number = 0;
    let amendmentsHeadingSticky: boolean = false;
    let amendmentsHeadingAbsolute: boolean = false;
    let amendmentsHeadingHeight: number = 0;

    let legislationSectionElement: HTMLElement;
    let legislationSectionElementTop: number = 0;
    let legislationSectionElementBottom: number = 0;
    let legislationHeadingSticky: boolean = false;
    let legislationHeadingAbsolute: boolean = false;
    let legislationHeadingHeight: number = 0;

    onMount(() => {
        if (candidatesSectionElement) {
            candidatesSectionElementTop = candidatesSectionElement.getBoundingClientRect().top + window.scrollY;
            candidatesSectionElementBottom = candidatesSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
        if (referendumsSectionElement) {
            referendumsSectionElementTop = referendumsSectionElement.getBoundingClientRect().top + window.scrollY;
            referendumsSectionElementBottom = referendumsSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
        if (amendmentsSectionElement) {
            amendmentsSectionElementTop = amendmentsSectionElement.getBoundingClientRect().top + window.scrollY;
            amendmentsSectionElementBottom = amendmentsSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
        if (legislationSectionElement) {
            legislationSectionElementTop = legislationSectionElement.getBoundingClientRect().top + window.scrollY;
            legislationSectionElementBottom = legislationSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
    });

    afterUpdate(() => {
        if (candidatesSectionElement) {
            candidatesSectionElementTop = candidatesSectionElement.getBoundingClientRect().top + window.scrollY;
            candidatesSectionElementBottom = candidatesSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
        if (referendumsSectionElement) {
            referendumsSectionElementTop = referendumsSectionElement.getBoundingClientRect().top + window.scrollY;
            referendumsSectionElementBottom = referendumsSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
        if (amendmentsSectionElement) {
            amendmentsSectionElementTop = amendmentsSectionElement.getBoundingClientRect().top + window.scrollY;
            amendmentsSectionElementBottom = amendmentsSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
        if (legislationSectionElement) {
            legislationSectionElementTop = legislationSectionElement.getBoundingClientRect().top + window.scrollY;
            legislationSectionElementBottom = legislationSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
    });

    const windowResizeHandler = () => {
        if (candidatesSectionElement) {
            candidatesSectionElementTop = candidatesSectionElement.getBoundingClientRect().top + window.scrollY;
            candidatesSectionElementBottom = candidatesSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
        if (referendumsSectionElement) {
            referendumsSectionElementTop = referendumsSectionElement.getBoundingClientRect().top + window.scrollY;
            referendumsSectionElementBottom = referendumsSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
        if (amendmentsSectionElement) {
            amendmentsSectionElementTop = amendmentsSectionElement.getBoundingClientRect().top + window.scrollY;
            amendmentsSectionElementBottom = amendmentsSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
        if (legislationSectionElement) {
            legislationSectionElementTop = legislationSectionElement.getBoundingClientRect().top + window.scrollY;
            legislationSectionElementBottom = legislationSectionElement.getBoundingClientRect().bottom + window.scrollY;
        };
    };

    let y: number = 0;

    let innerWidth: number = 0;
    let innerHeight: number = 0;

    $: if (innerWidth > 720) {
        if (
            (y > candidatesSectionElementTop - endorsementNavHeight) && 
            (y <= candidatesSectionElementBottom - endorsementNavHeight - candidatesHeadingHeight) 
        ) {
            candidatesHeadingSticky = true;
        } else {
            candidatesHeadingSticky = false;
        };

        if (y > candidatesSectionElementBottom - endorsementNavHeight - candidatesHeadingHeight) {
            candidatesHeadingAbsolute = true;
        } else {
            candidatesHeadingAbsolute = false;
        };

        if (
            (y > referendumsSectionElementTop - endorsementNavHeight) && 
            (y <= referendumsSectionElementBottom - endorsementNavHeight - referendumsHeadingHeight) 
        ) {
            referendumsHeadingSticky = true;
        } else {
            referendumsHeadingSticky = false;
        };

        if (y > referendumsSectionElementBottom - endorsementNavHeight - referendumsHeadingHeight) {
            referendumsHeadingAbsolute = true;
        } else {
            referendumsHeadingAbsolute = false;
        };

        if (
            (y > amendmentsSectionElementTop - endorsementNavHeight) && 
            (y <= amendmentsSectionElementBottom - endorsementNavHeight - amendmentsHeadingHeight) 
        ) {
            amendmentsHeadingSticky = true;
        } else {
            amendmentsHeadingSticky = false;
        };

        if (y > amendmentsSectionElementBottom - endorsementNavHeight - amendmentsHeadingHeight) {
            amendmentsHeadingAbsolute = true;
        } else {
            amendmentsHeadingAbsolute = false;
        };

        if (
            (y > legislationSectionElementTop - endorsementNavHeight) && 
            (y <= legislationSectionElementBottom - endorsementNavHeight - legislationHeadingHeight) 
        ) {
            legislationHeadingSticky = true;
        } else {
            legislationHeadingSticky = false;
        };

        if ((y) > legislationSectionElementBottom - endorsementNavHeight - legislationHeadingHeight) {
            legislationHeadingAbsolute = true;
        } else {
            legislationHeadingAbsolute = false;
        };
    } else {
        candidatesHeadingAbsolute = false;
        candidatesHeadingSticky = false;
        referendumsHeadingAbsolute = false;
        referendumsHeadingSticky = false;
        legislationHeadingAbsolute = false;
        legislationHeadingSticky = false;
        amendmentsHeadingAbsolute = false;
        amendmentsHeadingSticky = false;
    };

    // $: console.log("legislation sticky: ", legislationHeadingSticky)
    // $: console.log("legislation absolute: ", legislationHeadingAbsolute)
    // $: console.log("endorsement nav tabs height: ", endorsementNavHeight)

</script>
<svelte:window 
    bind:innerWidth 
    bind:scrollY={y} 
    bind:innerHeight
    on:resize={windowResizeHandler}
/>
<ul class="endorsement_categories_container">
    {#if ( 
        categories_data.pendingEndorsedCandidatesData || 
        categories_data.pendingEndorsedReferendumsData ||
        categories_data.pendingEndorsedLegislationData ||
        categories_data.pendingEndorsedAmendmentsData 
    )}
        <LoaderAnimation />
    {:else if (
        categories_data.pendingEndorsedCandidatesData === false &&
        categories_data.pendingEndorsedReferendumsData === false &&
        categories_data.pendingEndorsedLegislationData === false &&
        categories_data.pendingEndorsedAmendmentsData === false
    )}
        <li 
            class="endorsement_section_container"
            style="background-color: #FBEFF6;"
            bind:this={candidatesSectionElement}
        >
            <div 
                class="section_heading_container"
                style={candidatesHeadingSticky || candidatesHeadingAbsolute ? `height: ${candidatesHeadingHeight}px;` : "height: auto;"}
            >
                <h3 
                    id="candidates_heading"
                    bind:clientHeight={candidatesHeadingHeight}
                    class={candidatesHeadingSticky ? "section_heading_sticky" : candidatesHeadingAbsolute ? "section_heading_absolute" : "section_heading_relative"}
                    style={candidatesHeadingSticky ? `top: ${endorsementNavHeight}px;`: ""}
                >
                    candidates
                </h3>
            </div>
            <div class="endorsement_cards_and_pagination">
                <div class="endorsement_cards_frame">
                    {#if categories_data.getEndorsedCandidatesDataSuccess}
                        {#key (categories_data.currentPageCandidates)}
                            <div 
                                class="endorsement_cards"
                                in:fade={{ delay: 250, duration: 300 }}
                            >
                                {#each paginatedEndorsedCandidates as candidate, i}
                                    <a 
                                        href={`${URLPathName}?candidate_ID=${candidate.candidate_ID}&campaign_name=${candidate.campaign_name.replace(/ /g,"_")}`}
                                        data-sveltekit-noscroll
                                    > 
                                        <EndorsedCandidateCard endorsedCandidateData={candidate}/>
                                    </a>
                                {/each} 
                            </div>
                        {/key}
                    {:else if (categories_data.getEndorsedCandidatesDataSuccess === false)}
                        <p>failed to load endorsed candidates</p>
                    {/if}
                </div>
                <div class="pagination_container">
                    <Pagination 
                        bind:currentPage={categories_data.currentPageCandidates}
                        totalCount={endorsedCandidates.length}
                        pageSize={pageSize}
                    />
                </div>
            </div>
        </li>
        <li 
            class="endorsement_section_container"
            style="background-color: #CBC6C2;"
            bind:this={referendumsSectionElement}
        >
            <div 
                class="section_heading_container" 
                style={referendumsHeadingSticky || referendumsHeadingAbsolute ? `height: ${referendumsHeadingHeight}px;` : "height: auto;"}
            >
                <h3 
                    id="referendums_heading"
                    bind:clientHeight={referendumsHeadingHeight}
                    class={referendumsHeadingSticky ? "section_heading_sticky" : referendumsHeadingAbsolute ? "section_heading_absolute" : "section_heading_relative"}
                    style={referendumsHeadingSticky ? `top: ${endorsementNavHeight}px;`: ""}
                >
                    referendums
                </h3>
            </div>
            <div class="endorsement_cards_and_pagination">
                <div class="endorsement_cards_frame">
                    {#if categories_data.getEndorsedReferendumsDataSuccess}
                        {#key (categories_data.currentPageReferendums)}
                            <div 
                                in:fade={{ delay: 250, duration: 300 }}
                                class="endorsement_cards"
                            >
                                {#each paginatedEndorsedReferendums as referendum, i}
                                    <a 
                                        href={`${URLPathName}?referendum_ID=${referendum.referendum_ID}&referendum_name=${referendum.referendum_name.replace(/ /g,"_")}`}
                                        data-sveltekit-noscroll
                                    > 
                                        <EndorsedReferendumCard endorsedReferendumData={referendum} />
                                    </a>
                                {/each}
                            </div>
                        {/key}
                    {:else if (categories_data.getEndorsedReferendumsDataSuccess === false)}
                        <p>failed to load endorsed referendums</p>
                    {/if}
                </div>
                <div class="pagination_container">
                    <Pagination 
                        bind:currentPage={categories_data.currentPageReferendums}
                        totalCount={endorsedReferendums.length}
                        pageSize={pageSize}
                    />
                </div>
            </div>
        </li>
        <li 
            class="endorsement_section_container"
            style="background-color: #F8FAF7;"
            bind:this={legislationSectionElement}
        >
            <div 
                class="section_heading_container"
                style={legislationHeadingSticky || legislationHeadingAbsolute ? `height: ${legislationHeadingHeight}px;` : "height: auto;"}
            >
                <h3 
                    id="legislation_heading"
                    bind:clientHeight={legislationHeadingHeight}
                    class={legislationHeadingSticky? "section_heading_sticky" : legislationHeadingAbsolute ? "section_heading_absolute" : "section_heading_relative"}
                    style={legislationHeadingSticky ? `top: ${endorsementNavHeight}px; background-color: #F8FAF7;`: "background-color: #F8FAF7;"}
                >
                    legislation
                </h3>
            </div>
            <div class="endorsement_cards_and_pagination">
                <div class="endorsement_cards_frame">
                    {#if categories_data.getEndorsedLegislationDataSuccess}
                        {#key (categories_data.currentPageLegislation)}
                            <div 
                                in:fade={{ delay: 250, duration: 300 }}
                                class="endorsement_cards"
                            >
                                {#each paginatedEndorsedLegislation as legislation, i}
                                    <a 
                                        href={`${URLPathName}?legislation_ID=${legislation.legislation_ID}&legislation_name=${legislation.legislation_name.replace(/ /g,"_")}`}
                                        data-sveltekit-noscroll
                                    > 
                                        <EndorsedLegislationCard endorsedLegislationData={legislation} />
                                    </a>
                                {/each}
                            </div>
                        {/key}
                    {:else if (categories_data.getEndorsedLegislationDataSuccess === false)}
                        <p>failed to load endorsed legislation</p>
                    {/if}
                </div>
                <div class="pagination_container">
                    <Pagination 
                        bind:currentPage={categories_data.currentPageLegislation}
                        totalCount={endorsedLegislation.length}
                        pageSize={pageSize}
                    />
                </div>
            </div>
        </li>
        <li 
            class="endorsement_section_container"
            style="background-color: #F4F4DB;"
            bind:this={amendmentsSectionElement}
        >
            <div 
                class="section_heading_container"
                style={amendmentsHeadingSticky || amendmentsHeadingAbsolute ? `height: ${amendmentsHeadingHeight}px;` : "height: auto;"}
            >
                <h3 
                    id="amendments_heading"
                    bind:clientHeight={amendmentsHeadingHeight}
                    class={amendmentsHeadingSticky? "section_heading_sticky" : amendmentsHeadingAbsolute ? "section_heading_absolute" : "section_heading_relative"}
                    style={amendmentsHeadingSticky ? `top: ${endorsementNavHeight}px;`: ""}

                >
                    amendments
                </h3>
            </div>
            <div class="endorsement_cards_and_pagination">
                <div class="endorsement_cards_frame">
                    {#if categories_data.getEndorsedAmendmentsDataSuccess}
                        {#key (categories_data.currentPageAmendments)}
                            <div 
                                in:fade={{ delay: 250, duration: 300 }}
                                class="endorsement_cards"
                            >
                                {#each paginatedEndorsedAmendments as amendment, i}
                                    <a 
                                        href={`${URLPathName}?amendment_ID=${amendment.amendment_ID}&amendment_name=${amendment.amendment_name.replace(/ /g,"_")}`}
                                        data-sveltekit-noscroll
                                    >
                                        <EndorsedAmendmentCard endorsedAmendmentData={amendment} />
                                    </a>
                                {/each}
                            </div>
                        {/key}
                    {:else if (categories_data.getEndorsedAmendmentsDataSuccess === false)}
                        <p>failed to load endorsed amendments</p>
                    {/if}
                </div>
                <div class="pagination_container">
                    <Pagination 
                        bind:currentPage={categories_data.currentPageAmendments}
                        totalCount={endorsedAmendments.length}
                        pageSize={pageSize}
                    />
                </div>
            </div>
        </li>
    {/if}
</ul>

<style>

    #amendments_heading {
        background-color: #F4F4DB;
    }

    #legislation_heading {
        background-color: #F8FAF7;
    }

    #referendums_heading {
        background-color: #CBC6C2;
    }

    #candidates_heading {
        background-color: #FBEFF6;
    }

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

    .section_heading_container {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .section_heading_container > h3 {
        margin: 0;
        font-size: 2rem; 
        text-align: center;
        padding: 0 1rem 0.5rem 1rem;
    }

    .section_heading_relative {
        position: relative;
    }

    .section_heading_absolute {
        position: absolute;
        bottom: 0;
        top: auto;
        left: auto;
        right: auto;
        z-index: 1;
    }

    .section_heading_sticky {
        position: fixed;
        top: 0;
        bottom: auto;
        z-index: 1;
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

        .section_heading_container > h3 {
           font-size: 1.875rem; 
        }
    }

    @media screen and (max-width: 1080px) {
        .endorsement_cards_frame {
            width: 100%;
            max-width: 100%;
        }

        .section_heading_container > h3 {
            font-size: 1.675rem;
        }

    }

    @media screen and (max-width: 720px) {

        .section_heading_container > h3 {
            font-size: 1.5rem;
        }

        .endorsement_section_container {
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
        }

        .endorsement_cards {
            grid-template-columns: repeat(8, 1fr);   
        }

	}

</style>