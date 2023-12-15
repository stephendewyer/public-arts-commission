export const load = async (event) => {

    const session = await event.locals.getSession();

    return { 

        streamed: {
            user: session?.user
        }
        
    };

}