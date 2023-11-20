import { SvelteKitAuth } from "@auth/sveltekit";
import CredentialsProvider from "@auth/core/providers/credentials";
import { AUTHSECRETKEY } from '$env/static/private';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    if (event.url.pathname.startsWith('/custom')) {
		return new Response('custom response');
	}
    console.log("hook is working!")
	const response = await resolve(event);
	return response;
    
}


// export const handle = SvelteKitAuth({
//     providers: [
//         CredentialsProvider({
//             id: "campaign-login",
//             async authorize(credentials, request) {
//                 // function to get a user
//                 const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

//                 if (user) {
//                     // Any object returned will be saved in `user` property of the JWT
//                     return user
//                 } else {
//                     // If you return null then an error will be displayed advising the user to check their details.
//                     return null
//                 }
//             }
//         }),
//         CredentialsProvider({
//             id: "voter-login",
//             async authorize(credentials, request) {

//             }
//         }),
//         CredentialsProvider({
//             id: "admin-login",
//             async authorize(credentials, request) {

//             }
//         })
//     ],
//     secret: AUTHSECRETKEY,
//     debug: true,
//     session: {
//         maxAge: 1800, // 30 mins
//         strategy: "jwt"
//     }
// });