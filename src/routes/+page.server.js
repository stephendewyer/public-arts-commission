import { mysqlConnection } from "$lib/server/db/mysql";

export async function load()  {
    let res = await mysqlConnection();

    const allVotersQuery = 'SELECT * FROM voters';
    const [rows, fields] = await res.query(allVotersQuery);

    // convert the rows into valid json to avoid OKPacket type

    const rowsJson = JSON.parse(JSON.stringify(rows));

    // console.log(rows);
    // console.log(fields);

    return {
        data: rowsJson
    }
}