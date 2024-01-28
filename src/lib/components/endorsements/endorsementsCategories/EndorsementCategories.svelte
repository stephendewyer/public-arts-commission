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

    export let categories_data: any;

    let URLPathName: string = $page.url.pathname;

    $: categories_data;

    let endorsedAmendments: AmendmentWithSponsorsAndImage[] = [];
    let endorsedCandidates: CandidateWithImage[] = [];
    let endorsedLegislation: LegislationWithSponsorsAndImage[] = [];
    let endorsedReferendums: ReferendumWithImage[] = [];

    $: endorsedAmendments = [...categories_data.endorsed_amendments];
    $: endorsedCandidates = [...categories_data.endorsed_candidates];
    $: endorsedLegislation = [...categories_data.endorsed_legislation];
    $: endorsedReferendums = [...categories_data.endorsed_referendums];

    const user: User | undefined = categories_data.user;

    // set the amount of items to appear in each category on the page
    let pageSize: number = 4;

    let candidatesCurrentPage: number;
    let legislationCurrentPage: number;
    let referendumsCurrentPage: number;
    let amendmentsCurrentPage: number;

    $: candidatesCurrentPage = 1;
    $: legislationCurrentPage = 1;
    $: referendumsCurrentPage = 1;
    $: amendmentsCurrentPage = 1;

    // set the index of the first item to appear on the page for each category
    let firstPageIndexAmendments: number;
    $: firstPageIndexAmendments = (amendmentsCurrentPage -1) * pageSize;
    
    let firstPageIndexCandidates: number;
    $: firstPageIndexCandidates = (candidatesCurrentPage -1) * pageSize;

    let firstPageIndexLegislation: number;
    $: firstPageIndexLegislation = (legislationCurrentPage -1) * pageSize;

    let firstPageIndexReferendums: number;
    $: firstPageIndexReferendums = (referendumsCurrentPage -1) * pageSize;

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
    <li class="candidates_container">
        <h3>
            candidates
        </h3>
        <div class="endorsement_cards_frame">
            <div class="endorsement_cards">
                {#if categories_data.pendingEndorsedCandidatesData}
                    <LoaderAnimation />
                {:else if categories_data.getEndorsedCandidatesDataSuccess}
                    {#each paginatedEndorsedCandidates as candidate, i}
                        <a href={`${URLPathName}?candidate_ID=${candidate.candidate_ID}&campaign_name=${candidate.campaign_name.replace(/ /g,"_")}`}> 
                            <EndorsedCandidateCard endorsedCandidateData={candidate}/>
                        </a>
                    {/each}
                {:else if !categories_data.getEndorsedCandidatesDataSuccess}
                    <p>failed to load endorsed candidates</p>
                {/if}
            </div>
        </div>
        <Pagination 
            bind:currentPage={candidatesCurrentPage}
            totalCount={endorsedCandidates.length}
            pageSize={pageSize}
        />
        <div class="nominate_a_candidate_button_container">
            <NominateButton 
                category="candidate" 
                authorized_user={user}
            >
                nominate a candidate
            </NominateButton>
        </div>
    </li>
    <li class="referendums_container">
        <h3>
            referendums
        </h3>
        <div class="endorsement_cards_frame">
            <div class="endorsement_cards">
                {#if categories_data.pendingEndorsedReferendumsData}
                    <LoaderAnimation />
                {:else if categories_data.getEndorsedReferendumsDataSuccess}
                    {#each paginatedEndorsedReferendums as referendum, i}
                        <a href={`${URLPathName}?referendum_ID=${referendum.referendum_ID}&referendum_name=${referendum.referendum_name.replace(/ /g,"_")}`}> 
                            <EndorsedReferendumCard endorsedReferendumData={referendum} />
                        </a>
                    {/each}
                {:else if !categories_data.getEndorsedReferendumsDataSuccess}
                    <p>failed to load endorsed referendums</p>
                {/if}
            </div>
        </div>
        <Pagination 
            bind:currentPage={referendumsCurrentPage}
            totalCount={endorsedReferendums.length}
            pageSize={pageSize}
        />
        <div class="nominate_a_candidate_button_container">
            <NominateButton 
                category="referendum"
                authorized_user={user}
            >
                nominate an initiative
            </NominateButton>
        </div>
    </li>
    <li class="legislation_container">
        <h3>
            legislation
        </h3>
        <div class="endorsement_cards_frame">
            <div class="endorsement_cards">
                {#if categories_data.pendingEndorsedLegislationData}
                    <LoaderAnimation />
                {:else if categories_data.getEndorsedLegislationDataSuccess}
                    {#each paginatedEndorsedLegislation as legislation, i}
                        <a href={`${URLPathName}?legislation_ID=${legislation.legislation_ID}&legislation_name=${legislation.legislation_name.replace(/ /g,"_")}`}> 
                            <EndorsedLegislationCard endorsedLegislationData={legislation} />
                        </a>
                    {/each}
                {:else if !categories_data.getEndorsedLegislationDataSuccess}
                    <p>failed to load endorsed legislation</p>
                {/if}
            </div>
        </div>
        <Pagination 
            bind:currentPage={legislationCurrentPage}
            totalCount={endorsedLegislation.length}
            pageSize={pageSize}
        />
        <div class="nominate_a_candidate_button_container">
            <NominateButton 
                category="legislation"
                authorized_user={user}
            >
                nominate a bill
            </NominateButton>
        </div>
    </li>
    <li class="amendments_container">
        <h3>
            amendments
        </h3>
        <div class="endorsement_cards_frame">
            <div class="endorsement_cards">
                {#if categories_data.pendingEndorsedAmendmentsData}
                    <LoaderAnimation />
                {:else if categories_data.getEndorsedAmendmentsDataSuccess}
                    {#each paginatedEndorsedAmendments as amendment, i}
                        <a 
                            href={`${URLPathName}?amendment_ID=${amendment.amendment_ID}&amendment_name=${amendment.amendment_name.replace(/ /g,"_")}`}>
                            <EndorsedAmendmentCard endorsedAmendmentData={amendment} />
                         </a>
                    {/each}
                {:else if !categories_data.getEndorsedAmendmentsDataSuccess}
                    <p>failed to load endorsed amendments</p>
                {/if}
            </div>
        </div>
        <Pagination 
            bind:currentPage={amendmentsCurrentPage}
            totalCount={endorsedAmendments.length}
            pageSize={pageSize}
        />
        <div class="nominate_a_candidate_button_container">
            <NominateButton 
                category="amendment"
                authorized_user={user}
            >
                nominate an amendment
            </NominateButton>
        </div>
    </li>
</ul>

<style>

    .endorsement_categories_container {
        list-style: none;
        margin: 0;
        padding: 0;
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
        width: 100%;
        overflow-x: hidden;
    }

    .endorsement_cards {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;      
        gap: 1rem;
        padding: 0 1rem 1rem 1rem;
        width: 100%;
    }

    .nominate_a_candidate_button_container {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding: 1rem 0 0 0;
    }

    @media (max-width: 1140px) {

        .endorsement_cards_frame {
            width: 100%;
            overflow-x: scroll;
        }

        .endorsement_cards {
            width: 100%;
            flex-wrap: nowrap;
            justify-content: flex-start;
        }

	}

	@media (max-width: 720px) {

        
        
	}

</style>