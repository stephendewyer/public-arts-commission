import { GoogleCivicInfoAPIKey } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const { address } = await request.json();

    const url = new URL(
        'https://www.googleapis.com/civicinfo/v2/divisionsByAddress'
    );

    url.searchParams.set('key', GoogleCivicInfoAPIKey);
    url.searchParams.set('address', address);

    const response = await fetch(url);

    if (!response.ok) {
        return new Response(JSON.stringify(
            { error: await response.text() }),
            { status: response.status }
        );
    };

    const data = await response.json();

    return new Response(JSON.stringify({success: data}), {status: 200});
}