import { LoadAllEndorsedCandidates } from '$lib/server/loadDataFromDatabase/LoadEndorsedCandidates.js';

export const GET = async ({request}) => {

    if (request.method !== 'GET') {

        return new Response(JSON.stringify({error: "method is not GET"}), {status: 422});

    };

    const loadedCandidates = await LoadAllEndorsedCandidates();

    // console.log("loaded endorsed candidates from server: ", loadedCandidates)

    return new Response(

        JSON.stringify(loadedCandidates)

    );

};