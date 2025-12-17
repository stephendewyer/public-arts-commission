import { LoadAllEndorsedCandidates } from '$lib/server/loadDataFromDatabase/LoadEndorsedCandidates.js';

export async function GET({request}) {

    if (request.method !== 'GET') {
        return new Response(JSON.stringify({error: "request method is incorrect"}), {status: 422});
    };

    let endorsed_candidates = await LoadAllEndorsedCandidates();

    return new Response(JSON.stringify(endorsed_candidates), {status: 200});

};