import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Loads user info and redirects to login if they're not logged in
 * @param event Event
 * @returns Redirect or User Info
 */
export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) return redirect(303, '/auth/login');
    return {
        user: event.locals.user
    }
};
