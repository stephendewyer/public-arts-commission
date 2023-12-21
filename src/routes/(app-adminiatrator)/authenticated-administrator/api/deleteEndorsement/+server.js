import { mysqlConnection } from "$lib/server/db/mysql";
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARYCLOUDNAME } from "$env/static/private";
import { CLOUDINARYSECRETKEY } from "$env/static/private";
import { CLOUDINARYAPIKEY } from "$env/static/private";
import EndorsementCategories from "$lib/components/endorsements/endorsementsCategories/EndorsementCategories.svelte";

cloudinary.config({ 
  cloud_name: CLOUDINARYCLOUDNAME, 
  api_key: CLOUDINARYAPIKEY, 
  api_secret: CLOUDINARYSECRETKEY
});

export const POST = async ({request}) => {

    if (request.method !== 'POST') {

        return new Response(JSON.stringify({error: "method is not POST"}), {status: 422});

    };

    const data = await request.json();

    console.log(data);

    const { 
        deleteItemID,
        deleteItemName,
        deleteItemImageID,
        deleteItemImageURL,
        deleteItemCategory
    } = data;

    if (
        !deleteItemID ||
        !deleteItemName ||
        !deleteItemImageID ||
        !deleteItemImageURL ||
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

    res.end();

    return new Response(JSON.stringify({success: `${deleteItemName} deleted!`}), {status: 200});

};