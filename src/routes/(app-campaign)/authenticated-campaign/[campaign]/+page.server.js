export const load = async (event) => {

    const session = await event.locals.getSession();

    return { 

        user: session?.user
        
    };

}