import { LoadAllEndorsedAmendments } from "$lib/server/loadDataFromDatabase/LoadEndorsedAmendments";

export async function GET({request}) {

    if (request.method !== 'GET') {
        return new Response(JSON.stringify({error: "request method is incorrect"}), {status: 422});
    };

    let endorsed_amendments = await LoadAllEndorsedAmendments();

    return new Response(JSON.stringify(endorsed_amendments), {status: 200});

};