<script lang="ts">
    import NominateButton from '$lib/components/buttons/NominateButton.svelte';
    import EndorsedCandidateCard from '$lib/components/cards/endorsementCards/CandidateEndorsementCard.svelte';
    import EndorsedAmendmentCard from '$lib/components/cards/endorsementCards/AmendmentEndorsementCard.svelte';
    import EndorsedLegislationCard from '$lib/components/cards/endorsementCards/LegislationEndorsementCard.svelte';
    import EndorsedReferendumCard from '$lib/components/cards/endorsementCards/ReferendumEndorsementCard.svelte';
    import type { User } from '@auth/core/types.js';
    import Pagination from '$lib/components/pagination/Pagination.svelte';
    import LoaderAnimation from '$lib/components/loaders/LoaderAnimation.svelte';
    import { page } from '$app/stores';

    export let categories_data: Endorsements;

    let URLPathName: string = $page.url.pathname;

    let endorsedAmendments: AmendmentWithSponsorsAndImage[] = [];
    let endorsedCandidates: CandidateWithImage[] = [];
    let endorsedLegislation: LegislationWithSponsorsAndImage[] = [];
    let endorsedReferendums: ReferendumWithImage[] = [];

    $: endorsedAmendments = [...categories_data.endorsed_amendments];
    $: endorsedCandidates = [...categories_data.endorsed_candidates];
    $: endorsedLegislation = [...categories_data.endorsed_legislation];
    $: endorsedReferendums = [...categories_data.endorsed_referendums];

    // set the amount of items to appear in each category on the page
    let pageSize: number = 4;

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

</script>

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
        <li class="candidates_container">
            <h3>
                candidates
            </h3>
            <div class="endorsement_cards_frame">
                <div class="endorsement_cards">
                    {#if categories_data.getEndorsedCandidatesDataSuccess}
                        {#each paginatedEndorsedCandidates as candidate, i}
                            <a 
                                href={`${URLPathName}?candidate_ID=${candidate.candidate_ID}&campaign_name=${candidate.campaign_name.replace(/ /g,"_")}`}
                                data-sveltekit-noscroll
                            > 
                                <EndorsedCandidateCard endorsedCandidateData={candidate}/>
                            </a>
                        {/each}
                    {:else if (categories_data.getEndorsedCandidatesDataSuccess === false)}
                        <p>failed to load endorsed candidates</p>
                    {/if}
                </div>
            </div>
            <Pagination 
                bind:currentPage={categories_data.currentPageCandidates}
                totalCount={endorsedCandidates.length}
                pageSize={pageSize}
            />
        </li>
        <li class="referendums_container">
            <h3>
                referendums
            </h3>
            <div class="endorsement_cards_frame">
                <div class="endorsement_cards">
                    {#if categories_data.getEndorsedReferendumsDataSuccess}
                        {#each paginatedEndorsedReferendums as referendum, i}
                            <a 
                                href={`${URLPathName}?referendum_ID=${referendum.referendum_ID}&referendum_name=${referendum.referendum_name.replace(/ /g,"_")}`}
                                data-sveltekit-noscroll
                            > 
                                <EndorsedReferendumCard endorsedReferendumData={referendum} />
                            </a>
                        {/each}
                    {:else if (categories_data.getEndorsedReferendumsDataSuccess === false)}
                        <p>failed to load endorsed referendums</p>
                    {/if}
                </div>
            </div>
            <Pagination 
                bind:currentPage={categories_data.currentPageReferendums}
                totalCount={endorsedReferendums.length}
                pageSize={pageSize}
            />
        </li>
        <li class="legislation_container">
            <h3>
                legislation
            </h3>
            <div class="endorsement_cards_frame">
                <div class="endorsement_cards">
                    {#if categories_data.getEndorsedLegislationDataSuccess}
                        {#each paginatedEndorsedLegislation as legislation, i}
                            <a 
                                href={`${URLPathName}?legislation_ID=${legislation.legislation_ID}&legislation_name=${legislation.legislation_name.replace(/ /g,"_")}`}
                                data-sveltekit-noscroll
                            > 
                                <EndorsedLegislationCard endorsedLegislationData={legislation} />
                            </a>
                        {/each}
                    {:else if (categories_data.getEndorsedLegislationDataSuccess === false)}
                        <p>failed to load endorsed legislation</p>
                    {/if}
                </div>
            </div>
            <Pagination 
                bind:currentPage={categories_data.currentPageLegislation}
                totalCount={endorsedLegislation.length}
                pageSize={pageSize}
            />
        </li>
        <li class="amendments_container">
            <h3>
                amendments
            </h3>
            <div class="endorsement_cards_frame">
                <div class="endorsement_cards">
                    {#if categories_data.getEndorsedAmendmentsDataSuccess}
                        {#each paginatedEndorsedAmendments as amendment, i}
                            <a 
                                href={`${URLPathName}?amendment_ID=${amendment.amendment_ID}&amendment_name=${amendment.amendment_name.replace(/ /g,"_")}`}
                                data-sveltekit-noscroll
                            >
                                <EndorsedAmendmentCard endorsedAmendmentData={amendment} />
                             </a>
                        {/each}
                    {:else if (categories_data.getEndorsedAmendmentsDataSuccess === false)}
                        <p>failed to load endorsed amendments</p>
                    {/if}
                </div>
            </div>
            <Pagination 
                bind:currentPage={categories_data.currentPageAmendments}
                totalCount={endorsedAmendments.length}
                pageSize={pageSize}
            />
        </li>
    {/if}
</ul>

<style>

    .endorsement_categories_container {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .candidates_container {
        background-color: #FBEFF6;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;

    }

    .referendums_container {
        background-color: #CBC6C2;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .legislation_container {
        background-color: #F8FAF7;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .amendments_container {
        background-color: #F4F4DB;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .endorsement_cards_frame {
        position: relative;
        width: 100%;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .endorsement_cards {
        position: relative;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;      
        gap: 1rem;
        padding: 0 1rem 1rem 1rem;
        width: 100%;
    }

    @media screen and (max-width: 720px) {

        .endorsement_cards {
            flex-wrap: nowrap;
            justify-content: flex-start;
        }

        .endorsement_cards_frame {
            width: 100%;
            max-width: 100%;
        }

	}

</style>