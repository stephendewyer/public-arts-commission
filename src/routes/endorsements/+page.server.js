import { LoadAllEndorsedAmendments } from '$lib/server/loadDataFromDatabase/LoadEndorsedAmendments.js';
import { LoadAllEndorsedCandidates } from '$lib/server/loadDataFromDatabase/LoadEndorsedCandidates.js';
import { LoadAllEndorsedLegislation } from '$lib/server/loadDataFromDatabase/LoadEndorsedLegislation.js';
import { LoadAllEndorsedReferendums } from '$lib/server/loadDataFromDatabase/LoadEndorsedReferendums.js';

export const load = async () => {

    return { 
        
        streamed: {
            endorsed_candidates: await LoadAllEndorsedCandidates(),
            endorsed_legislation: await LoadAllEndorsedLegislation(),
            endorsed_referendums: await LoadAllEndorsedReferendums(),
            endorsed_amendments: await LoadAllEndorsedAmendments()
        }

    };

};
