import { error } from '@sveltejs/kit';

export function load({ params }) {

    const tokenID = params.token_id;

    if (!tokenID) {

        throw error(404, 'no token ID!');

    } else {

        return { tokenID };

    };
};