import { mysqlConnection } from "$lib/server/db/mysql";

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

    const username = userInAdministrators[0].username;

    return { 

        username: username,
        user: session?.user
        
    };

}