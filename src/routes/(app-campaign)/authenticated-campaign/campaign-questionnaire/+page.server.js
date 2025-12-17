import { redirect } from '@sveltejs/kit';

export const load = async () => {

    redirect(302, '/authenticated-campaign/campaign-registration');

};
