import { SvelteKitAuth } from "@auth/sveltekit";
import CredentialsProvider from "@auth/core/providers/credentials";
import { AUTHSECRETKEY } from '$env/static/private';
import { voterAuthentication } from "./lib/server/authentication/voter-authentication";
import { adminAuthentication } from "./lib/server/authentication/admin-authentication";
import { campaignAuthentication } from "./lib/server/authentication/campaign-authentication";
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */

const authorization = async ({ event, resolve }) => {

    const session = await event.locals.getSession();

    // protect any routes under /authenticated-administrator

    if (event.url.pathname.startsWith("/authenticated-administrator" || "/(app-administrator)")) {        

        if (session?.user?.name !== "administrator") {

            throw redirect(303, "/login-administrator");

        };

    };

    // protect any routes that don't start with "/authenticated-administrator" from session.user.name === admin

    if (!event.url.pathname.startsWith("/authenticated-administrator")) {

        if (session?.user?.name === "administrator") {

            throw redirect(303, "/authenticated-administrator/administrator");

        };

    };

    // protect any routes under /authenticated-campaign

    if (event.url.pathname.startsWith("/authenticated-campaign")) {

        if (session?.user?.name !== "campaign") {

            throw redirect(303, "/login-campaign");

        };

    };

    // protect any routes that don't start with "/authenticated-campaign" from session.user.name === campaign

    if (!event.url.pathname.startsWith("/authenticated-campaign")) {

        if (session?.user?.name === "campaign") {

            throw redirect(303, "/authenticated-campaign/campaign");

        };

    };

    // protect any routes under /authenticated-voter

    if (event.url.pathname.startsWith("/authenticated-voter")) {

        if (session?.user?.name !== "voter") {

            throw redirect(303, "/login-voter");
        };

    };

    // protect any routes that don't start with "/authenticated-voter" from session.user.name === voter

    if (!event.url.pathname.startsWith("/authenticated-voter")) {

        if (session?.user?.name === "voter") {

            throw redirect(303, "/authenticated-voter/voter");

        };

    };

    // if still request, proceed as normal
    

    return await resolve(event);

}

export const handle = sequence(
    
    SvelteKitAuth({

        providers: [

            CredentialsProvider({

                async authorize(credentials) {

                    if (credentials.providerId === "voter-login"){

                        // @ts-ignore
                        const response = await voterAuthentication(credentials);
                        
                        if (!response) {

                            return null;

                        };

                        const responseItem = await response;

                        return responseItem ?? null;


                    } else if (credentials.providerId === "campaign-login") {

                        // @ts-ignore
                        const response = await campaignAuthentication(credentials);
                        
                        if (!response) {

                            return null;

                        };

                        const responseItem = await response;

                        return responseItem ?? null;

                    } else if (credentials.providerId === "admin-login") {

                        // @ts-ignore
                        const response = await adminAuthentication(credentials);
                        
                        if (!response) {

                            return null;

                        };

                        const responseItem = await response;

                        return responseItem ?? null;

                    } else {

                        return null;

                    };

                }

            }),
            
        ],
        secret: AUTHSECRETKEY,
        debug: false,
        session: {
            // maxAge: 1800, // 30 mins
            strategy: "jwt"
            
        },

    }),
    authorization

);