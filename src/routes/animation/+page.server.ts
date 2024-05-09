import type { PageServerLoad } from './$types';

/**
 * Loads user info (if they're logged in)
 * @param event Event (Contains locals)
 * @returns User Info (May be NULL)
 */
export const load: PageServerLoad = async (event) => {
    return {
        user: event.locals.user
    }
};
