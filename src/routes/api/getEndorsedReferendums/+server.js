import { LoadAllEndorsedReferendums } from "$lib/server/loadDataFromDatabase/LoadEndorsedReferendums";

export async function GET({request}) {

    if (request.method !== 'GET') {
        return new Response(JSON.stringify({error: "request method is incorrect"}), {status: 422});
    };

    let endorsed_referendums = await LoadAllEndorsedReferendums();

    return new Response(JSON.stringify(endorsed_referendums), {status: 200});

};