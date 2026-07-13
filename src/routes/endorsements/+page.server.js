import { redirect } from '@sveltejs/kit';

export function load() {
    // 302: Temporary redirect, 301: Permanent redirect
    redirect(301, '/endorsements/find-my-voter-location');
}