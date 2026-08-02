export async function POST({request}) {

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({error: "request method is incorrect"}), {status: 422});
    };

    const { country, zipcode, state, city, street, streetNumber, streetPreDir } = await request.json();


    if ( !country || !state || !city || !street || !streetNumber ) {
        // don't lookup coordinates
        return new Response(JSON.stringify({error: "incorrect information to lookup geocoordinates"}), {status: 400});
        
    } else if (
        country.toUpperCase() !== "US" && 
        country.toUpperCase() !== "USA" &&
        country.toUpperCase() !== "UNITED STATES OF AMERICA" &&
        country.toUpperCase() !== "UNITED STATES"
    ) {
        return new Response(
            JSON.stringify({
                error: "Only addresses inside the United States accepted"
            }),
            { status: 400 }
        );
    } else {
        const URL = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${streetNumber}+${street}+${city}+${state}&benchmark=Public_AR_Current&format=json`;

        const geoResponse = await fetch(URL);
        const geoResults = await geoResponse.json();

        const match = geoResults.result.addressMatches?.[0];

        if (!match) {
            return new Response(JSON.stringify({error: "Address not found"}), {status: 404});
        };

        const geocoordinates = match.coordinates;

        return new Response(JSON.stringify({success: geocoordinates}), {status: 200});

    };

};