import { LoadAllEndorsedActions } from "$lib/server/loadDataFromDatabase/LoadEndorsedActions";

export async function GET({request}) {

    if (request.method !== 'GET') {
        return new Response(JSON.stringify({error: "request method is incorrect"}), {status: 422});
    };

    let endorsed_actions = await LoadAllEndorsedActions();

    return new Response(JSON.stringify(endorsed_actions), {status: 200});

};