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

    console.log(data);

    const { 
        deleteItemID,
        deleteItemName,
        deleteItemImageID,
        deleteItemImagePublicID,
        deleteItemCategory
    } = data;

    if (
        !deleteItemID ||
        !deleteItemName ||
        !deleteItemImageID ||
        !deleteItemImagePublicID ||
        !deleteItemCategory 
    ) {

        return new Response(JSON.stringify({error: "missing data to delete endorsement!"}), {status: 422});

    };

    // connect to the database

    // delete endorsement from database

    let res = await mysqlConnection();

    if (deleteItemCategory === "candidate") {
        const deleteCandidateStatement = `DELETE FROM endorsed_candidates
        WHERE candidate_ID = ${deleteItemID}`;

        await res.query(deleteCandidateStatement)
        .then(() => {
        })
        .catch(error => {
            throw error;
        });

    } else if (deleteItemCategory === "amendment") {

    } else if (deleteItemCategory === "action") {

    } else if (deleteItemCategory === "legislation") {

    } else if (deleteItemCategory === "referendum") {

    };

    let deleteResponse;

    try {

        deleteResponse = await cloudinary.uploader.destroy(deleteItemImagePublicID, {});
    
      } catch (err) {
    
        console.log(err);
    
        return new Response(JSON.stringify({error: "problem with deleting image from Cloudinary"}), {status: 500});
    
    };

    res.end();

    return new Response(JSON.stringify({success: `${deleteItemName} deleted!`}), {status: 200});

};