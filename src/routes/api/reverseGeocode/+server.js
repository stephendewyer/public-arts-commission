import {TOMTOMAPIKey} from '$env/static/private';

export async function POST({request}) {

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({error: "request method is incorrect"}), {status: 422});
    };

    console.log("reverseGeocode!")
  
    const data = await request.json();
  
    const latitude = data.latitude;
    const longitude = data.longitude;
  
    if (
      !latitude ||
      !longitude 
    ) {
      return new Response(JSON.stringify({error: "missing latitude and/or longitude data"}), {status: 422});
    }

    const geoApiUrl = `https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?key=${TOMTOMAPIKey}&radius=100`;
    
    try {

        const response = await fetch(geoApiUrl);

        const responseData = await response.json();

        return new Response(JSON.stringify(responseData), {status: 200});

    } catch (error) {

        console.log(error);

        return new Response(JSON.stringify({error: "failed to fetch data from geoApiUrl"}), {status: 422});

    }
  
  }