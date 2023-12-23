import { LoadAdminByEmail } from '$lib/server/loadDataFromDatabase/LoadAdminByEmail.js';

export const load = async (event) => {

    const session = await event.locals.getSession();

    return { 

        streamed: {
            username: await LoadAdminByEmail(session),
            user: session?.user
        }

    };

};