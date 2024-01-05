import { LoadAllEndorsedActions } from '$lib/server/loadDataFromDatabase/LoadEndorsedActions.js';

export const load = async () => {

    return { 
        
        streamed: {

            endorsed_actions: await LoadAllEndorsedActions()
            
        }

    };

};
