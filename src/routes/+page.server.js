import { mysqlConnection } from "$lib/server/db/mysql";

export async function load()  {
    let res = await mysqlConnection();

    const allVotersQuery = 'SELECT * FROM voters';
    const [rows, fields] = await res.query(allVotersQuery);

    // console.log(rows);
    // console.log(fields);

    return {
        data: rows
    }
}