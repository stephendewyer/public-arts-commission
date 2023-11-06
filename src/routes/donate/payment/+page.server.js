import { stripe } from '$lib/server/stripe/stripe';
import { mysqlConnection } from "$lib/server/db/mysql";
import { STRIPESECRETAPIKey } from '$env/static/private';

export const load = async ({ url }) => {
    console.log(url);
}
