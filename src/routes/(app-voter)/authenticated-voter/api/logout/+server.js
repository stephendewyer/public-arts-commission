// logout client or administrator from session

export async function POST({ cookies }) {
    console.log("logout!")
    cookies.delete("session", { path: "/" });
    return new Response(JSON.stringify({ loggedOut: true }));
};