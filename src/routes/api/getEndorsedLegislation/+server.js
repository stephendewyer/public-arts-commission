import { LoadAllEndorsedLegislation } from "$lib/server/loadDataFromDatabase/LoadEndorsedLegislation";

export async function GET({request}) {

    if (request.method !== 'GET') {
        return new Response(JSON.stringify({error: "request method is incorrect"}), {status: 422});
    };

    let endorsed_legislation = await LoadAllEndorsedLegislation();

    return new Response(JSON.stringify(endorsed_legislation), {status: 200});

};