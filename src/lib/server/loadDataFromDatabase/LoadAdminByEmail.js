import { mysqlConnection } from "$lib/server/db/mysql";

export const LoadAdminByEmail = async (/** @type {string}} */ email) => {

    let res = await mysqlConnection();

    // load query to check if row with same voter first name and voter last name exists

    const checkAdminsEmailQuery = `SELECT * FROM administrators WHERE email = '${email}'`;

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

    const username = userInAdministrators[0].username;
    
    res.end();
    
    return username;
};