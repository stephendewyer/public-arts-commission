import { redirect } from "@sveltejs/kit";

export const load = async (event) => {

    const session = await event.locals.getSession();

    console.log(session)

    if (session?.user?.name !== "campaign") {

        throw redirect(303, "/");

    };

    return {};
    
}