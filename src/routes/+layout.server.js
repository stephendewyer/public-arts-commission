import { 
    LoadAllEndorsedCandidates, 
    LoadAllEndorsedActions, 
    LoadAllEndorsedAmendments,
    LoadAllEndorsedLegislation,
    LoadAllEndorsedReferendums,
    LoadAllEndorsedAmendmentsImages,
    LoadAllEndorsedActionsImages,
    LoadAllEndorsedCandidatesImages,
    LoadAllEndorsedLegislationImages,
    LoadAllEndorsedReferendumsImages
 } from "$lib/server/LoadDataFromDatabaseFunctions.js";

export const load = async (event) => {

    const session = await event.locals.getSession();

    // load all the endorsed candidates from the database

    const endorsedCandidates = await LoadAllEndorsedCandidates();

    /**
     * @type {number[]}
     */
    let endorsedCandidatesImageIds = [];

    endorsedCandidates.forEach((candidate) => {
        endorsedCandidatesImageIds.push(candidate.image_ID);
    });

    const endorsedAmendments = await LoadAllEndorsedAmendments();
    /**
     * @type {number[]}
     */
    let endorsedAmendmentsImageIds = [];

    endorsedAmendments.forEach((amendment) => {
        endorsedAmendmentsImageIds.push(amendment.image_ID);
    });

    const endorsedActions = await LoadAllEndorsedActions();
    /**
     * @type {number[]}
     */
    let endorsedActionsImageIds = [];

    endorsedActions.forEach((action) => {
        endorsedActionsImageIds.push(action.image_ID);
    });

    const endorsedLegislation = await LoadAllEndorsedLegislation();
    /**
     * @type {number[]}
     */
    let endorsedLegislationImageIds = [];

    endorsedLegislation.forEach((legislation) => {
        endorsedLegislationImageIds.push(legislation.image_ID);
    });

    const endorsedReferendums = await LoadAllEndorsedReferendums();
    /**
     * @type {number[]}
     */
    let endorsedReferendumsImageIds = [];

    endorsedReferendums.forEach((referendum) => {
        endorsedReferendumsImageIds.push(referendum.image_ID);
    });

    // get the image URLS from image_IDs in endorsements

    const endorsedCandidatesImages = await LoadAllEndorsedCandidatesImages(endorsedCandidatesImageIds);
    const endorsedAmendmentsImages = await LoadAllEndorsedAmendmentsImages(endorsedAmendmentsImageIds);
    const endorsedReferendumsImages = await LoadAllEndorsedReferendumsImages(endorsedReferendumsImageIds);
    const endorsedLegislationImages = await LoadAllEndorsedLegislationImages(endorsedLegislationImageIds);
    const endorsedActionsImages = await LoadAllEndorsedActionsImages(endorsedActionsImageIds);

    return { 

        user: session?.user,
        streamed: {
            endorsed_candidates: endorsedCandidates,
            endorsed_candidates_images: endorsedCandidatesImages,
            endorsed_legislation: endorsedLegislation,
            endorsed_legislation_images: endorsedLegislationImages,
            endorsed_actions: endorsedActions,
            endorsed_actions_images: endorsedActionsImages,
            endorsed_referendums: endorsedReferendums,
            endorsed_referendums_images: endorsedReferendumsImages,
            endorsed_amendments: endorsedAmendments,
            endorsed_amendments_images: endorsedAmendmentsImages
        }

    };

};
