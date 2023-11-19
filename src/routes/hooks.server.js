import { SvelteKitAuth } from "@auth/sveltekit";
import Auth0Provider from "@auth/core/providers/auth0";


export const handle = SvelteKitAuth({
    providers: [
        Auth0Provider({
            id: 'auth0',
            name: 'Auth0',
            clientId: '-client-id-',
            clientSecret: '-client-secret-',
            // issue: 'https://dev-****.auth0.com/', // remember to add trailing `/`
            wellKnown: 'https://dev-****.auth0.com/.well-known/openid-configuration'
        })
    ],
    secret: '-any-random-string-',
    debug: true,
    session: {
        maxAge: 1800 // 30 mins
    }
});