import { mysqlConnection } from "$lib/server/db/mysql";
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARYCLOUDNAME } from "$env/static/private";
import { CLOUDINARYSECRETKEY } from "$env/static/private";
import { CLOUDINARYAPIKEY } from "$env/static/private";

cloudinary.config({ 
  cloud_name: CLOUDINARYCLOUDNAME, 
  api_key: CLOUDINARYAPIKEY, 
  api_secret: CLOUDINARYSECRETKEY
});

export const DELETE = async ({request}) => {

    if (request.method !== 'DELETE') {

        return new Response(JSON.stringify({error: "method is not DELETE"}), {status: 422});

    };

    const data = await request.json();

    const { 
        deleteItem
    } = data;

    if (
        !deleteItem
    ) {

        return new Response(JSON.stringify({error: "missing data to delete endorsement!"}), {status: 422});

    };

    console.log(deleteItem);

    // connect to the database

    // delete endorsement from database

    let res = await mysqlConnection();

    const deleteCampaignApplicationStatement = `DELETE FROM campaign_applications
        WHERE campaign_application_ID = ${deleteItem.campaign_application_ID}`;

    await res.query(deleteCampaignApplicationStatement)
    .then(() => {
    })
    .catch(error => {
        throw error;
    });

    // delete campaign application image from Cloudinary

    try {

        await cloudinary.uploader.destroy(deleteItem.public_ID, {});
    
      } catch (err) {
    
        console.log(err);
    
        return new Response(JSON.stringify({error: "problem with deleting image from Cloudinary"}), {status: 500});
    
    };

    res.end();

    return new Response(JSON.stringify({success: `application for ${deleteItem.campaign_name} deleted!`}), {status: 200});

};