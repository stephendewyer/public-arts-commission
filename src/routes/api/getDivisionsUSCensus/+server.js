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

        const getStateFips = (/** @type {{ [x: string]: any; }} */ geographies) => {
            const states = geographies["States"];

            if (!states || !states[0]) {
                return null;
            }

            return states[0].STATE;
        };

        const stateFips = getStateFips(geographies);

        // console.log("State FIPS:", stateFips);

        /**
         * @param {{ [x: string]: any[]; }} geographies
         * @param {string} suffix
         */
        const getGeography = (
            geographies,
            suffix
        ) => {
            const key = Object.keys(geographies).find(key =>
                key.endsWith(suffix)
            );

            return key ? geographies[key][0] : null;
        };


        /**
         * @param {{ [x: string]: any; SLDU?: any; SLDL?: district; }} district
         */
        const getDistrictNumber = (district) => {

            if (!district) return null;

            const cdKey = Object.keys(district).find(key =>
                /^CD\d+FP$/.test(key)
            );

            if (cdKey) return district[cdKey];

            if (district.SLDU) return district.SLDU;
            if (district.SLDL) return district.SLDL;

            // Census Geocoder commonly provides this
            if ("BASENAME" in district) return district.BASENAME;

            return null;
        };

        // extract the Congressional and State legislative districts


        const extractStateLegislativeDistricts = (
            /** @type {{ [x: string]: any[]; }} */ geographies, 
            /** @type {undefined} */ stateFips
        ) => {
            const districts = [];

            const upper = getGeography(
                geographies,
                "State Legislative Districts - Upper"
            );

            if (upper) {
                districts.push({
                    chamber: stateFips === "31"
                        ? "unicameral"
                        : "upper",

                    district: getDistrictNumber(upper) ?? ""
                });
            }

            const lower = getGeography(
                geographies,
                "State Legislative Districts - Lower"
            );

            if (lower) {
                districts.push({
                    chamber: "lower",
                    district: getDistrictNumber(lower)
                });
            }

            // Nebraska
            if (districts.length === 0) {
                const unicameral = getGeography(
                    geographies,
                    "State Legislative Districts"
                );

                if (unicameral) {
                    districts.push({
                        chamber: "unicameral",
                        district: getDistrictNumber(unicameral)
                    });
                }
            };

            return districts;
        };

        const congressional = getGeography(
            geographies,
            "Congressional Districts"
        );

        const districts = {
            congressional: congressional
                ? getDistrictNumber(congressional)
                : null,
            stateLegislative: extractStateLegislativeDistricts(
                geographies, 
                stateFips
            )
        };

        // console.log(districts);
    
        return new Response(JSON.stringify({success: districts}), {status: 200});
    };
    
};