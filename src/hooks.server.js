// runs on every request -- attaches user to event.locals

import { verifyAccessToken } from "$lib/server/authentication/auth";
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {

    const token = event.cookies.get("session");

    if (token) {
        try {
            event.locals.user = verifyAccessToken(token);  
        } catch {
            event.locals.user = null;
        };
    } else {
        event.locals.user = null;
    };
    
    const user = event.locals.user;

    // protect routes for authenticated client
    
    //redirect users to "/authenticated-administrator/admin" if startsWith("/authenticated-administrator") is false

    if (
        !event.url.pathname.startsWith("/authenticated-administrator") && 
        user?.role === "administrator"
    ) {

        redirect(303, "/authenticated-administrator/admin");

    };

    // protect any routes under /authenticated-administrator

    if (event.url.pathname.startsWith("/authenticated-administrator")) {        

        if (user?.role !== "administrator") {

            redirect(303, "/login-administrator");

        };

    };

    // protect any routes under /authenticated-campaign

    if (event.url.pathname.startsWith("/authenticated-campaign")) {

        if (user?.role !== "campaign") {

            redirect(303, "/login-campaign");

        };

    };

    // protect any routes that don't start with "/authenticated-campaign" from session.user.name === campaign

    if (
        !event.url.pathname.startsWith("/authenticated-campaign") &&
        user?.role === "campaign"
    ) {

        redirect(303, "/authenticated-campaign/");

    };

    // protect any routes under /authenticated-voter

    if (event.url.pathname.startsWith("/authenticated-voter")) {

        if (user?.role !== "voter") {

            redirect(303, "/login-voter");
        };

    };

    // protect any routes that don't start with "/authenticated-voter" from session.user.name === voter

    if (
        !event.url.pathname.startsWith("/authenticated-voter") &&
        user?.role === "voter"
    ) {
        
        redirect(303, "/authenticated-voter/voter");
        
    };

    return resolve(event);

};