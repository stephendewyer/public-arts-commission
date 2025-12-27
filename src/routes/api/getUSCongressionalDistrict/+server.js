export async function POST({request}) {

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({error: "request method is incorrect"}), {status: 422});
    };

    const { latitude, longitude } = await request.json();

    const districtUrl =
        "https://geocoding.geo.census.gov/geocoder/geographies/coordinates" +
        `?x=${longitude}&y=${latitude}` +
        "&benchmark=Public_AR_Current" +
        "&vintage=Current_Current" +
        "&layers=54" +
        "&format=json";

    const districtResponse = await fetch(districtUrl);
    const districtData = await districtResponse.json();

    // if latitude and longitude are not in the US, return user is not in the US

    const state = districtData.result.geographies[`119th Congressional Districts`][0].STATE;

    if (!state) {

        return new Response(JSON.stringify({error: "coordinates come from outside United States"}), {status: 400})

    } else {
        // will need to update Congress session after session
        const USCongressionalDistrict = districtData.result.geographies[`119th Congressional Districts`][0].BASENAME;
        return new Response(JSON.stringify({success: USCongressionalDistrict}), {status: 200});
    };    

};