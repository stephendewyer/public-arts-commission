export async function POST({request}) {

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({error: "request method is incorrect"}), {status: 422});
    };

    const { country, zipcode, state, city, street, streetNumber, streetPreDir } = await request.json();

    if ( !country || !state || !city || !street || !streetNumber ) {
        // don't lookup coordinates
        return new Response(JSON.stringify({error: "incorrect information to lookup geocoordinates"}), {status: 400});
    } else {
        const URL = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${streetNumber}+${street}+${city}+${state}&benchmark=Public_AR_Current&format=json`;

        const geoResponse = await fetch(URL);
        const geoResults = await geoResponse.json();

        const match = geoResults.result.addressMatches?.[0];

        if (!match) {
            throw new Response(JSON.stringify({error: "Address not found"}), {status: 400});
        };

        const geocoordinates = geoResults.result.addressMatches[0].coordinates;

        return new Response(JSON.stringify(geocoordinates), {status: 200});

    };

};