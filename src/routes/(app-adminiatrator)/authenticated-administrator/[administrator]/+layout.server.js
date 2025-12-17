import { LoadAdminByEmail } from '$lib/server/loadDataFromDatabase/LoadAdminByEmail.js';

export const load = async (event) => {

    const user = await event.locals.user;

    return { 

        streamed: {
            username: await LoadAdminByEmail(user.email),
            user: user
        }

    };

};