import { LoadAllEndorsedReferendums } from '$lib/server/loadDataFromDatabase/LoadEndorsedReferendums.js';

export const GET = async ({request}) => {

    if (request.method !== 'GET') {

        return new Response(JSON.stringify({error: "method is not GET"}), {status: 422});

    };

    const loadedReferendums = await LoadAllEndorsedReferendums();

    // console.log("loaded endorsed referendums from server: ", loadedReferendums);

    return new Response(

        JSON.stringify(loadedReferendums)
        
    );

};