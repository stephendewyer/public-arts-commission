import { 
    LoadAllEndorsedCandidates, 
    LoadAllEndorsedActions, 
    LoadAllEndorsedAmendments,
    LoadAllEndorsedLegislation,
    LoadAllEndorsedReferendums
 } from "$lib/server/LoadDataFromDatabaseFunctions.js";

export const load = async (event) => {

    const session = await event.locals.getSession();

    // load all the endorsed candidates from the database

    const endorsedCandidates = await LoadAllEndorsedCandidates();

    const endorsedAmendments = await LoadAllEndorsedAmendments();

    const endorsedActions = await LoadAllEndorsedActions();

    const endorsedLegislation = await LoadAllEndorsedLegislation();

    const endorsedReferendums = await LoadAllEndorsedReferendums();
    return { 

        user: session?.user,
        streamed: {
            endorsed_candidates: endorsedCandidates,
            endorsed_legislation: endorsedLegislation,
            endorsed_actions: endorsedActions,
            endorsed_referendums: endorsedReferendums,
            endorsed_amendments: endorsedAmendments
        }

    };

};
