import type {PageServerLoad} from './$types';
import {redirect} from '@sveltejs/kit';

/**
 * Loads user info and redirects to home if they're logged in.
 * @param locals Info 
 * @returns Redirect
 */
export const load: PageServerLoad = ({locals}) => {
    if (locals.user) {
        return redirect(302, '/');
    }
};
