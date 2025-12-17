
import { LoadAllEndorsedAmendments } from '$lib/server/loadDataFromDatabase/LoadEndorsedAmendments.js';

export const GET = async ({request}) => {

    if (request.method !== 'GET') {

        return new Response(JSON.stringify({error: "method is not GET"}), {status: 422});

    };

    const loadedAmendments = await LoadAllEndorsedAmendments();

    // console.log("loaded endorsed amendments from server: ", loadedAmendments)

    return new Response(

        JSON.stringify(loadedAmendments)
        
    );

};