import { LoadAdminByEmail } from '$lib/server/loadDataFromDatabase/LoadAdminByEmail.js';
import { LoadAllEndorsedActions } from '$lib/server/loadDataFromDatabase/LoadEndorsedActions.js';
import { LoadAllEndorsedAmendments } from '$lib/server/loadDataFromDatabase/LoadEndorsedAmendments.js';
import { LoadAllEndorsedCandidates } from '$lib/server/loadDataFromDatabase/LoadEndorsedCandidates.js';
import { LoadAllEndorsedLegislation } from '$lib/server/loadDataFromDatabase/LoadEndorsedLegislation.js';
import { LoadAllEndorsedReferendums } from '$lib/server/loadDataFromDatabase/LoadEndorsedReferendums.js';

export const load = async (event) => {

    const user = await event.locals.user;

    return { 

        streamed: {
            // username: await LoadAdminByEmail(session),
            user: user,
            endorsed_candidates: await LoadAllEndorsedCandidates(),
            endorsed_legislation: await LoadAllEndorsedLegislation(),
            endorsed_actions: await LoadAllEndorsedActions(),
            endorsed_referendums: await LoadAllEndorsedReferendums(),
            endorsed_amendments: await LoadAllEndorsedAmendments()
        }

    };

};