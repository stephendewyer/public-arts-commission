export const load = async (event) => {

    const user = await event.locals.user;

    return { 

        streamed: {
            user
        }

    };

};