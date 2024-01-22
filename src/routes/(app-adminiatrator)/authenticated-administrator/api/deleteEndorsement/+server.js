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

        // delete the endorsed candidate row from endorsed_candidates where candidate_ID = deleteItemID

        const deleteCandidateStatement = `DELETE FROM endorsed_candidates
        WHERE candidate_ID = ${deleteItemID}`;

        await res.query(deleteCandidateStatement)
        .then(() => {
        })
        .catch(error => {
            throw error;
        });

    } else if (deleteItemCategory === "amendment") {

        // delete the endorsed amendment row from endorsed_amendments where amendment_ID = deleteItemID

        const deleteAmendmentStatement = `DELETE FROM endorsed_amendments
        WHERE action_ID = ${deleteItemID}`;

        await res.query(deleteAmendmentStatement)
        .then(() => {
        })
        .catch(error => {
            throw error;
        });


    } else if (deleteItemCategory === "action") {

        // delete the endorsed action row from endorsed_actions where action_ID = deleteItemID

        const deleteActionStatement = `DELETE FROM endorsed_actions
        WHERE action_ID = ${deleteItemID}`;

        await res.query(deleteActionStatement)
        .then(() => {
        })
        .catch(error => {
            throw error;
        });

    } else if (deleteItemCategory === "legislation") {

        // delete the endorsed legislation row from endorsed_legislation where legislation_ID = deleteItemID

        const deleteLegislationStatement = `DELETE FROM endorsed_legislation
        WHERE legislation_ID = ${deleteItemID}`;

        await res.query(deleteLegislationStatement)
        .then(() => {
        })
        .catch(error => {
            throw error;
        });

    } else if (deleteItemCategory === "referendum") {

        // delete the endorsed referendum row from endorsed_referendum where referendum_ID = deleteItemID

        const deleteReferendumStatement = `DELETE FROM endorsed_referendums
        WHERE referendum_ID = ${deleteItemID}`;

        await res.query(deleteReferendumStatement)
        .then(() => {
        })
        .catch(error => {
            throw error;
        });

    };

    try {

        await cloudinary.uploader.destroy(deleteItemImagePublicID, {});
    
      } catch (err) {
    
        console.log(err);
    
        return new Response(JSON.stringify({error: "problem with deleting image from Cloudinary"}), {status: 500});
    
    };

    res.end();

    return new Response(JSON.stringify({success: `${deleteItemName} deleted!`}), {status: 200});

};