import { mysqlConnection } from "$lib/server/db/mysql";
import { 
    LoadAllEndorsedCandidates, 
    LoadAllEndorsedActions, 
    LoadAllEndorsedAmendments,
    LoadAllEndorsedLegislation,
    LoadAllEndorsedReferendums
 } from "$lib/server/LoadDataFromDatabaseFunctions.js";

export const load = async (event) => {

    const session = await event.locals.getSession();

    let res = await mysqlConnection();

    // load query to check if row with same voter first name and voter last name exists

    const checkAdminsEmailQuery = `SELECT * FROM administrators WHERE email = '${session?.user?.email}'`;

    /**
     * @type {string | any[]}
     */
    let userInAdministrators = [];

    await res.query(checkAdminsEmailQuery)
    .then(([ rows ]) => {

        userInAdministrators = JSON.parse(JSON.stringify(rows));

    })
    .catch(error => {

        throw error;

    });

    res.end();

    const username = userInAdministrators[0].username;

    // load all the endorsed candidates from the database

    const endorsedCandidates = await LoadAllEndorsedCandidates();

    const endorsedAmendments = await LoadAllEndorsedAmendments();

    const endorsedActions = await LoadAllEndorsedActions();

    const endorsedLegislation = await LoadAllEndorsedLegislation();

    const endorsedReferendums = await LoadAllEndorsedReferendums();

    return { 

        username: username,
        user: session?.user,
        endorsed_candidates: endorsedCandidates,
        endorsed_legislation: endorsedLegislation,
        endorsed_actions: endorsedActions,
        endorsed_referendums: endorsedReferendums,
        endorsed_amendments: endorsedAmendments

    };

};