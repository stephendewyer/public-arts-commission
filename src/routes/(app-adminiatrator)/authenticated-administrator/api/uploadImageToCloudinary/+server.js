import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARYCLOUDNAME } from "$env/static/private";
import { CLOUDINARYSECRETKEY } from "$env/static/private";
import { CLOUDINARYAPIKEY } from "$env/static/private";

cloudinary.config({ 
    cloud_name: CLOUDINARYCLOUDNAME, 
    api_key: CLOUDINARYAPIKEY, 
    api_secret: CLOUDINARYSECRETKEY
});

export async function POST({request}) {

  if (request.method !== 'POST') {

    return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});

  };

  const data = await request.json();

  const { image } = data;

  let uploadResponse;

  try {

    uploadResponse = await cloudinary.uploader.upload(image, {});

  } catch (err) {

    console.log(err);

    return new Response(JSON.stringify({error: "problem with the image upload to Cloudinary"}), {status: 500});

  };

  return new Response(JSON.stringify({secure_url: uploadResponse.secure_url}), {status: 200});

}