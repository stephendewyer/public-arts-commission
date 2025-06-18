import { GoogleCivicInfoAPIKey } from '$env/static/private';

export async function POST({request}) {

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({error: "request method is incorrect"}), {status: 422});
    };

    const data = await request.json();
    const country = data.country;
    const zipcode = data.zipcode;
    const state = data.state;
    const city = data.city;
    const street = data.street;
    const streeNumber = data.streeNumber;



    const url = `https://googleapis.com/civicinfo/v2/representatives?address=${streeNumber}+${street},+${city},+${state}+${zipcode}&key=${GoogleCivicInfoAPIKey}`;

    console.log(url)
    return new Response(JSON.stringify(url), {status: 200});

};