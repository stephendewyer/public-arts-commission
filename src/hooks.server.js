import { SvelteKitAuth } from "@auth/sveltekit";
import CredentialsProvider from "@auth/core/providers/credentials";
import { AUTHSECRETKEY } from '$env/static/private';
import { voterAuthentication } from "$lib/server/authentication/voter-authentication";
import { adminAuthentication } from "$lib/server/authentication/admin-authentication";
import { campaignAuthentication } from "$lib/server/authentication/campaign-authentication";

/** @type {import('@sveltejs/kit').Handle} */

export const handle = SvelteKitAuth({

    providers: [

        CredentialsProvider({

            async authorize(credentials) {

                if (credentials.providerId === "voter-login"){

                    // @ts-ignore
                    const response = await voterAuthentication(credentials);
                    
                    if (!response) {

                        return null;

                    };

                    const responseItem = await response.json();

                    return responseItem ?? null;


                } else if (credentials.providerId === "campaign-login") {

                    // @ts-ignore
                    const response = await campaignAuthentication(credentials);
                    
                    if (!response) {

                        return null;

                    };

                    const responseItem = await response.json();

                    return responseItem ?? null;

                } else if (credentials.providerId === "admin-login") {

                    // @ts-ignore
                    const response = await adminAuthentication(credentials);
                    
                    if (!response) {

                        return null;

                    };

                    const responseItem = await response.json();

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
    }
});