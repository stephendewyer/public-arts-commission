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

    const USCongressionalDistrict = districtData.result.geographies['119th Congressional Districts'][0].BASENAME;

    return new Response(JSON.stringify(USCongressionalDistrict), {status: 200});

};