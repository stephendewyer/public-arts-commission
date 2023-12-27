import { LoadAllEndorsedLegislation } from '$lib/server/loadDataFromDatabase/LoadEndorsedLegislation.js';

export const GET = async ({request}) => {

    if (request.method !== 'GET') {

        return new Response(JSON.stringify({error: "method is not GET"}), {status: 422});

    };

    const loadedLegislation = await LoadAllEndorsedLegislation();

    // console.log("loaded endorsed legislation from server: ", loadedLegislation);

    return new Response(

        JSON.stringify(loadedLegislation)
        
    );

};