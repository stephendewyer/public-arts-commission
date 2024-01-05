import { LoadAllEndorsedActions } from '$lib/server/loadDataFromDatabase/LoadEndorsedActions.js';

export const GET = async ({request}) => {

    if (request.method !== 'GET') {

        return new Response(JSON.stringify({error: "method is not GET"}), {status: 422});

    };

    const loadedActions = await LoadAllEndorsedActions();

    // console.log("loaded endorsed candidates on from server: ", loadedActions)

    return new Response(

        JSON.stringify(loadedActions)
        
    );

};