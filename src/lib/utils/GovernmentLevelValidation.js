export const GovernmentLevelValidation = (/** @type {string} */ governmentLevel, /** @type {string} */ state, /** @type {string} */ county, /** @type {string} */ city) => {

    if (governmentLevel === "state" && state === "") {

        return new Response(JSON.stringify({error: "state value missing for government level of state!"}), {status: 422});

    } else if (governmentLevel === "county" && county === "" && state !== "") {

        return new Response(JSON.stringify({error: "county value missing for government level of county!"}), {status: 422});

    } else if (governmentLevel === "county" && county === "" && state === "") {

        return new Response(JSON.stringify({error: "county and state values missing for government level of county!"}), {status: 422});

    } else if (governmentLevel === "county" && county !== "" && state === "") {

        return new Response(JSON.stringify({error: "state value missing for government level of county!"}), {status: 422});

    } else if (governmentLevel === "city" && city !== "" && county !== "" && state === "") {

        return new Response(JSON.stringify({error: "state value missing for government level of city!"}), {status: 422});
        
    } else if (governmentLevel === "city" && city !== "" && county === "" && state === "") {

        return new Response(JSON.stringify({error: "state and county values missing for government level of city!"}), {status: 422});
        
    } else if (governmentLevel === "city" && city === "" && county === "" && state === "") {

        return new Response(JSON.stringify({error: "state, county and city values missing for government level of city!"}), {status: 422});
        
    } else if (governmentLevel === "city" && city === "" && county === "" && state !== "") {

        return new Response(JSON.stringify({error: "county and city values missing for government level of city!"}), {status: 422});
        
    } else if (governmentLevel === "city" && city === "" && county !== "" && state !== "") {

        return new Response(JSON.stringify({error: "city value missing for government level of city!"}), {status: 422});
        
    } else if (governmentLevel === "city" && city !== "" && county === "" && state !== "") {

        return new Response(JSON.stringify({error: "county value missing for government level of city!"}), {status: 422});
        
    };

};
