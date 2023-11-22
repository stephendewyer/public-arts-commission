import { SvelteKitAuth } from "@auth/sveltekit";
import CredentialsProvider from "@auth/core/providers/credentials";
import { AUTHSECRETKEY } from '$env/static/private';
import { voterAuthentication } from "$lib/server/authentication/voter-authentication";

/** @type {import('@sveltejs/kit').Handle} */

export const handle = SvelteKitAuth({

    providers: [

        CredentialsProvider({

            async authorize(credentials) {

                if (credentials.providerId === "voter-login"){

                    // @ts-ignore
                    const response = await voterAuthentication(credentials);
                    // console.log(response);
                    if (!response) {

                        return null;

                    };

                    const responseItem = await response.json();

                    return responseItem ?? null;


                } else if (credentials.providerId === "campaign-login") {

                } else if (credentials.providerId === "admin-login") {

                } else {

                    return null;

                };
            // const result = {email: "test@test.com"}
            
            // return a user object

            }

        }),
        
    ],
    secret: AUTHSECRETKEY,
    debug: true,
    session: {
        // maxAge: 1800, // 30 mins
        strategy: "jwt"
    }
});