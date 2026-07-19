export async function POST({request}) {

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({error: "request method is incorrect"}), {status: 422});
    };

    const { latitude, longitude } = await request.json();

    const districtUrl =
        `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${Number(longitude)}&y=${Number(latitude)}&benchmark=Public_AR_Current&vintage=Current_Current&layers=all&format=json`;

    const districtResponse = await fetch(districtUrl);

    if (!districtResponse.ok) {
        return new Response(JSON.stringify(
            { error: await districtResponse.text() }),
            { status: districtResponse.status }
        );
    } else {
        const districtData = await districtResponse.json();

        const geographies = districtData.result.geographies;

        /**
         * @param {{ [x: string]: any[]; }} geographies
         * @param {RegExp} pattern
         */
        function findGeography(
            geographies,
            pattern
        ) {
            const key = Object.keys(geographies)
                .find(k => pattern.test(k));

            return key
                ? geographies[key]?.[0]
                : null;
        };


        const USCongressional =
            findGeography(
                geographies,
                /Congressional District/i
            );

        const stateSenate =
            findGeography(
                geographies,
                /Upper/i
            );

        const stateHouse =
            findGeography(
                geographies,
                /Lower/i
            );

        const results = { 
            USCongressional: USCongressional.BASENAME, 
            stateSenate: stateSenate.BASENAME, 
            stateHouse: stateHouse.BASENAME
        }
    
        return new Response(JSON.stringify({success: results}), {status: 200});
    };
    
};